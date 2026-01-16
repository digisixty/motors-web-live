using AutoMapper;
using MyApp.Application.CarAttributes.Queries.GetCarAttributes;
using MyApp.Domain.Entities;

namespace MyApp.Application.Common.Mappings;

public class CarAttributeProfile : Profile
{
    public CarAttributeProfile()
    {
        CreateMap<CarAttribute, CarAttributeDto>()
            .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.Children));
    }
}