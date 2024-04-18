import Header from "../components/Header";
import { Screen } from "../components/Screen";
import { useTranslation } from "react-i18next";
import { Icon } from "../components/Icon";
import { useNavigation } from "expo-router";
import { YStack } from "tamagui";
import { Typography } from "../components/Typography";
import { useForm, Controller } from "react-hook-form";
import FormInput from "../components/FormInputs/FormInput";
import Card from "../components/Card";
import Button from "../components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const navigation = useNavigation();

  const { handleSubmit, control, formState } = useForm<FormData>({});

  const { t } = useTranslation("login");
  const { errors } = formState;

  const insets = useSafeAreaInsets();

  const onSubmit = (data: FormData) => {
    console.log("Forgot password for email: ", data.email);
  };

  return (
    <Screen
      preset="auto"
      ScrollViewProps={{
        bounces: false,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <Header
        title={"More"}
        titleColor="white"
        barStyle="light-content"
        leftIcon={<Icon icon="chevronLeft" color="white" />}
        onLeftPress={() => navigation.goBack()}
      />

      <YStack paddingHorizontal="$md" gap="$md" paddingTop={10 + insets.top}>
        <Typography preset="heading" fontWeight="700">
          Forgot your password?{" "}
        </Typography>

        <Typography>
          Please enter the email address associated with your account and we'll send you a link to
          reset your password.
        </Typography>

        <Controller
          key="email"
          name="email"
          control={control}
          rules={{
            required: {
              value: true,
              message: t("form.email.required"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <YStack>
              <FormInput
                type="text"
                title={t("form.email.label")}
                placeholder={t("form.email.placeholder")}
                value={value}
                onChangeText={onChange}
              ></FormInput>

              <Typography color="$red5" marginTop="$xs">
                {errors?.email?.message?.toString() ?? ""}
              </Typography>
            </YStack>
          )}
        />
      </YStack>

      <Card width="100%" paddingBottom={16 + insets.bottom} marginTop="auto">
        <Button onPress={handleSubmit(onSubmit)}>Log in</Button>
      </Card>
    </Screen>
  );
};

export default ForgotPassword;
