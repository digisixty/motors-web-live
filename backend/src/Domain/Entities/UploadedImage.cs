using System.ComponentModel.DataAnnotations.Schema;
using MyApp.Domain.Common;

namespace MyApp.Domain.Entities;

public class UploadedImage : BaseAuditableEntity
{
    [Column(TypeName = "varchar(500)")]
    public string OriginalFileName { get; set; } = string.Empty;

    [Column(TypeName = "varchar(500)")]
    public string StoredFileName { get; set; } = string.Empty;

    [Column(TypeName = "varchar(1000)")]
    public string RelativeUrl { get; set; } = string.Empty;

    [Column(TypeName = "varchar(500)")]
    public string ContentType { get; set; } = string.Empty;

    public long FileSizeInBytes { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string? FolderPath { get; set; }

    [Column(TypeName = "varchar(500)")]
    public string? Description { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string? AltText { get; set; }

    /// <summary>
    /// Gets the absolute URL by combining the MinIO public base URL with the relative URL.
    /// This is a computed property that is not stored in the database.
    /// </summary>
    [NotMapped]
    public string AbsoluteUrl => StaticConfiguration.GetAbsoluteUrl(RelativeUrl);
}