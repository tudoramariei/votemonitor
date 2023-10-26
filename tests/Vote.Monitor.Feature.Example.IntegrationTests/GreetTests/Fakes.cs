﻿using Bogus;

namespace Vote.Monitor.Feature.Example.IntegrationTests.GreetTests;

static class Fakes
{
    public static Greet.Request GreetRequest(this Faker f) => new()
    {
        Name = f.Name.FullName()
    };
}
