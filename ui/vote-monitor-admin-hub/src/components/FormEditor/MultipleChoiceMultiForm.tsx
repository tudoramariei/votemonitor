
import { FormModel, TFormMultipleChoiceMultiQuestion } from "@/redux/api/types";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from "react";
import QuestionFormInput from "./QuestionFormInput";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface OpenQuestionFormProps {
  localForm: FormModel;
  question: TFormMultipleChoiceMultiQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  isInValid: boolean;
}

export default function MultipleChoiceMultiForm({
  localForm,
  question,
  questionIdx,
  updateQuestion,
  isInValid,
}: OpenQuestionFormProps): JSX.Element {
  const lastChoiceRef = useRef<HTMLInputElement>(null);
  const [isNew, setIsNew] = useState(true);
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const questionRef = useRef<HTMLInputElement>(null);
  const [isInvalidValue, setIsInvalidValue] = useState<string | null>(null);


  const updateChoice = (choiceIdx: number, updatedAttributes: { label: string }) => {
    const newLabel = updatedAttributes.label;
    const oldLabel = question.choices[choiceIdx].label;
    let newChoices: any[] = [];
    if (question.choices) {
      newChoices = question.choices.map((choice, idx) => {
        if (idx !== choiceIdx) return choice;
        return { ...choice, ...updatedAttributes };
      });
    }

    let newLogic: any[] = [];
    question.logic?.forEach((logic) => {
      let newL: string | string[] | undefined = logic.value;
      if (Array.isArray(logic.value)) {
        newL = logic.value.map((value) => (value === oldLabel ? newLabel : value));
      } else {
        newL = logic.value === oldLabel ? newLabel : logic.value;
      }
      newLogic.push({ ...logic, value: newL });
    });
    updateQuestion(questionIdx, { choices: newChoices, logic: newLogic });
  };

  const findDuplicateLabel = () => {
    for (let i = 0; i < question.choices.length; i++) {
      for (let j = i + 1; j < question.choices.length; j++) {
        if (question.choices[i].label.trim() === question.choices[j].label.trim()) {
          return question.choices[i].label.trim(); // Return the duplicate label
        }
      }
    }
    return null;
  };

  const findEmptyLabel = () => {
    for (let i = 0; i < question.choices.length; i++) {
      if (question.choices[i].label.trim() === "") return true;
    }
    return false;
  };

  const addChoice = (choiceIdx?: number) => {
    setIsNew(false); // This question is no longer new.
    let newChoices = !question.choices ? [] : question.choices;
    const otherChoice = newChoices.find((choice) => choice.id === "other");
    if (otherChoice) {
      newChoices = newChoices.filter((choice) => choice.id !== "other");
    }
    const newChoice = { id: uuidv4(), label: "" };
    if (choiceIdx !== undefined) {
      newChoices.splice(choiceIdx + 1, 0, newChoice);
    } else {
      newChoices.push(newChoice);
    }
    if (otherChoice) {
      newChoices.push(otherChoice);
    }
    updateQuestion(questionIdx, { choices: newChoices });
  };

  const addOther = () => {
    if (question.choices.filter((c) => c.id === "other").length === 0) {
      const newChoices = !question.choices ? [] : question.choices.filter((c) => c.id !== "other");
      newChoices.push({ id: "other", label: "Other" });
      updateQuestion(questionIdx, {
        choices: newChoices
      });
    }
  };

  const deleteChoice = (choiceIdx: number) => {
    const newChoices = !question.choices ? [] : question.choices.filter((_, idx) => idx !== choiceIdx);

    const choiceValue = question.choices[choiceIdx].label;
    if (isInvalidValue === choiceValue) {
      setIsInvalidValue(null);
    }
    let newLogic: any[] = [];
    question.logic?.forEach((logic) => {
      let newL: string | string[] | undefined = logic.value;
      if (Array.isArray(logic.value)) {
        newL = logic.value.filter((value) => value !== choiceValue);
      } else {
        newL = logic.value !== choiceValue ? logic.value : undefined;
      }
      newLogic.push({ ...logic, value: newL });
    });

    updateQuestion(questionIdx, { choices: newChoices, logic: newLogic });
  };

  useEffect(() => {
    if (lastChoiceRef.current) {
      lastChoiceRef.current?.focus();
    }
  }, [question.choices?.length]);

  // This effect will run once on initial render, setting focus to the question input.
  useEffect(() => {
    if (isNew && questionRef.current) {
      questionRef.current.focus();
    }
  }, [isNew]);


  return (
    <form>
      <QuestionFormInput
        localForm={localForm}
        isInValid={isInValid}
        ref={questionRef}
        question={question}
        questionIdx={questionIdx}
        updateQuestion={updateQuestion}
      />

      <div className="mt-3">
        {showSubheader && (
          <>
            <Label htmlFor="subheader">Description</Label>
            <div className="mt-2 inline-flex w-full items-center">
              <Input
                id="subheader"
                name="subheader"
                value={question.subheader}
                onChange={(e) => updateQuestion(questionIdx, { subheader: e.target.value })}
              />
              <TrashIcon
                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                onClick={() => {
                  setShowSubheader(false);
                  updateQuestion(questionIdx, { subheader: "" });
                }}
              />
            </div>
          </>
        )}
        {!showSubheader && (
          <Button size="sm" variant="outline" type="button" onClick={() => setShowSubheader(true)}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>

      <div className="mt-3">
        <Label htmlFor="choices">Options</Label>
        <div className="mt-2 space-y-2" id="choices">
          {question.choices &&
            question.choices.map((choice, choiceIdx) => (
              <div key={choiceIdx} className="inline-flex w-full items-center">
                <Input
                  ref={choiceIdx === question.choices.length - 1 ? lastChoiceRef : null}
                  id={choice.id}
                  name={choice.id}
                  value={choice.label}
                  className={cn(choice.id === "other" && "border-dashed", (isInvalidValue === "" && choice.label.trim() === "") ||
                    (isInvalidValue !== null && choice.label.trim() === isInvalidValue.trim()) && "border-red-300 focus:border-red-300")}
                  placeholder={choice.id === "other" ? "Other" : `Option ${choiceIdx + 1}`}
                  onChange={(e) => updateChoice(choiceIdx, { label: e.target.value })}
                  onBlur={() => {
                    const duplicateLabel = findDuplicateLabel();
                    if (duplicateLabel) {
                      setIsInvalidValue(duplicateLabel);
                    } else if (findEmptyLabel()) {
                      setIsInvalidValue("");
                    } else {
                      setIsInvalidValue(null);
                    }
                  }}

                />
                {question.choices && question.choices.length > 2 && (
                  <TrashIcon
                    className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                    onClick={() => deleteChoice(choiceIdx)}
                  />
                )}
                <div className="ml-2 h-4 w-4">
                  {choice.id !== "other" && (
                    <PlusIcon
                      className="h-full w-full cursor-pointer text-slate-400 hover:text-slate-500"
                      onClick={() => addChoice(choiceIdx)}
                    />
                  )}
                </div>
              </div>
            ))}
          <div className="flex items-center justify-between space-x-2">
            {question.choices.filter((c) => c.id === "other").length === 0 && (
              <Button size="sm" variant="outline" type="button" onClick={() => addOther()}>
                Add &quot;Other&quot;
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => {
                updateQuestion(questionIdx, { type: "multipleChoiceSingle" });
              }}>
              Convert to Single Select
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
