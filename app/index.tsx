import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';

export default function IndexRoute() {
  const { actor } = useAuth();

  return <Redirect href={actor ? '/(app)/home' : '/(Auth)/sign-in'} />;
}
