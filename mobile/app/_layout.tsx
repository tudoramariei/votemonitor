import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import AuthContextProvider from "../contexts/auth/AuthContext.provider";
import NetInfo from "@react-native-community/netinfo";
import OfflineBanner from "../components/OfflineBanner";
import { TamaguiProvider } from "@tamagui/core";
import { tamaguiConfig } from "../tamagui.config";
import { useFonts } from "expo-font";
import "../common/config/i18n";
import LanguageContextProvider from "../contexts/language/LanguageContext.provider";
import PersistQueryContextProvider from "../contexts/persist-query/PersistQueryContext.provider";
import { onlineManager } from "@tanstack/react-query";
import { Button } from "tamagui";

export default function Root() {
  const [isOnline, setIsOnline] = useState(true);

  const [loaded] = useFonts({
    Roboto: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    DMSans: require("../assets/fonts/DMSans-Medium.ttf"),
    DMSansRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    DMSansBold: require("../assets/fonts/DMSans-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded]);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status = !!state.isConnected;
      setIsOnline(status);
      onlineManager.setOnline(status);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <AuthContextProvider>
        <PersistQueryContextProvider>
          <LanguageContextProvider>
            {!isOnline && <OfflineBanner />}
            <Slot />
            <Button
              onPress={() => {
                setIsOnline(!isOnline);
                onlineManager.setOnline(!isOnline);
              }}
            >
              Go Offline online
            </Button>
          </LanguageContextProvider>
        </PersistQueryContextProvider>
      </AuthContextProvider>
    </TamaguiProvider>
  );
}
