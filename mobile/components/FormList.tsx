import { ComponentType, JSXElementConstructor, ReactElement, useMemo, useState } from "react";
import { FormStatus, mapFormToFormListItem } from "../services/form.parser";
import { useUserData } from "../contexts/user/UserContext.provider";
import { useTranslation } from "react-i18next";
import { useElectionRoundAllForms } from "../services/queries/forms.query";
import { Controller, FieldError, FieldErrorsImpl, Merge, useForm } from "react-hook-form";
import {
  getFormLanguagePreference,
  setFormLanguagePreference,
} from "../common/language.preferences";
import { router } from "expo-router";
import { Typography } from "./Typography";
import { XStack, YStack } from "tamagui";
import { ListView } from "./ListView";
import FormCard from "./FormCard";
import { Dialog } from "./Dialog";
import RadioFormInput from "./FormInputs/RadioFormInput";
import Button from "./Button";
import { useFormSubmissions } from "../services/queries/form-submissions.query";
import { arrayToKeyObject } from "../helpers/misc";

export type FormListItem = {
  id: string;
  name: string;
  options: string;
  numberOfQuestions: number;
  numberOfCompletedQuestions: number;
  languages: string[];
  status: FormStatus;
};

const FormList = ({
  ListHeaderComponent,
}: {
  ListHeaderComponent:
    | ComponentType<any>
    | ReactElement<any, string | JSXElementConstructor<any>>
    | null
    | undefined;
}) => {
  const { activeElectionRound, selectedPollingStation } = useUserData();
  const [selectedForm, setSelectedForm] = useState<FormListItem | null>(null);
  const { t } = useTranslation("form_overview");

  const {
    data: allForms,
    isLoading: isLoadingForms,
    error: formsError,
  } = useElectionRoundAllForms(activeElectionRound?.id, (data) =>
    arrayToKeyObject(data.forms || [], "id"),
  );

  const {
    data: formSubmissions,
    isLoading: isLoadingAnswers,
    error: answersError,
  } = useFormSubmissions(activeElectionRound?.id, selectedPollingStation?.pollingStationId);

  const formList: FormListItem[] = useMemo(() => {
    return allForms && formSubmissions
      ? mapFormToFormListItem(Object.values(allForms), formSubmissions)
      : [];
  }, [allForms, formSubmissions]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onConfirmFormLanguage = (formItem: FormListItem, language: string) => {
    setFormLanguagePreference({ formId: formItem.id, language });

    router.push(`/form-details/${formItem?.id}?language=${language}`); // TODO @birloiflorian we can pass formTitle
    setSelectedForm(null);
  };

  const openForm = async (formItem: FormListItem) => {
    if (!formItem?.languages?.length) {
      // TODO: Display error toast
      console.log("No language exists");
    }

    const preferedLanguage = await getFormLanguagePreference({ formId: formItem.id });

    if (preferedLanguage && formItem.languages.includes(preferedLanguage)) {
      onConfirmFormLanguage(formItem, preferedLanguage);
    } else if (formItem?.languages?.length === 1) {
      onConfirmFormLanguage(formItem, formItem.languages[0]);
    } else {
      setSelectedForm(formItem);
    }
  };

  if (isLoadingAnswers || isLoadingForms) {
    return <Typography>Loading...</Typography>;
  }

  if (Object.keys(allForms || {}).length === 0) {
    return <Typography>No data to display</Typography>;
  }

  if (formsError || answersError) {
    return <Typography>Error while showing form data</Typography>;
  }

  return (
    <YStack gap="$xxs">
      {/* height = number of forms * formCard max height + ListHeaderComponent height  */}
      <YStack height={formList.length * 140 + 400}>
        <ListView<FormListItem>
          data={formList}
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          renderItem={({ item, index }) => {
            return (
              <>
                <FormCard
                  key={index}
                  form={item}
                  onPress={openForm.bind(null, item)}
                  marginBottom="$xxs"
                />
              </>
            );
          }}
          estimatedItemSize={100}
        />
        {selectedForm && (
          <Controller
            key={selectedForm.id}
            name={selectedForm.name}
            control={control}
            rules={{
              required: { value: true, message: t("language_modal.error") },
            }}
            render={({ field: { onChange, value } }) => (
              <Dialog
                open={!!selectedForm}
                header={<Typography preset="heading">{t("language_modal.header")}</Typography>}
                content={
                  <DialogContent
                    languages={selectedForm.languages}
                    error={errors[selectedForm.name]}
                    value={value}
                    onChange={onChange}
                  />
                }
                footer={
                  <XStack gap="$md">
                    <Button preset="chromeless" onPress={setSelectedForm.bind(null, null)}>
                      Cancel
                    </Button>
                    <Button
                      onPress={handleSubmit(() => onConfirmFormLanguage(selectedForm, value))}
                      flex={1}
                    >
                      Save
                    </Button>
                  </XStack>
                }
              />
            )}
          />
        )}
      </YStack>
    </YStack>
  );
};

const DialogContent = ({
  languages,
  error,
  value,
  onChange,
}: {
  languages: string[];
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  value: string;
  onChange: (...event: any[]) => void;
}) => {
  const { t } = useTranslation("form_overview");

  const languageMapping: { [key: string]: string } = {
    RO: "Romanian",
    EN: "English",
    PL: "Polish",
    BG: "Bulgarian",
  };

  const transformedLanguages = languages.map((language) => ({
    id: language,
    value: language,
    // TODO: decide if we add the name to the label as well
    label: languageMapping[language] || language,
  }));

  return (
    <YStack>
      <Typography preset="body1" marginBottom="$lg">
        {t("language_modal.helper")}
      </Typography>
      <RadioFormInput options={transformedLanguages} value={value} onValueChange={onChange} />
      {error && (
        <Typography marginTop="$sm" style={{ color: "red" }}>
          {`${error.message}`}
        </Typography>
      )}
    </YStack>
  );
};

export default FormList;
