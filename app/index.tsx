import { Redirect } from 'expo-router';
import { useSessionStore } from '@/hooks/useSessionStore';

export default function Index() {
  const { getUser, getProfile } = useSessionStore();

  const user = getUser();
  const profile = getProfile();


  if (!user) return <Redirect href="/(auth)/login" />;
  if (user && !profile) return <Redirect href="/(onboarding)/create-profile" />;

  // 👇 THIS IS YOUR NEW STEP
  // if (user && profile && !hasTeam) {
  //   return <Redirect href="/(onboarding)/welcome" />;
  // }

  // return <Redirect href="/(app)/dashboard" />; 
  return <Redirect href="/(app)/teams" />; //Until dashboard is finish
}
