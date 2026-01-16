namespace MyApp.Application.Common.Interfaces;

public interface IRecaptchaService
{
    /// <summary>
    /// Validates a Google reCAPTCHA v3 token
    /// </summary>
    /// <param name="token">The reCAPTCHA token from the client</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the token is valid, false otherwise</returns>
    Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
}