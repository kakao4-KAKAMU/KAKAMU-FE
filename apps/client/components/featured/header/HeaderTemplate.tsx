import { View } from "react-native";
import { Text } from "@kakamu/ui";
import { ConditionalRender } from "@/components/utils";

type HeaderTemplateProps = {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
};

export function HeaderTemplate({
  title,
  leftAction,
  rightAction,
}: HeaderTemplateProps) {
  return (
    <View className="flex-row items-center justify-between pb-1 pt-1 px-4">
      <View>
        <ConditionalRender.Boolean
          condition={Boolean(leftAction)}
          render={{
            true: leftAction,
            false: <View className="size-10" />,
          }}
        />
      </View>
      <Text variant={'h4'} className="font-bold">
        {title}
      </Text>
      <View>
        <ConditionalRender.Boolean
          condition={Boolean(rightAction)}
          render={{
            true: rightAction,
            false: <View className="size-10" />,
          }}
        />
      </View>
    </View>
  );
}