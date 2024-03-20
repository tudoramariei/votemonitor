﻿using FastEndpoints;
using FluentValidation;
using Vote.Monitor.Core.Validation;
using Vote.Monitor.Domain.Entities.FormBase.Validation;

namespace Vote.Monitor.Domain.Entities.FormTemplateAggregate;

public class FormTemplateValidator : Validator<FormTemplate>
{
    public FormTemplateValidator()
    {
        RuleFor(x => x.Name).SetValidator(new TranslatedStringValidator());

        RuleForEach(x => x.Questions)
            .SetInheritanceValidator(v =>
            {
                v.Add(new TextQuestionValidator());
                v.Add(new NumberQuestionValidator());
                v.Add(new DateQuestionValidator());
                v.Add(new SingleSelectQuestionValidator());
                v.Add(new MultiSelectQuestionValidator());
                v.Add(new RatingQuestionValidator());
            });
    }
}
