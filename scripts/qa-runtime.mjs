process.env.EXPO_PUBLIC_DISABLE_MOCK_API = '0';

const { mockRequest, MockBackendError } = await import('../src/api/mock-backend.ts');

let passed = 0;
let failed = 0;

function pass(name) {
  passed += 1;
  console.log(`PASS: ${name}`);
}

function fail(name, reason) {
  failed += 1;
  console.log(`FAIL: ${name} -> ${reason}`);
}

async function expectOk(name, fn) {
  try {
    const value = await fn();
    pass(name);
    return value;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    fail(name, detail);
    return null;
  }
}

async function expectError(name, expectedStatus, expectedCode, fn) {
  try {
    await fn();
    fail(name, 'Expected error but succeeded');
  } catch (error) {
    if (error instanceof MockBackendError) {
      if (error.status === expectedStatus && error.code === expectedCode) {
        pass(name);
        return;
      }
      fail(name, `Expected ${expectedStatus}/${expectedCode} got ${error.status}/${error.code}`);
      return;
    }

    fail(name, `Unexpected error type: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const ownerEmail = `owner.${Date.now()}@cerca.test`;
const customerEmail = `customer.${Date.now()}@cerca.test`;
const intruderEmail = `intruder.${Date.now()}@cerca.test`;

const ownerAuth = await expectOk('sign up owner', () => mockRequest('/auth/sign-up', {
  method: 'POST',
  body: { email: ownerEmail, password: 'SecurePass123!', displayName: 'Owner User' },
}));

await expectError('duplicate email rejected', 409, 'EMAIL_EXISTS', () => mockRequest('/auth/sign-up', {
  method: 'POST',
  body: { email: ownerEmail, password: 'SecurePass123!', displayName: 'Owner User' },
}));

await expectError('invalid email rejected', 400, 'VALIDATION_ERROR', () => mockRequest('/auth/sign-up', {
  method: 'POST',
  body: { email: 'invalid-email', password: 'SecurePass123!', displayName: 'Bad Email' },
}));

await expectError('short password rejected', 400, 'VALIDATION_ERROR', () => mockRequest('/auth/sign-up', {
  method: 'POST',
  body: { email: `short.${Date.now()}@cerca.test`, password: '123', displayName: 'Short Password' },
}));

await expectError('wrong credentials rejected', 401, 'INVALID_CREDENTIALS', () => mockRequest('/auth/sign-in', {
  method: 'POST',
  body: { email: ownerEmail, password: 'WrongPass999!' },
}));

const ownerSignIn = await expectOk('owner sign in', () => mockRequest('/auth/sign-in', {
  method: 'POST',
  body: { email: ownerEmail, password: 'SecurePass123!' },
}));

const customerAuth = await expectOk('sign up customer', () => mockRequest('/auth/sign-up', {
  method: 'POST',
  body: { email: customerEmail, password: 'SecurePass123!', displayName: 'Customer User' },
}));

const intruderAuth = await expectOk('sign up intruder', () => mockRequest('/auth/sign-up', {
  method: 'POST',
  body: { email: intruderEmail, password: 'SecurePass123!', displayName: 'Intruder User' },
}));

if (!ownerAuth || !ownerSignIn || !customerAuth || !intruderAuth) {
  console.log('Aborting QA due to failed setup');
  process.exit(1);
}

const ownerToken = ownerSignIn.accessToken;
const customerToken = customerAuth.accessToken;
const intruderToken = intruderAuth.accessToken;

const createdListing = await expectOk('owner creates listing draft', () => mockRequest('/listings', {
  method: 'POST',
  token: ownerToken,
  body: {
    categoryId: 'home',
    title: 'Servicio QA',
    description: 'Servicio para pruebas de seguridad y autorización',
    pricing: { model: 'fixed', price: { amountMinor: 15000, currency: 'COP' } },
    location: { lat: 4.71, lng: -74.07 },
  },
}));

if (!createdListing) {
  console.log('Aborting QA due to listing creation failure');
  process.exit(1);
}

await expectError('owner cannot book own listing', 400, 'VALIDATION_ERROR', () => mockRequest('/bookings', {
  method: 'POST',
  token: ownerToken,
  body: { listingId: createdListing.id, note: 'self booking' },
}));

await expectError('cannot book draft listing', 409, 'INVALID_STATE', () => mockRequest('/bookings', {
  method: 'POST',
  token: customerToken,
  body: { listingId: createdListing.id },
}));

await expectOk('owner publishes listing', () => mockRequest(`/listings/${createdListing.id}/publish`, {
  method: 'POST',
  token: ownerToken,
}));

const booking = await expectOk('customer creates booking on published listing', () => mockRequest('/bookings', {
  method: 'POST',
  token: customerToken,
  body: { listingId: createdListing.id, note: 'first booking' },
}));

if (!booking) {
  console.log('Aborting QA due to booking creation failure');
  process.exit(1);
}

await expectError('duplicate active booking blocked', 409, 'DUPLICATE_BOOKING', () => mockRequest('/bookings', {
  method: 'POST',
  token: customerToken,
  body: { listingId: createdListing.id, note: 'duplicate booking' },
}));

await expectError('intruder cannot read foreign booking', 403, 'FORBIDDEN', () => mockRequest(`/bookings/${booking.id}`, {
  method: 'GET',
  token: intruderToken,
}));

await expectError('intruder cannot accept foreign booking', 403, 'FORBIDDEN', () => mockRequest(`/bookings/${booking.id}/accept`, {
  method: 'POST',
  token: intruderToken,
  body: { scheduledFor: new Date(Date.now() + 3600000).toISOString() },
}));

await expectError('review blocked before completion', 409, 'INVALID_STATE', () => mockRequest(`/bookings/${booking.id}/review`, {
  method: 'POST',
  token: customerToken,
  body: { rating: 5, body: 'early review' },
}));

await expectError('customer cannot list provider bookings without provider capacity', 403, 'FORBIDDEN', () => mockRequest('/bookings', {
  method: 'GET',
  token: customerToken,
}, { role: 'provider', limit: 20 }));

await expectError('normal user cannot moderate listing', 403, 'FORBIDDEN', () => mockRequest(`/listings/${createdListing.id}/moderate`, {
  method: 'POST',
  token: customerToken,
  body: { action: 'under_review', reason: 'test' },
}));

await expectError('owner cannot report own listing', 400, 'VALIDATION_ERROR', () => mockRequest(`/listings/${createdListing.id}/report`, {
  method: 'POST',
  token: ownerToken,
  body: { reason: 'self report' },
}));

await expectOk('customer creates report on listing', () => mockRequest(`/listings/${createdListing.id}/report`, {
  method: 'POST',
  token: customerToken,
  body: { reason: 'suspicious content' },
}));

await expectError('non-moderator cannot list reports', 403, 'FORBIDDEN', () => mockRequest('/reports', {
  method: 'GET',
  token: customerToken,
}));

await expectOk('owner accepts booking', () => mockRequest(`/bookings/${booking.id}/accept`, {
  method: 'POST',
  token: ownerToken,
  body: { scheduledFor: new Date(Date.now() + 7200000).toISOString() },
}));

await expectError('cannot decline accepted booking', 409, 'INVALID_STATE', () => mockRequest(`/bookings/${booking.id}/decline`, {
  method: 'POST',
  token: ownerToken,
  body: { reason: 'unavailable' },
}));

await expectOk('owner completes booking', () => mockRequest(`/bookings/${booking.id}/complete`, {
  method: 'POST',
  token: ownerToken,
}));

await expectOk('customer writes review after completion', () => mockRequest(`/bookings/${booking.id}/review`, {
  method: 'POST',
  token: customerToken,
  body: { rating: 5, body: 'great service' },
}));

await expectError('second review blocked', 409, 'REVIEW_ALREADY_EXISTS', () => mockRequest(`/bookings/${booking.id}/review`, {
  method: 'POST',
  token: customerToken,
  body: { rating: 4, body: 'second review' },
}));

console.log(`\nQA RESULTS: passed=${passed} failed=${failed}`);
if (failed > 0) {
  process.exit(1);
}
