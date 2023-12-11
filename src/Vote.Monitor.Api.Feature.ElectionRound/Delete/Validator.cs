﻿namespace Vote.Monitor.Api.Feature.ElectionRound.Delete;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
