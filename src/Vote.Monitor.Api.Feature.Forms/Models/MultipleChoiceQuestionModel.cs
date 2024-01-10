﻿using Vote.Monitor.Domain.Entities.FormAggregate;

namespace Vote.Monitor.Api.Feature.Forms.Models;

public class MultipleChoiceQuestionModel : BaseQuestionModel
{
    public List<QuestionOptionModel> Options { get; }

    public MultipleChoiceQuestionModel(Guid id,
        string headline,
        string subheader,
        List<QuestionOptionModel> options) : base(id, headline, subheader, QuetionType.MultiResponse)
    {
        Options = options;
    }
}
