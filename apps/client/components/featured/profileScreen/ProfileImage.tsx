import { memo } from "react";
import { Avatar, TextClassProvider, AvatarImage, AvatarFallback, Icon, cn } from "@kakamu/ui";
import { View } from "react-native";
import { User } from "lucide-react-native";

type ProfileImageProps = {
  nickname: string;
  url: string | null;
  size?: number;
};

function ProfileImageComponent({ nickname, url, size = 16 }: ProfileImageProps) {
  return (
    <View className={cn(`size-${size} items-center justify-center rounded-full border border-border bg-muted`)}>
      <Avatar
        className={cn(`size-${size} border border-border bg-muted`)}
        alt={nickname}
      >
        {url ? (
          <AvatarImage source={{ uri: url }} />
        ) : null}
        <AvatarFallback className="bg-muted">
          <TextClassProvider value="text-muted-foreground">
            <Icon as={User} size={size*2} />
          </TextClassProvider>
        </AvatarFallback>
      </Avatar>
    </View>
  );
}

export const ProfileImage = memo(ProfileImageComponent);