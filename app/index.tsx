import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';

export default function IndexRoute() {
  const { accessToken } = useAuth();

  return <Redirect href={accessToken ? '/(app)/home' : '/(Auth)/sign-in'} />;
}
