import { useCallback, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@kakamu/ui';
import { ResetPasswordForm, type ResetPasswordFormValues } from '@/components/featured/auth';

const INITIAL_VALUES: ResetPasswordFormValues = {
  password: '',
  passwordConfirm: '',
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [values, setValues] = useState<ResetPasswordFormValues>(INITIAL_VALUES);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    setSubmitting(false);
    router.replace('/signin');
  }, [router]);

  const handleBackToSignIn = useCallback(() => {
    router.replace('/signin');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: '비밀번호 초기화' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="min-h-full grow justify-center px-6 pt-6 pb-7 gap-3.5">
            <View className="gap-2">
              <Text className="text-3xl font-extrabold text-foreground leading-tight">
                비밀번호 초기화
              </Text>
              <Text className="text-sm font-normal text-muted-foreground leading-snug">
                새 비밀번호를 입력하고 한 번 더 확인해 주세요.
              </Text>
            </View>

            <ResetPasswordForm
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              submitting={submitting}
            />

            <View className="items-center">
              <Pressable
                accessibilityRole="link"
                onPress={handleBackToSignIn}
                hitSlop={8}
                className="active:opacity-70"
              >
                <Text className="text-sm font-normal text-muted-foreground text-center">
                  로그인으로 돌아가기
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
