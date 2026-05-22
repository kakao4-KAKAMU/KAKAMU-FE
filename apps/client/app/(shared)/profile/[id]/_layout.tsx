import { Slot, useLocalSearchParams } from 'expo-router';
import { ProfileScreenLayout } from '@/components/featured/profileScreen';

export default function MemberProfileLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ProfileScreenLayout isMy={false} userId={id}>
      <Slot />
    </ProfileScreenLayout>
  );
}
