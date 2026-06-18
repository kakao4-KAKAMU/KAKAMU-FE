import { Slot, useLocalSearchParams } from 'expo-router';
import { ProfileScreenLayout } from '@/components/featured/profileScreen';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';

export default function MemberProfileLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  return (
    <ProfileScreenLayout isMy={currentUserId === id} userId={id}>
      <Slot />
    </ProfileScreenLayout>
  );
}
