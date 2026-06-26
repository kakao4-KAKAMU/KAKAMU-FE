import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Badge, Icon, Text, TextClassProvider } from '@kakamu/ui';

import { AccountSnsProviderRow } from './AccountSnsProviderRow';
import { ProfileSettingRow } from './ProfileSettingRow';

import { ConditionalRender } from '@/components/utils/ConditionalRender';
import { useAccountSetupScreen } from '@/hooks/account/useAccountSetupScreen';
import { getSocialProviderIcon } from '@/lib/account/social-provider-ui';

export function AccountSetupScreenContent() {
  const router = useRouter();
  const {
    authStatus,
    isBusy,
    onSocialProviderPress,
    getSocialDescription,
    labels,
  } = useAccountSetupScreen();

  const onPasswordPress = useCallback(() => {
    router.push('/profile/setting/password');
  }, [router]);

  const emailLabel =
    authStatus.local_auth.is_linked && authStatus.local_auth.email
      ? authStatus.local_auth.email
      : labels.emailEmpty;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      <View className="flex-col gap-4 px-5 pb-6">
        <View className="flex-col gap-2">
          <Text className="text-[13px] font-semibold text-muted-foreground">
            {labels.loginAccountSection}
          </Text>

          <View className="flex-col gap-2.5">
            <ProfileSettingRow
              label={labels.email}
              trailing={<Text className="text-sm text-muted-foreground">{emailLabel}</Text>}
            />

            <ConditionalRender.Boolean
              condition={authStatus.local_auth.is_linked}
              render={{
                true: (
                  <ProfileSettingRow
                    label={labels.password}
                    onPress={onPasswordPress}
                    trailing={
                      <TextClassProvider value="text-muted-foreground">
                        <Icon as={ChevronRight} size={18} />
                      </TextClassProvider>
                    }
                  />
                ),
                false: null,
              }}
            />
          </View>
        </View>

        <View className="flex-col gap-2">
          <Text className="text-[13px] font-semibold text-muted-foreground">
            {labels.snsSection}
          </Text>

          <View className="flex-col gap-2.5">
            {authStatus.social_auths.map((social) => (
              <AccountSnsProviderRow
                key={social.provider}
                name={labels.getProviderLabel(social.provider)}
                description={getSocialDescription(social)}
                icon={getSocialProviderIcon(social.provider)}
                trailing={
                  social.is_linked ? (
                    <Badge variant="secondary">
                      <Text>{labels.linked}</Text>
                    </Badge>
                  ) : (
                    <Text className="text-[13px] font-semibold text-foreground">
                      {labels.connect}
                    </Text>
                  )
                }
                onPress={isBusy ? undefined : () => onSocialProviderPress(social)}
                accessibilityLabel={
                  social.is_linked
                    ? labels.unlinkA11y(social.provider)
                    : labels.connectA11y(social.provider)
                }
              />
            ))}
          </View>
        </View>

        <Text className="text-xs leading-relaxed text-muted-foreground">{labels.footer}</Text>
      </View>
    </ScrollView>
  );
}
