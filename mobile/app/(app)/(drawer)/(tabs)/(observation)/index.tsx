import React from "react";
import { useNavigation } from "expo-router";
import { Screen } from "../../../../../components/Screen";
import { useUserData } from "../../../../../contexts/user/UserContext.provider";
import { Typography } from "../../../../../components/Typography";
import { YStack } from "tamagui";
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

const Index = () => {
  const navigation = useNavigation();

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
    </Screen>
  );
};

export default Index;
