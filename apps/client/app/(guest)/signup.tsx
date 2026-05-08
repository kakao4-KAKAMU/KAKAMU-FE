import { useCallback, useState } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import {
  AuthHeader,
  SignUpForm,
  SignUpPrompt,
  SocialAuthList,
  type SignUpFormValues,
} from '@/components/featured/auth';

const INITIAL_VALUES: SignUpFormValues = {
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agreedToTerms: false,
};

export default function SignUpScreen() {
  const router = useRouter();
  const [values, setValues] = useState<SignUpFormValues>(INITIAL_VALUES);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    setSubmitting(false);
  }, []);

  const handleShowTerms = useCallback(() => {
  }, []);

  const handleKakaoSignUp = useCallback(() => {
  }, []);

  const handleGoogleSignUp = useCallback(() => {
  }, []);

  const handleNavigateSignIn = useCallback(() => {
    router.push('/signin');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: '회원가입' }} />
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
          <View className="min-h-full grow justify-center px-6 py-8 gap-8">
            <AuthHeader
              title="Kakamu에 가입하기"
              description="취향 기반 추천과 무드 큐레이션을 시작해 보세요."
            />

            <SignUpForm
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              onPressTerms={handleShowTerms}
              submitting={submitting}
            />

            <SocialAuthList
              onPressKakao={handleKakaoSignUp}
              onPressGoogle={handleGoogleSignUp}
              disabled={submitting}
            />

            <SignUpPrompt
              question="이미 계정이 있으신가요?"
              actionLabel="로그인"
              onPress={handleNavigateSignIn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}