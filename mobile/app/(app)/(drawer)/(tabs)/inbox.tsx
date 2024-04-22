import { YStack } from "tamagui";
import { Screen } from "../../../../components/Screen";
import Header from "../../../../components/Header";
import { Typography } from "../../../../components/Typography";
import { Icon } from "../../../../components/Icon";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const Inbox = () => {
  const navigation = useNavigation();
  const { t } = useTranslation("inbox_empty");

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
        title={"Inbox"}
        titleColor="white"
        barStyle="light-content"
        leftIcon={<Icon icon="menuAlt2" color="white" />}
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer)}
        rightIcon={<Icon icon="dotsVertical" color="white" />}
        onRightPress={() => {
          console.log("Right icon pressed");
        }}
      />

      <YStack flex={1} alignItems="center" justifyContent="center" gap="$md">
        <Icon icon="undrawInbox" size={190} />

        <YStack gap="$xxxs" paddingHorizontal="$lg">
          <Typography preset="subheading" textAlign="center">
            {t("title")}
          </Typography>
          <Typography preset="body1" textAlign="center" color="$gray12">
            {t("paragraph")}
          </Typography>
        </YStack>
      </YStack>
    </Screen>
  );
};

export default Inbox;
