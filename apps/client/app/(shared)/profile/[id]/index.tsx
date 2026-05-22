import {
  ProfileFeedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';
import { useLocalSearchParams } from 'expo-router';

export default function MemberProfileFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { feedPosts } = useProfileScreenData({ isMy: false, userId: id });

  return <ProfileFeedPanel posts={feedPosts} />;
}
