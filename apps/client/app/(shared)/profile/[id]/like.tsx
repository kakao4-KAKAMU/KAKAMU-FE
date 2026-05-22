import {
  ProfileLikesPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';
import { useLocalSearchParams } from 'expo-router';

export default function MemberProfileLikesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { likedPosts } = useProfileScreenData({ isMy: false, userId: id });

  return <ProfileLikesPanel posts={likedPosts} />;
}
