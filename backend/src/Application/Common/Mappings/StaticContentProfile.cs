using AutoMapper;
using MyApp.Application.StaticContents.Commands.CreateStaticContent;
using MyApp.Application.StaticContents.Commands.UpdateStaticContent;
using MyApp.Application.StaticContents.Common;
using MyApp.Domain.Entities;

namespace MyApp.Application.Common.Mappings;

public class StaticContentProfile : Profile
{
    public StaticContentProfile()
    {
        CreateMap<StaticContent, StaticContentDto>()
            .ForMember(dest => dest.MainImageAbsoluteUrl, opt => opt.Ignore());

        CreateMap<CreateStaticContentCommand, StaticContent>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.LastModified, opt => opt.Ignore())
            .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore());

        CreateMap<UpdateStaticContentCommand, StaticContent>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.LastModified, opt => opt.Ignore())
            .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore());
    }
}
