import { Slot } from 'expo-router';
import { ProfileScreenLayout } from '@/components/featured/profileScreen';

export default function MyProfileLayout() {
  
  return (
    <ProfileScreenLayout isMy>
      <Slot />
    </ProfileScreenLayout>
  );
}
