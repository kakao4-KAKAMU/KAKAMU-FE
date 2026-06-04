import { Icon, TextClassProvider } from "@kakamu/ui";
import { HeaderTemplate } from "./HeaderTemplate";
import { Sparkles } from 'lucide-react-native';

type ChatListHeaderProps = {
  title: string;
}

export function ChatListHeader({
  title,
}: ChatListHeaderProps) {

  return (
    <HeaderTemplate
      title={title}
      rightAction={
        <TextClassProvider value="text-foreground">
          <Icon as={Sparkles} size={18} />
        </TextClassProvider>
      }
    />
  );
}