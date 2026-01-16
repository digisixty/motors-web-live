using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Infrastructure.Services;

public class RecaptchaSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public float MinimumScore { get; set; } = 0.5f;
    public bool Enabled { get; set; } = true;
}

public class RecaptchaResponse
{
    public bool Success { get; set; }
    public float Score { get; set; }
    public string Action { get; set; } = string.Empty;
    public string ChallengeTs { get; set; } = string.Empty;
    public string Hostname { get; set; } = string.Empty;
    public List<string> ErrorCodes { get; set; } = new();
}

public class RecaptchaService : IRecaptchaService
{
    private readonly HttpClient _httpClient;
    private readonly RecaptchaSettings _settings;
    private readonly ILogger<RecaptchaService> _logger;

    private const string VerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

    public RecaptchaService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<RecaptchaService> logger)
    {
        _httpClient = httpClient;
        _settings = configuration.GetSection("Recaptcha").Get<RecaptchaSettings>() ?? new RecaptchaSettings();
        _logger = logger;
    }

    public async Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        if (!_settings.Enabled || string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning("reCAPTCHA is disabled or token is empty");
            return _settings.Enabled == false; // Return true if disabled, false if token is empty
        }

        if (string.IsNullOrWhiteSpace(_settings.SecretKey))
        {
            _logger.LogError("reCAPTCHA secret key is not configured");
            return false;
        }

        try
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("secret", _settings.SecretKey),
                new KeyValuePair<string, string>("response", token)
            });

            var response = await _httpClient.PostAsync(VerifyUrl, content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
            var recaptchaResponse = JsonSerializer.Deserialize<RecaptchaResponse>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (recaptchaResponse == null)
            {
                _logger.LogError("Failed to deserialize reCAPTCHA response");
                return false;
            }

            if (!recaptchaResponse.Success)
            {
                _logger.LogWarning("reCAPTCHA validation failed: {ErrorCodes}", string.Join(", ", recaptchaResponse.ErrorCodes));
                return false;
            }

            if (recaptchaResponse.Score < _settings.MinimumScore)
            {
                _logger.LogWarning("reCAPTCHA score too low: {Score} < {MinimumScore}", recaptchaResponse.Score, _settings.MinimumScore);
                return false;
            }

            _logger.LogInformation("reCAPTCHA validation successful with score: {Score}", recaptchaResponse.Score);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating reCAPTCHA token");
            return false;
        }
    }
}