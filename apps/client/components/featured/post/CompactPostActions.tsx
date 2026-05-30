import { View } from "react-native";
import { PostItem } from "@kakamu/types";
import { Icon, Text, Button, TextClassProvider, DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@kakamu/ui";
import { MessageCircle, Heart, Bookmark, Ellipsis } from "lucide-react-native";
import { useCallback } from "react";
import { ConditionalRender } from "@/components/utils/ConditionalRender";


type CompactPostActionsProps = {
  post: PostItem;
  isOwner?: boolean;
  onToggleLike?: (id: number) => void;
  onComment?: (id: number) => void;
  onToggleBookmark?: (id: number) => void;
  onDelete?: (id: number) => void;
  onModify?: (id: number) => void
  onReport?: (id: number) => void
};

export function CompactPostActions({
  post,
  isOwner,
  onToggleLike,
  onComment,
  onToggleBookmark,
  onDelete,
  onModify,
  onReport
}: CompactPostActionsProps) {
  const handleToggleLike = useCallback(() => {
    onToggleLike?.(post.id);
  }, [post.id, onToggleLike]);
  const handleComment = useCallback(() => {
    onComment?.(post.id);
  }, [post.id, onComment]);
  const handleToggleBookmark = useCallback(() => {
    onToggleBookmark?.(post.id);
  }, [post.id, onToggleBookmark]);
  const handleDelete = useCallback(() => {
    onDelete?.(post.id);
  }, [post.id, onDelete]);
  const handleModify = useCallback(() => {
    onModify?.(post.id);
  }, [post.id, onModify]);
  const handleReport = useCallback(() => {
    onReport?.(post.id);
  }, [post.id, onReport]);
  return (
    <View className="flex-row items-center gap-4">
      <TextClassProvider value="text-muted-foreground">
        <Button size="text" variant={'ghost'} onPress={handleComment}>
          <View className="flex-row items-center gap-1">
            <Icon as={MessageCircle} size={16} />
            <Text className="text-xs">{post.comment_count}</Text>
          </View>
        </Button>
        <Button size="text" variant={'ghost'} onPress={handleToggleLike}>
          <View className="flex-row items-center gap-1">
            <Icon as={Heart} size={16} />
            <Text className="text-xs">{post.like_count}</Text>
          </View>
        </Button>
        <Button size="text" variant={'ghost'} onPress={handleToggleBookmark}>
          <Icon as={Bookmark} size={15} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="text" variant={'ghost'}>
              <Icon as={Ellipsis} size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <ConditionalRender.Boolean
              condition={Boolean(isOwner)}
              render={{
                true: (
                  <>
                    <DropdownMenuItem onPress={handleModify}>
                      <Text>Modify</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem onPress={handleDelete}>
                      <Text>Delete</Text>
                    </DropdownMenuItem>
                  </>
                ),
                false: (
                  <>
                    <DropdownMenuItem onPress={handleReport}>
                      <Text>Report</Text>
                    </DropdownMenuItem>
                  </>
                )
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </TextClassProvider>
    </View>
  );
}