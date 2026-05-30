import { Image, View } from 'react-native';
import { User } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import { Controller, type Control } from 'react-hook-form';
import { Button, Icon, Input, Label, Text, TextClassContext } from '@kakamu/ui';

type PersonaCreateStep1FormProps = {
  control: Control<PersonaCreateFormInput>;
  onContinue: () => void;
  continuing?: boolean;
};

export function PersonaCreateStep1Form({
  control,
  onContinue,
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
                className="h-11 rounded-md"
              />
              {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="profile_image_url"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View className="gap-2">
              <Label nativeID="persona-thumbnail-label" className="text-sm text-muted-foreground">
                {t('account.persona.create.thumbnailLabel')}
              </Label>
              <View className="flex-row items-center gap-3">
                <View className="h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {value?.trim() ? (
                    <Image
                      source={{ uri: value.trim() }}
                      accessibilityIgnoresInvertColors
                      className="h-full w-full"
                    />
                  ) : (
                    <TextClassContext.Provider value="text-muted-foreground">
                      <Icon as={User} size={22} />
                    </TextClassContext.Provider>
                  )}
                </View>
                <View className="min-w-0 flex-1 gap-1.5">
                  <Text className="text-sm font-semibold text-foreground">
                    {t('account.persona.create.pickFileLabel')}
                  </Text>
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t('account.persona.create.thumbnailPlaceholder')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    aria-labelledby="persona-thumbnail-label"
                    className="h-11 rounded-md"
                  />
                </View>
              </View>
              {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
            </View>
          )}
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
