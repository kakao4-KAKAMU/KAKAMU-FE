import { Button, Text } from '@kakamu/ui';

type ProfileFollowButtonProps = {
  isFollowing: boolean;
  isPending: boolean;
  followLabel: string;
  unfollowLabel: string;
  onPress: () => void;
};

export function ProfileFollowButton({
  isFollowing,
  isPending,
  followLabel,
  unfollowLabel,
  onPress,
}: ProfileFollowButtonProps) {
  return (
    <Button
      variant={isFollowing ? 'secondary' : 'default'}
      disabled={isPending}
      onPress={onPress}
      className="w-full"
    >
      <Text>{isFollowing ? unfollowLabel : followLabel}</Text>
    </Button>
  );
}
