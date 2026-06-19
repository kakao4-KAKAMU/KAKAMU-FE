import { View } from "react-native";
import { Pressable } from 'react-native-gesture-handler'
import { Input } from "../composed/input";
import { TextClassProvider } from "../composed/text";
import { Icon } from "../composed/icon";
import { useCallback, useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

type PasswordInputProps = {
  passwordAccessibilityLabelHidden: string;
  passwordAccessibilityLabelShown: string;
}
export function PasswordInput({
  passwordAccessibilityLabelHidden,
  passwordAccessibilityLabelShown,
  ...inputProps
}: React.ComponentProps<typeof Input> & PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View className="relative">
      <Input
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        {...inputProps}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          showPassword ? passwordAccessibilityLabelHidden : passwordAccessibilityLabelShown
        }
        onPress={togglePasswordVisibility}
        hitSlop={8}
        className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
      >
        <TextClassProvider value="text-muted-foreground">
          <Icon as={showPassword ? EyeOff : Eye} size={18} />
        </TextClassProvider>
      </Pressable>
    </View>
  )
}