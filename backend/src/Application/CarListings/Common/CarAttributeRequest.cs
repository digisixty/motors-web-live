using System.Text.Json.Serialization;

namespace MyApp.Application.CarListings.Common;

public record CarAttributeRequest
{
    [JsonPropertyName("carAttributeId")]
    public int CarAttributeId { get; init; }
    public string? Value { get; init; }
}