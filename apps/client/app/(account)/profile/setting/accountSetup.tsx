import { useCallback } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Badge, Icon, Text, TextClassProvider } from '@kakamu/ui';

import { ProfileSubpageHeader } from '@/components/featured/header';
import {
  AccountSnsProviderRow,
  ProfileSettingRow,
} from '@/components/featured/profile';
import { ConditionalRender } from '@/components/utils/ConditionalRender';
import { useAccountSetupScreen } from '@/hooks/account/useAccountSetupScreen';
import { getSocialProviderIcon } from '@/lib/account/social-provider-ui';

export default function AccountSetupScreen() {
  const router = useRouter();
  const {
    authStatus,
    isLoading,
    loadErrorView,
    isBusy,
    onSocialProviderPress,
    getSocialDescription,
    labels,
  } = useAccountSetupScreen();

  const onPasswordPress = useCallback(() => {
    router.push('/profile/setting/password');
  }, [router]);

  const emailLabel =
    authStatus?.local_auth.is_linked && authStatus.local_auth.email
      ? authStatus.local_auth.email
      : labels.emailEmpty;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={labels.pageTitle} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-col gap-4 px-5 pb-6">
            <ConditionalRender.Boolean
              condition={isLoading}
              render={{
                true: (
                  <View className="items-center py-12">
                    <ActivityIndicator />
                    <Text className="mt-3 text-sm text-muted-foreground">{labels.loading}</Text>
                  </View>
                ),
                false: null,
              }}
            />

            <ConditionalRender.Boolean
              condition={loadErrorView}
              render={{
                true: (
                  <Text className="py-8 text-center text-sm text-destructive">
                    {loadErrorView?.description}
                  </Text>
                ),
                false: null,
              }}
            />

            <ConditionalRender.Boolean
              condition={!isLoading && authStatus}
              render={{
                true: (
                  <>
                    <View className="flex-col gap-2">
                      <Text className="text-[13px] font-semibold text-muted-foreground">
                        {labels.loginAccountSection}
                      </Text>

                      <View className="flex-col gap-2.5">
                        <ProfileSettingRow
                          label={labels.email}
                          trailing={
                            <Text className="text-sm text-muted-foreground">{emailLabel}</Text>
                          }
                        />

                        <ConditionalRender.Boolean
                          condition={authStatus!.local_auth.is_linked}
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
                        {authStatus!.social_auths.map((social) => (
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
                            onPress={
                              isBusy ? undefined : () => onSocialProviderPress(social)
                            }
                            accessibilityLabel={
                              social.is_linked
                                ? labels.unlinkA11y(social.provider)
                                : labels.connectA11y(social.provider)
                            }
                          />
                        ))}
                      </View>
                    </View>

                    <Text className="text-xs leading-relaxed text-muted-foreground">
                      {labels.footer}
                    </Text>
                  </>
                ),
                false: null,
              }}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
