using MyApp.Domain.Entities;

namespace MyApp.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<CarAttribute> CarAttributes { get; }

    DbSet<CarListing> CarListings { get; }

    DbSet<CarListingAttribute> CarListingAttributes { get; }

    DbSet<CarOption> CarOptions { get; }

    DbSet<CarListingOption> CarListingOptions { get; }

    DbSet<Manufacturer> Manufacturers { get; }

    DbSet<CarModel> CarModels { get; }

    DbSet<Blog> Blogs { get; }

    DbSet<StaticPage> StaticPages { get; }

    DbSet<UploadedImage> UploadedImages { get; }

    DbSet<ContactSubmission> ContactSubmissions { get; }

    DbSet<Slider> Sliders { get; }

    DbSet<StaticContent> StaticContents { get; }

    DbSet<NewsletterSubscription> NewsletterSubscriptions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
