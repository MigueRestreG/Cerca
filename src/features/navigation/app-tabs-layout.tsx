import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/providers/app-provider';

function TabIcon({ name, color }: { name: any; color: any }) {
	return <SymbolView name={name} size={20} tintColor={color as string} />;
}

export default function TabsLayout() {
	const { t } = useApp();
	const theme = useTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.accent,
				tabBarInactiveTintColor: theme.textSecondary,
				tabBarBackground: () => (
					<LinearGradient
						colors={['rgba(11,15,18,0.98)', 'rgba(8,10,12,0.96)', 'rgba(6,8,9,0.98)']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{ flex: 1 }}
					/>
				),
				tabBarStyle: {
					backgroundColor: 'rgba(11,15,18,0.96)',
					borderTopColor: theme.border,
					borderTopWidth: 1,
					height: 72,
					paddingTop: 10,
					paddingBottom: 10,
					marginHorizontal: 14,
					marginBottom: 12,
					borderRadius: 24,
					overflow: 'hidden',
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					shadowColor: '#000',
					shadowOpacity: 0.28,
					shadowRadius: 20,
					shadowOffset: { width: 0, height: 12 },
					elevation: 14,
				},
				tabBarItemStyle: {
					paddingTop: 6,
					paddingBottom: 4,
				},
				tabBarLabelStyle: {
					fontWeight: '700',
					fontSize: 10,
					letterSpacing: 0.6,
					textTransform: 'uppercase',
				},
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: t('tabs.home'),
					tabBarIcon: ({ color }) => (
						<TabIcon name={{ ios: 'house.fill', android: 'home', web: 'home' }} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: t('tabs.search'),
					tabBarIcon: ({ color }) => (
						<TabIcon name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="publish"
				options={{
					title: t('tabs.publish'),
					tabBarIcon: ({ color }) => (
						<TabIcon name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="bookings"
				options={{
					title: t('tabs.bookings'),
					tabBarIcon: ({ color }) => (
						<TabIcon name={{ ios: 'calendar', android: 'event', web: 'calendar' }} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: t('tabs.account'),
					tabBarIcon: ({ color }) => (
						<TabIcon name={{ ios: 'person.crop.circle', android: 'person', web: 'person' }} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="booking/[id]"
				options={{
					href: null,
				}}
			/>
			<Tabs.Screen
				name="listing/[id]"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
