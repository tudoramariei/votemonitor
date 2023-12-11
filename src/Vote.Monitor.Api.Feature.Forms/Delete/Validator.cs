﻿namespace Vote.Monitor.Api.Feature.Forms.Delete;

public class Validator : Validator<Request>
{
    public Validator()
    {
        //RuleFor(x => x.ElectionRoundId)
        //    .NotEmpty();

        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
