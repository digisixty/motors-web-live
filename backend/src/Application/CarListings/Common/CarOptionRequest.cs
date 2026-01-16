using System.Text.Json.Serialization;

namespace MyApp.Application.CarListings.Common;

public record CarOptionRequest
{
    [JsonPropertyName("carOptionId")]
    public int CarOptionId { get; init; }
    public string? Value { get; init; }
}