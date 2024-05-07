import React from "react";
import { router, useNavigation } from "expo-router";
import { YStack } from "tamagui";
import { Screen } from "./Screen";
import { Icon } from "./Icon";
import { Typography } from "./Typography";
import Button from "./Button";
import Header from "./Header";
import { DrawerActions } from "@react-navigation/native";

const NoVisitsExist = () => {
  const navigation = useNavigation();

  return (
    <Screen preset="fixed">
      <Header
        title={"Observation"}
        titleColor="white"
        barStyle="light-content"
        leftIcon={<Icon icon="menuAlt2" color="white" />}
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer)}
      />
      <YStack
        width="100%"
        display="flex"
        backgroundColor="white"
        alignItems="center"
        justifyContent="center"
        gap="$md"
        paddingHorizontal="$md"
      >
        <Icon icon="missingPollingStation" />
        <YStack gap="$xxxs">
          <Typography preset="subheading" textAlign="center">
            No visited polling stations yet
          </Typography>
          <Typography preset="body1" textAlign="center" color="$gray5">
            Start configuring your first polling station before completing observation forms.
          </Typography>
        </YStack>
        <Button
          preset="outlined"
          backgroundColor="white"
          width="100%"
          onPress={router.push.bind(null, "/polling-station-wizzard")}
        >
          Add your first polling station
        </Button>
      </YStack>
    </Screen>
  );
};

export default NoVisitsExist;
