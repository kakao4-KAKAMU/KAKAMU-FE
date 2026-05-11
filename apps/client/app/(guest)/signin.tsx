import { useState, useCallback } from 'react';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import {
  AuthHeader,
  SignInForm,
  SocialAuthList,
  SignUpPrompt,
  type SignInFormValues,
} from '@/components/featured/auth';

const INITIAL_VALUES: SignInFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function SignInScreen() {
  const router = useRouter();
  const [values, setValues] = useState<SignInFormValues>(INITIAL_VALUES);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    setSubmitting(false);
  }, []);

  const handleForgotPassword = useCallback(() => {
    router.push('./findpassword');
  }, [router]);

  const handleKakaoLogin = useCallback(() => {
  }, []);

  const handleGoogleLogin = useCallback(() => {
  }, []);

  const handleNavigateSignUp = useCallback(() => {
    router.push('/signup');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: '로그인' }} />
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
              title="Kakamu에 로그인"
              description={'페르소나로 영화 취향과 무드를 이어서 확인하세요.'}
            />

            <SignInForm
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              onForgotPassword={handleForgotPassword}
              submitting={submitting}
            />

            <SocialAuthList
              onPressKakao={handleKakaoLogin}
              onPressGoogle={handleGoogleLogin}
              disabled={submitting}
            />

            <SignUpPrompt onPress={handleNavigateSignUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
