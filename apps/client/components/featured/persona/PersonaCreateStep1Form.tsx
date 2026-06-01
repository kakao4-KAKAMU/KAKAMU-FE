import { Image, Pressable, View } from 'react-native';
import { User } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import { Controller, type Control } from 'react-hook-form';
import { Button, Icon, Input, Label, Text, TextClassProvider } from '@kakamu/ui';
import { convertImagePath } from '@/lib/upload/convert-image-path';

type PersonaCreateStep1FormProps = {
  control: Control<PersonaCreateFormInput>;
  onContinue: () => void;
  onPickProfileImage: () => void;
  onClearProfileImage?: (previewUri: string) => void;
  continuing?: boolean;
};

export function PersonaCreateStep1Form({
  control,
  onContinue,
  onPickProfileImage,
  onClearProfileImage,
  continuing = false,
}: PersonaCreateStep1FormProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 gap-8 justify-between">
      <View className="gap-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View className="gap-2">
              <Label nativeID="persona-name-label" className="text-sm text-muted-foreground">
                {t('account.persona.create.nameLabel')}
              </Label>
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('account.persona.create.namePlaceholder')}
                autoCapitalize="none"
                autoCorrect={false}
                aria-labelledby="persona-name-label"
              />
              {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="profile_image_url"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            const previewUri = value?.trim() ?? '';

            return (
              <View className="gap-2">
                <Label nativeID="persona-thumbnail-label" className="text-sm text-muted-foreground">
                  {t('account.persona.create.thumbnailLabel')}
                </Label>
                <View className="flex-row items-center gap-3">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('account.persona.create.pickFileLabel')}
                    onPress={onPickProfileImage}
                    className="h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border border-border bg-muted active:opacity-70"
                  >
                    {previewUri ? (
                      <Image
                        source={{ uri: convertImagePath(previewUri) }}
                        accessibilityIgnoresInvertColors
                        className="h-full w-full"
                      />
                    ) : (
                      <TextClassProvider value="text-muted-foreground">
                        <Icon as={User} size={22} />
                      </TextClassProvider>
                    )}
                  </Pressable>
                  <View className="min-w-0 flex-1 gap-2">
                    <Button
                      variant="outline"
                      onPress={onPickProfileImage}
                      className="h-10 self-start rounded-md px-4"
                    >
                      <Text>{t('account.persona.create.pickFileLabel')}</Text>
                    </Button>
                    {previewUri ? (
                      <Button
                        variant="link"
                        size="sm"
                        onPress={() => {
                          onClearProfileImage?.(previewUri);
                          onChange('');
                        }}
                        className="h-auto self-start px-0"
                      >
                        <Text className="text-destructive">
                          {t('account.post.write.imagesRemoveA11y')}
                        </Text>
                      </Button>
                    ) : (
                      <Text className="text-xs text-muted-foreground">
                        {t('account.persona.create.thumbnailPlaceholder')}
                      </Text>
                    )}
                  </View>
                </View>
                {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
              </View>
            );
          }}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View className="gap-2">
              <Label nativeID="persona-description-label" className="text-sm text-muted-foreground">
                {t('account.persona.create.descriptionLabel')}
              </Label>
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('account.persona.create.descriptionPlaceholder')}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                aria-labelledby="persona-description-label"
                className="min-h-20 rounded-md py-3"
              />
              {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
            </View>
          )}
        />
      </View>

      <Button onPress={onContinue} disabled={continuing} className="h-11 rounded-md">
        <Text>{t('account.persona.create.continue')}</Text>
      </Button>
    </View>
  );
}
