using AutoMapper;
using MyApp.Application.Sliders.Commands.CreateSlider;
using MyApp.Application.Sliders.Commands.UpdateSlider;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Entities;

namespace MyApp.Application.Common.Mappings;

public class SliderProfile : Profile
{
    public SliderProfile()
    {
        CreateMap<Slider, SliderDto>()
            .ForMember(dest => dest.ImageAbsoluteUrl, opt => opt.Ignore())
            .ForMember(dest => dest.VideoAbsoluteUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Car, opt => opt.MapFrom(src => src.Car));

        CreateMap<Slider, PublicSliderDto>()
            .ForMember(dest => dest.ImageAbsoluteUrl, opt => opt.Ignore())
            .ForMember(dest => dest.VideoAbsoluteUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Car, opt => opt.MapFrom(src => src.Car));

        CreateMap<CreateSliderCommand, Slider>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.LastModified, opt => opt.Ignore())
            .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore());

        CreateMap<UpdateSliderCommand, Slider>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.LastModified, opt => opt.Ignore())
            .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore());

        CreateMap<CarListing, CarDto>()
            .ForMember(dest => dest.PrimaryImageAbsoluteUrl, opt => opt.Ignore())
            .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(src => src.Manufacturer != null ? src.Manufacturer.Title : null))
            .ForMember(dest => dest.CarModelName, opt => opt.MapFrom(src => src.CarModel != null ? src.CarModel.Name : null));
    }
}