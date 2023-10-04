﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FastEndpoints;
using Vote.Monitor.Feature.PollingStation.GetPollingStation;
using Vote.Monitor.Core.Models;

namespace Vote.Monitor.Feature.PollingStation.CreatePollingStation;
internal class CreatePollingStationMapper : Mapper<PollingStationCreateRequestDto, PollingStationReadDto, Core.Models.PollingStationEf>
{

    public override PollingStationEf ToEntity(PollingStationCreateRequestDto source)
    {
        PollingStationEf st = new()
        {
            Address = source.Address,
            DisplayOrder = source.DisplayOrder
        };
        foreach (var tag in source.Tags)
        {
            st.Tags.Add(new TagEf()
            {
                Key = tag.Key,
                Value = tag.Value
            });
        }


        return st;
    }
    public override PollingStationReadDto FromEntity(PollingStationEf source)
    {
        return new PollingStationReadDto()
        {
            Id = source.Id,
            Address = source.Address,
            DisplayOrder = source.DisplayOrder,
            Tags = source.TagsDictionary()

        };
    }
}
