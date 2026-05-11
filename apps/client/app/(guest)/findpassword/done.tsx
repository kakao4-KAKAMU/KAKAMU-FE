import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { Mail } from 'lucide-react-native';
import { Button, Icon, Text, TextClassContext } from '@kakamu/ui';

export default function FindPasswordDoneScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleGoSignIn = useCallback(() => {
    router.replace('/signin');
  }, [router]);

  const handleResend = useCallback(() => {
    router.replace('./');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: t('guest.layout.findPassword') }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-background"
      >
        <View className="min-h-full grow justify-center px-6 py-8 gap-4.5">
          <View className="items-center justify-center gap-4.5">
            <View className="h-18 w-18 items-center justify-center rounded-full bg-primary">
              <TextClassContext.Provider value="text-primary-foreground">
                <Icon as={Mail} size={32} />
              </TextClassContext.Provider>
            </View>

            <View className="gap-2 items-center">
              <Text className="text-2xl font-extrabold text-foreground text-center leading-tight">
                {t('guest.findPasswordDone.title')}
              </Text>
              <Text className="text-sm font-normal text-muted-foreground text-center leading-snug px-1">
                {t('guest.findPasswordDone.description')}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <Button
              variant="default"
              size="lg"
              onPress={handleGoSignIn}
              accessibilityRole="button"
              className="h-12 rounded-md"
            >
              <Text className="text-sm font-medium">{t('guest.findPasswordDone.goSignIn')}</Text>
            </Button>

            <Pressable
              accessibilityRole="link"
              onPress={handleResend}
              hitSlop={8}
              className="items-center py-1 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-foreground text-center">
                {t('guest.findPasswordDone.resend')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
