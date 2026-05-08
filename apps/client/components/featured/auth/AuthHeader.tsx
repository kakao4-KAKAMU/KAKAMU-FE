import { View } from 'react-native';
import { Text } from '@kakamu/ui';
import { AuthBrandLogo } from './AuthBrandLogo';

type AuthHeaderProps = {
  title: string;
  description?: string;
};

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <View className="items-center gap-4">
      <AuthBrandLogo size="lg" />
      <View className="items-center gap-2">
        <Text className="text-2xl font-extrabold text-foreground text-center leading-tight">
          {title}
        </Text>
        {description ? (
          <Text className="text-sm font-normal text-muted-foreground text-center leading-5">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
