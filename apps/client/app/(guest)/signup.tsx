import { useCallback, useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { Stack, useRouter } from 'expo-router';
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
  const { t } = useTranslation();
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
      <Stack.Screen options={{ title: t('guest.layout.signUp') }} />
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
              title={t('guest.signUp.headerTitle')}
              description={t('guest.signUp.headerDescription')}
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

            <SignUpPrompt variant="toSignIn" onPress={handleNavigateSignIn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}