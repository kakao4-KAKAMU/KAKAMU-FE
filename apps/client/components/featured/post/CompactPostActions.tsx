import { View } from "react-native";
import { PostItem } from "@kakamu/types";
import { Icon, Text, Button, TextClassProvider, DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@kakamu/ui";
import { MessageCircle, Heart, Bookmark, Ellipsis } from "lucide-react-native";
import { ConditionalRender } from "@/components/utils/ConditionalRender";
import { useCurrentUser } from "@/hooks/auth/useCurrentUserId";


type CompactPostActionsProps = {
  post: PostItem;
  isOwner?: boolean;
  onToggleLike?: () => void;
  onComment?: () => void;
  onToggleBookmark?: () => void;
  onDelete?: () => void;
  onModify?: () => void
  onReport?: () => void
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
  const currentUser = useCurrentUser();
  return (
    <View className="flex-row items-center gap-4">
      <TextClassProvider value="text-muted-foreground">
        <ConditionalRender.Boolean
          condition={currentUser}
          render={{
            true: <Button size="text" variant={'ghost'} onPress={onComment}>
              <View className="flex-row items-center gap-1">
                <Icon as={MessageCircle} size={16} />
                <Text className="text-xs">{post.comment_count}</Text>
              </View>
            </Button>,
            false: <View className="flex-row items-center gap-1">
              <Icon as={MessageCircle} size={16} />
              <Text className="text-xs">{post.comment_count}</Text>
            </View>
          }}
        />

        <ConditionalRender.Boolean
          condition={currentUser}
          render={{
            true: <Button size="text" variant={'ghost'} onPress={onToggleLike}>
              <View className="flex-row items-center gap-1">
                <Icon as={Heart} size={16} fill={post.is_liked ? 'currentColor' : 'none'} />
                <Text className="text-xs">{post.like_count}</Text>
              </View>
            </Button>,
            false: <View className="flex-row items-center gap-1">
              <Icon as={Heart} size={16} fill={post.is_liked ? 'currentColor' : 'none'} />
              <Text className="text-xs">{post.like_count}</Text>
            </View>
          }}
        />

        <ConditionalRender.Boolean
          condition={currentUser}
          render={{
            true: <Button size="text" variant={'ghost'} onPress={onToggleBookmark}>
              <Icon as={Bookmark} size={15} fill={post.is_saved ? 'currentColor' : 'none'} />
            </Button>,
          }}
        />
        <ConditionalRender.Boolean
          condition={currentUser}
          render={{
            true: <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="text" variant={'ghost'}>
                  <Icon as={Ellipsis} size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ConditionalRender.Boolean
                  condition={isOwner}
                  render={{
                    true: (
                      <>
                        <DropdownMenuItem onPress={onModify}>
                          <Text>Modify</Text>
                        </DropdownMenuItem>
                        <DropdownMenuItem onPress={onDelete}>
                          <Text>Delete</Text>
                        </DropdownMenuItem>
                      </>
                    ),
                    false: (
                      <>
                        <DropdownMenuItem onPress={onReport}>
                          <Text>Report</Text>
                        </DropdownMenuItem>
                      </>
                    )
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          }}
        />
      </TextClassProvider>
    </View>
  );
}