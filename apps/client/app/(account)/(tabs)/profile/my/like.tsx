import {
  ProfileLikesPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';

export default function MyProfileLikesScreen() {
  const { likedPosts } = useProfileScreenData({ isMy: true });

  return <ProfileLikesPanel posts={likedPosts} />;
}
