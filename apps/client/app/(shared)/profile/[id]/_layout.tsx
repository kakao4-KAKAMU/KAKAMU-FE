import { Slot, useLocalSearchParams } from 'expo-router';
import { ProfileScreenLayout } from '@/components/featured/profileScreen';
import { useCurrentUser } from '@/hooks/auth/useCurrentUserId';

export default function MemberProfileLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useCurrentUser();
  return (
    <ProfileScreenLayout isMy={currentUser?.id === id} userId={id}>
      <Slot />
    </ProfileScreenLayout>
  );
}
