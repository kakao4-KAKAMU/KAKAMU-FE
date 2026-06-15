import { ActivityIndicator, ScrollView, View } from 'react-native';
import type { UserSimpleInfo } from '@kakamu/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Text,
} from '@kakamu/ui';
import { ProfileRelationUserRow } from './ProfileRelationUserRow';

type ProfileRelationListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  emptyLabel: string;
  loadMoreLabel: string;
  loadingMoreLabel: string;
  users: UserSimpleInfo[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onUserPress: (userId: string) => void;
};

export function ProfileRelationListDialog({
  open,
  onOpenChange,
  title,
  emptyLabel,
  loadMoreLabel,
  loadingMoreLabel,
  users,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onUserPress,
}: ProfileRelationListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(480px,80vh)] gap-3 p-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator />
          </View>
        ) : users.length === 0 ? (
          <Text className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</Text>
        ) : (
          <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
            <View className="gap-0.5">
              {users.map((user) => (
                <ProfileRelationUserRow
                  key={user.id}
                  user={user}
                  onPress={() => onUserPress(user.id)}
                />
              ))}
              {hasNextPage ? (
                <Button
                  variant="ghost"
                  onPress={onLoadMore}
                  disabled={isFetchingNextPage}
                  className="mt-1"
                >
                  <Text>{isFetchingNextPage ? loadingMoreLabel : loadMoreLabel}</Text>
                </Button>
              ) : null}
            </View>
          </ScrollView>
        )}
      </DialogContent>
    </Dialog>
  );
}
