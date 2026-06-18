import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { AuthSnsSignUpProvider } from '@kakamu/types';
import type { TFunction } from 'i18next';
import { Globe, MessageCircle } from 'lucide-react-native';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';

export function getSocialProviderLabel(provider: string, t: TFunction): string {
  switch (provider) {
    case 'kakao':
      return t('account.setup.provider.kakao');
    case 'google':
      return t('account.setup.provider.google');
    default:
      return provider;
  }
}

export function getSocialProviderIcon(provider: string): ReactNode {
  switch (provider) {
    case 'kakao':
      return (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FEE500]">
          <Icon as={MessageCircle} size={18} className="text-[#3C1E1E]" />
        </View>
      );
    case 'google':
      return (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <TextClassProvider value="text-muted-foreground">
            <Icon as={Globe} size={18} />
          </TextClassProvider>
        </View>
      );
    default:
      return (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <TextClassProvider value="text-muted-foreground">
            <Icon as={Globe} size={18} />
          </TextClassProvider>
        </View>
      );
  }
}

export function isSupportedSocialProvider(provider: string): provider is AuthSnsSignUpProvider {
  return provider === 'kakao' || provider === 'google';
}
