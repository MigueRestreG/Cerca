import { Redirect } from 'expo-router';

import TabsLayout from '@/features/navigation/app-tabs-layout';
import { useAuth } from '@/providers/auth-provider';

export default function AppLayout() {
	const { actor, loading } = useAuth();

	if (loading) {
		return null;
	}

	if (!actor) {
		return <Redirect href="/(Auth)/sign-in" />;
	}

	return <TabsLayout />;
}
