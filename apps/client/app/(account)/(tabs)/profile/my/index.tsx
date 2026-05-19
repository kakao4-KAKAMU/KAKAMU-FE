import {
  ProfileFeedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';

export default function MyProfileFeedScreen() {
  const { feedPosts } = useProfileScreenData({ isMy: true });

  return <ProfileFeedPanel posts={feedPosts} />;
}
