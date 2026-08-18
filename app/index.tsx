import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';

export default function IndexRoute() {
  const { actor, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Redirect href={actor ? '/(app)/home' : '/(Auth)/sign-in'} />;
}
