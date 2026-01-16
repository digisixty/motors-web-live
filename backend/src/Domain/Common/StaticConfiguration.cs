namespace MyApp.Domain.Common;

public static class StaticConfiguration
{
    public static string MinioPublicBaseUrl { get; private set; } = string.Empty;

    public static void Initialize(string minioPublicBaseUrl)
    {
        MinioPublicBaseUrl = minioPublicBaseUrl ?? string.Empty;
    }

    public static string GetAbsoluteUrl(string relativeUrl)
    {
        if (string.IsNullOrEmpty(relativeUrl))
            return string.Empty;

        if (string.IsNullOrEmpty(MinioPublicBaseUrl))
            return relativeUrl;

        return $"{MinioPublicBaseUrl.TrimEnd('/')}/{relativeUrl.TrimStart('/')}";
    }
}