import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { ProfileSubpageHeader } from '@/components/featured/header/ProfileSubpageHeader';
import { FeedEditForm } from '@/components/featured/post/write/FeedEditForm';
import { PostWriteFormSkeleton } from '@/components/featured/post/write/PostWriteForm.skeleton';

export default function FeedEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number.parseInt(id ?? '', 10);
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={t('account.layout.feedEdit')} />
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 pb-8 pt-2"
          >
            {postId > 0 ? (
              <AppSuspenseBoundary fallback={<PostWriteFormSkeleton />}>
                <FeedEditForm postId={postId} />
              </AppSuspenseBoundary>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
