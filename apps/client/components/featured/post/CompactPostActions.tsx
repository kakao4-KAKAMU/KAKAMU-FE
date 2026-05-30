import { View } from "react-native";
import { PostItem } from "@kakamu/types";
import { TextClassContext, Icon, Text } from "@kakamu/ui";
import { MessageCircle, Heart, Bookmark, Ellipsis } from "lucide-react-native";


type CompactPostActionsProps = {
  post: PostItem;
};

export function CompactPostActions({ post }: CompactPostActionsProps) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="flex-row items-center gap-1">
        <TextClassContext.Provider value="text-muted-foreground">
          <Icon as={MessageCircle} size={16} />
        </TextClassContext.Provider>
        <Text className="text-xs text-muted-foreground">{post.comment_count}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <TextClassContext.Provider value="text-muted-foreground">
          <Icon as={Heart} size={16} />
        </TextClassContext.Provider>
        <Text className="text-xs text-muted-foreground">{post.like_count}</Text>
      </View>
      <TextClassContext.Provider value="text-muted-foreground">
        <Icon as={Bookmark} size={15} />
      </TextClassContext.Provider>
      <TextClassContext.Provider value="text-muted-foreground">
        <Icon as={Ellipsis} size={16} />
      </TextClassContext.Provider>
    </View>
  );
}