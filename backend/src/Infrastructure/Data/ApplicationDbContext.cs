using System.Reflection;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;
using MyApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<CarAttribute> CarAttributes => Set<CarAttribute>();

    public DbSet<CarListing> CarListings => Set<CarListing>();

    public DbSet<CarListingAttribute> CarListingAttributes => Set<CarListingAttribute>();

    public DbSet<CarOption> CarOptions => Set<CarOption>();

    public DbSet<CarListingOption> CarListingOptions => Set<CarListingOption>();

    public DbSet<Manufacturer> Manufacturers => Set<Manufacturer>();

    public DbSet<CarModel> CarModels => Set<CarModel>();

    public DbSet<Blog> Blogs => Set<Blog>();

    public DbSet<StaticPage> StaticPages => Set<StaticPage>();

    public DbSet<UploadedImage> UploadedImages => Set<UploadedImage>();

    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    public DbSet<Slider> Sliders => Set<Slider>();

    public DbSet<StaticContent> StaticContents => Set<StaticContent>();

    public DbSet<NewsletterSubscription> NewsletterSubscriptions => Set<NewsletterSubscription>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
