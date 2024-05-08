import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { Screen } from "../../../../../components/Screen";
import { useUserData } from "../../../../../contexts/user/UserContext.provider";
import { Typography } from "../../../../../components/Typography";
import { View, YStack } from "tamagui";
import {
  usePollingStationInformation,
  usePollingStationInformationForm,
} from "../../../../../services/queries.service";
import SelectPollingStation from "../../../../../components/SelectPollingStation";
import Header from "../../../../../components/Header";
import { Icon } from "../../../../../components/Icon";
import { DrawerActions } from "@react-navigation/native";
import NoVisitsExist from "../../../../../components/NoVisitsExist";
import { PollingStationGeneral } from "../../../../../components/PollingStationGeneral";
import FormList from "../../../../../components/FormList";
import OptionsSheet from "../../../../../components/OptionsSheet";
import { router } from "expo-router";

const Index = () => {
  const navigation = useNavigation();
  const [openContextualMenu, setOpenContextualMenu] = useState(false);

  const { isLoading, visits, selectedPollingStation, activeElectionRound } = useUserData();

  const { data: psiData } = usePollingStationInformation(
    activeElectionRound?.id,
    selectedPollingStation?.pollingStationId,
  );

  const { data: psiFormQuestions } = usePollingStationInformationForm(activeElectionRound?.id);

  if (!isLoading && visits && !visits.length) {
    return <NoVisitsExist />;
  }

  return (
    <Screen
      preset="scroll"
      ScrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
        bounces: false,
      }}
    >
      <YStack marginBottom={20}>
        <Header
          title={"Observation"}
          titleColor="white"
          barStyle="light-content"
          leftIcon={<Icon icon="menuAlt2" color="white" />}
          onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          rightIcon={<Icon icon="dotsVertical" color="white" />}
          onRightPress={() => setOpenContextualMenu(true)}
        />
        <SelectPollingStation />
      </YStack>

      <YStack paddingHorizontal="$md">
        <FormList
          ListHeaderComponent={
            <YStack>
              {activeElectionRound &&
                selectedPollingStation?.pollingStationId &&
                psiFormQuestions && (
                  <PollingStationGeneral
                    electionRoundId={activeElectionRound.id}
                    pollingStationId={selectedPollingStation.pollingStationId}
                    psiData={psiData}
                    psiFormQuestions={psiFormQuestions}
                  />
                )}
              <Typography preset="body1" fontWeight="700" marginTop="$lg" marginBottom="$xxs">
                Forms
              </Typography>
            </YStack>
          }
        />
      </YStack>
      <OptionsSheet open={openContextualMenu} setOpen={setOpenContextualMenu}>
        <OptionSheetContent
          onPress={() => {
            setOpenContextualMenu(false);
            router.push("/manage-polling-station");
          }}
        />
      </OptionsSheet>
    </Screen>
  );
};

const OptionSheetContent = ({ onPress }: { onPress: () => void }) => {
  return (
    <View paddingVertical="$xxs" paddingHorizontal="$sm">
      <Typography preset="body1" color="$gray7" lineHeight={24} onPress={onPress}>
        Manage polling stations.
      </Typography>
    </View>
  );
};

export default Index;
