using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using MyApp.Domain.Common;

namespace MyApp.Domain.Entities;

public class StaticPage : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? Content { get; set; }

    public string? Excerpt { get; set; }

    public string? CoverImage { get; set; }

    public bool IsPublished { get; set; } = false;

    public string? MetaTitle { get; set; }

    public string? MetaDescription { get; set; }

    public List<string>? ImagesGallery { get; set; } = new();

    public List<string>? VideosGallery { get; set; } = new();

    private string? _metaTags;

    public string? MetaTags
    {
        get => _metaTags;
        set => _metaTags = value;
    }

    [NotMapped]
    public object? MetaTagsObject
    {
        get
        {
            if (string.IsNullOrEmpty(_metaTags))
                return null;

            try
            {
                return JsonSerializer.Deserialize<object>(_metaTags);
            }
            catch
            {
                return null;
            }
        }
        set
        {
            if (value == null)
            {
                _metaTags = null;
                return;
            }

            try
            {
                _metaTags = JsonSerializer.Serialize(value);
            }
            catch
            {
                _metaTags = null;
            }
        }
    }
}