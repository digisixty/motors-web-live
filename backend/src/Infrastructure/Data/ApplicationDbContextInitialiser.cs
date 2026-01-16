using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MyApp.Domain.Enums;
using MyApp.Infrastructure.Identity;

namespace MyApp.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IHostEnvironment environment, IConfiguration configuration)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _environment = environment;
        _configuration = configuration;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            // See https://jasontaylor.dev/ef-core-database-initialisation-strategies
            if (_environment.IsDevelopment())
            {
                await _context.Database.EnsureDeletedAsync();
            }
            await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles
        var administratorRole = new IdentityRole(Roles.Administrator);

        if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
        {
            await _roleManager.CreateAsync(administratorRole);
        }

        // Default users
        var defaultAdminEmail = "administrator@localhost";
        var defaultAdminPassword = "Administrator1!";

        // Check for production admin credentials in configuration
        var adminSettings = _configuration.GetSection("AdminSettings");
        var productionAdminEmail = adminSettings["Email"];
        var productionAdminPassword = adminSettings["Password"];

        // Use production admin credentials if available, otherwise use development defaults
        if (!string.IsNullOrWhiteSpace(productionAdminEmail) && !string.IsNullOrWhiteSpace(productionAdminPassword))
        {
            defaultAdminEmail = productionAdminEmail;
            defaultAdminPassword = productionAdminPassword;
            _logger.LogInformation("Using production administrator credentials from configuration");
        }
        else if (_environment.IsProduction())
        {
            _logger.LogWarning("Production environment detected but no AdminSettings configuration found. Using default admin credentials.");
        }

        var administrator = new ApplicationUser { UserName = defaultAdminEmail, Email = defaultAdminEmail };

        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, defaultAdminPassword);
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, new[] { administratorRole.Name });
            }

            _logger.LogInformation("Created administrator user: {Email}", defaultAdminEmail);
        }

        // Seed sample data for development environment
        if (_environment.IsDevelopment())
        {
            await SeedSampleDataAsync();
        }
    }

    private async Task SeedSampleDataAsync()
    {
        // Seed manufacturers and car models
        if (!_context.Manufacturers.Any())
        {
            var manufacturers = new List<Manufacturer>
            {
                new()
                {
                    Title = "Toyota",
                    Slug = "toyota",
                    Description = "Japanese automotive manufacturer known for reliability and innovation.",
                    Logo = "/images/logos/toyota.png"
                },
                new()
                {
                    Title = "BMW",
                    Slug = "bmw",
                    Description = "German luxury vehicle manufacturer specializing in premium automobiles.",
                    Logo = "/images/logos/bmw.png"
                },
                new()
                {
                    Title = "Ford",
                    Slug = "ford",
                    Description = "American multinational automaker with a rich history of producing iconic vehicles.",
                    Logo = "/images/logos/ford.png"
                }
            };

            _context.Manufacturers.AddRange(manufacturers);
            await _context.SaveChangesAsync();

            // Seed car models for each manufacturer
            var toyota = manufacturers.First(m => m.Slug == "toyota");
            var bmw = manufacturers.First(m => m.Slug == "bmw");
            var ford = manufacturers.First(m => m.Slug == "ford");

            var carModels = new List<CarModel>
            {
                // Toyota models
                new() { Name = "Camry", Slug = "camry", ManufacturerId = toyota.Id, Image = "/images/models/camry.png" },
                new() { Name = "Corolla", Slug = "corolla", ManufacturerId = toyota.Id, Image = "/images/models/corolla.png" },
                new() { Name = "RAV4", Slug = "rav4", ManufacturerId = toyota.Id, Image = "/images/models/rav4.png" },

                // BMW models
                new() { Name = "3 Series", Slug = "3-series", ManufacturerId = bmw.Id, Image = "/images/models/3-series.png" },
                new() { Name = "X5", Slug = "x5", ManufacturerId = bmw.Id, Image = "/images/models/x5.png" },
                new() { Name = "5 Series", Slug = "5-series", ManufacturerId = bmw.Id, Image = "/images/models/5-series.png" },

                // Ford models
                new() { Name = "F-150", Slug = "f-150", ManufacturerId = ford.Id, Image = "/images/models/f-150.png" },
                new() { Name = "Mustang", Slug = "mustang", ManufacturerId = ford.Id, Image = "/images/models/mustang.png" },
                new() { Name = "Explorer", Slug = "explorer", ManufacturerId = ford.Id, Image = "/images/models/explorer.png" }
            };

            _context.CarModels.AddRange(carModels);
            await _context.SaveChangesAsync();
        }

        // Seed car attributes
        if (!_context.CarAttributes.Any())
        {
            var attributes = new List<CarAttribute>
            {
                // Colors
                new() { Name = "Color", Slug = "color", Type = Domain.Enums.CarAttributeType.List },
                new() { Name = "Black", Slug = "black", ParentId = 1, Type = Domain.Enums.CarAttributeType.Color },
                new() { Name = "White", Slug = "white", ParentId = 1, Type = Domain.Enums.CarAttributeType.Color },
                new() { Name = "Silver", Slug = "silver", ParentId = 1, Type = Domain.Enums.CarAttributeType.Color },
                new() { Name = "Red", Slug = "red", ParentId = 1, Type = Domain.Enums.CarAttributeType.Color },
                new() { Name = "Blue", Slug = "blue", ParentId = 1, Type = Domain.Enums.CarAttributeType.Color },

                // Fuel Type
                new() { Name = "Fuel Type", Slug = "fuel-type", Type = Domain.Enums.CarAttributeType.List },
                new() { Name = "Gasoline", Slug = "gasoline", ParentId = 7, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Diesel", Slug = "diesel", ParentId = 7, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Hybrid", Slug = "hybrid", ParentId = 7, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Electric", Slug = "electric", ParentId = 7, Type = Domain.Enums.CarAttributeType.String },

                // Transmission
                new() { Name = "Transmission", Slug = "transmission", Type = Domain.Enums.CarAttributeType.List },
                new() { Name = "Automatic", Slug = "automatic", ParentId = 12, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Manual", Slug = "manual", ParentId = 12, Type = Domain.Enums.CarAttributeType.String },

                // Engine Size
                new() { Name = "Engine Size", Slug = "engine-size", Type = Domain.Enums.CarAttributeType.List },
                new() { Name = "2.0L", Slug = "2-0l", ParentId = 15, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "2.5L", Slug = "2-5l", ParentId = 15, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "3.0L", Slug = "3-0l", ParentId = 15, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "5.0L", Slug = "5-0l", ParentId = 15, Type = Domain.Enums.CarAttributeType.String },

                // Year
                new() { Name = "Year", Slug = "year", Type = Domain.Enums.CarAttributeType.Number },

                // Mileage
                new() { Name = "Mileage", Slug = "mileage", Type = Domain.Enums.CarAttributeType.Number },

                // Condition
                new() { Name = "Condition", Slug = "condition", Type = Domain.Enums.CarAttributeType.List },
                new() { Name = "New", Slug = "new", ParentId = 22, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Used", Slug = "used", ParentId = 22, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Certified Pre-Owned", Slug = "certified-pre-owned", ParentId = 22, Type = Domain.Enums.CarAttributeType.String },

                // Car Type
                new() { Name = "Car Type", Slug = "car-type", Type = Domain.Enums.CarAttributeType.List },
                new() { Name = "SUV", Slug = "suv", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Sedan", Slug = "sedan", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Hatchback", Slug = "hatchback", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Coupe", Slug = "coupe", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Convertible", Slug = "convertible", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Truck", Slug = "truck", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Van", Slug = "van", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Wagon", Slug = "wagon", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Hybrid", Slug = "hybrid-type", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Electric", Slug = "electric-type", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Sports Car", Slug = "sports-car", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Luxury", Slug = "luxury", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Compact", Slug = "compact", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Mid-size", Slug = "mid-size", ParentId = 26, Type = Domain.Enums.CarAttributeType.String },
                new() { Name = "Full-size", Slug = "full-size", ParentId = 26, Type = Domain.Enums.CarAttributeType.String }
            };

            _context.CarAttributes.AddRange(attributes);
            await _context.SaveChangesAsync();
        }

        // Seed blog posts
        if (!_context.Blogs.Any())
        {
            var blogs = new List<Blog>
            {
                new()
                {
                    Title = "Top 5 Family Cars for 2024",
                    Slug = "top-5-family-cars-2024",
                    ShortDescription = "Discover the best family-friendly vehicles that combine safety, comfort, and value.",
                    FullDescription = "Finding the perfect family car requires balancing multiple factors including safety ratings, cargo space, fuel efficiency, and overall comfort. This comprehensive guide explores the top 5 family vehicles for 2024, each offering unique advantages for different family needs.",
                    CoverImage = "/images/blogs/family-cars-2024.jpg"
                },
                new()
                {
                    Title = "Electric vs Hybrid: Which is Right for You?",
                    Slug = "electric-vs-hybrid-2024",
                    ShortDescription = "Compare the pros and cons of electric and hybrid vehicles to make an informed decision.",
                    FullDescription = "As the automotive industry shifts towards sustainable transportation, consumers face the choice between electric and hybrid vehicles. This article breaks down the key differences, benefits, and considerations for each option.",
                    CoverImage = "/images/blogs/electric-vs-hybrid.jpg"
                },
                new()
                {
                    Title = "Essential Car Maintenance Tips",
                    Slug = "essential-car-maintenance-tips",
                    ShortDescription = "Keep your vehicle running smoothly with these crucial maintenance guidelines.",
                    FullDescription = "Regular maintenance is key to extending your vehicle's lifespan and ensuring optimal performance. Learn the essential tasks every car owner should know, from oil changes to tire rotations.",
                    CoverImage = "/images/blogs/car-maintenance.jpg"
                },
                new()
                {
                    Title = "Luxury SUV Comparison: 2024 Edition",
                    Slug = "luxury-suv-comparison-2024",
                    ShortDescription = "A detailed comparison of the year's most luxurious SUVs.",
                    FullDescription = "Luxury SUVs offer the perfect blend of comfort, performance, and prestige. We compare the top models from leading manufacturers to help you choose the best option.",
                    CoverImage = "/images/blogs/luxury-suvs-2024.jpg"
                },
                new()
                {
                    Title = "How to Get the Best Car Deal",
                    Slug = "how-to-get-best-car-deal",
                    ShortDescription = "Expert tips for negotiating the best price on your next vehicle purchase.",
                    FullDescription = "Buying a car doesn't have to be a stressful experience. With the right preparation and negotiation strategies, you can secure a great deal on your dream vehicle.",
                    CoverImage = "/images/blogs/car-negotiation.jpg"
                },
                new()
                {
                    Title = "The Rise of Autonomous Driving",
                    Slug = "rise-autonomous-driving",
                    ShortDescription = "Exploring the latest developments in self-driving car technology.",
                    FullDescription = "Autonomous driving technology is rapidly evolving, promising to revolutionize how we travel. Discover the current state of self-driving cars and what the future holds.",
                    CoverImage = "/images/blogs/autonomous-driving.jpg"
                },
                new()
                {
                    Title = "Fuel Efficiency Guide: Save Money at the Pump",
                    Slug = "fuel-efficiency-guide",
                    ShortDescription = "Practical tips for improving your vehicle's fuel economy.",
                    FullDescription = "With rising fuel costs, maximizing your vehicle's efficiency is more important than ever. Learn simple techniques to reduce fuel consumption and save money.",
                    CoverImage = "/images/blogs/fuel-efficiency.jpg"
                },
                new()
                {
                    Title = "Classic Car Investment Guide",
                    Slug = "classic-car-investment-guide",
                    ShortDescription = "What you need to know before investing in vintage automobiles.",
                    FullDescription = "Classic cars can be excellent investments, but they require careful consideration. This guide covers everything from valuation to maintenance costs.",
                    CoverImage = "/images/blogs/classic-cars.jpg"
                },
                new()
                {
                    Title = "Winter Driving Safety Tips",
                    Slug = "winter-driving-safety-tips",
                    ShortDescription = "Stay safe on the roads during the winter months with these essential tips.",
                    FullDescription = "Winter driving presents unique challenges that require specific skills and preparation. Learn how to navigate safely through snow, ice, and freezing conditions.",
                    CoverImage = "/images/blogs/winter-driving.jpg"
                },
                new()
                {
                    Title = "The Future of Automotive Design",
                    Slug = "future-automotive-design",
                    ShortDescription = "Emerging trends shaping the cars of tomorrow.",
                    FullDescription = "Automotive design is evolving rapidly with new materials, technologies, and sustainability requirements. Explore the innovations that will define future vehicles.",
                    CoverImage = "/images/blogs/future-design.jpg"
                },
                new()
                {
                    Title = "Used Car Buying Checklist",
                    Slug = "used-car-buying-checklist",
                    ShortDescription = "Essential items to check when purchasing a pre-owned vehicle.",
                    FullDescription = "Buying a used car requires careful inspection to avoid costly problems. Follow our comprehensive checklist to make a smart purchase.",
                    CoverImage = "/images/blogs/used-car-checklist.jpg"
                },
                new()
                {
                    Title = "Understanding Car Financing Options",
                    Slug = "understanding-car-financing",
                    ShortDescription = "Navigate the complex world of auto loans and leasing.",
                    FullDescription = "Car financing can be confusing, but understanding your options is crucial for making the right financial decision. We break down loans, leases, and payment strategies.",
                    CoverImage = "/images/blogs/car-financing.jpg"
                },
                new()
                {
                    Title = "Sports Cars Under $50,000",
                    Slug = "sports-cars-under-50k",
                    ShortDescription = "High-performance vehicles that won't break the bank.",
                    FullDescription = "You don't need to spend a fortune to enjoy thrilling performance. We review the best sports cars available for under $50,000.",
                    CoverImage = "/images/blogs/sports-cars-50k.jpg"
                },
                new()
                {
                    Title = "Electric Vehicle Charging Guide",
                    Slug = "electric-vehicle-charging-guide",
                    ShortDescription = "Everything you need to know about EV charging infrastructure.",
                    FullDescription = "Charging infrastructure is a key consideration for electric vehicle owners. Learn about charging types, speeds, costs, and availability.",
                    CoverImage = "/images/blogs/ev-charging.jpg"
                },
                new()
                {
                    Title = "Car Insurance Explained",
                    Slug = "car-insurance-explained",
                    ShortDescription = "Understanding coverage options and finding the best rates.",
                    FullDescription = "Car insurance can be complex, but it's essential for protecting your investment. Learn about coverage types, factors affecting rates, and money-saving tips.",
                    CoverImage = "/images/blogs/car-insurance.jpg"
                }
            };

            _context.Blogs.AddRange(blogs);
            await _context.SaveChangesAsync();
        }

        // Seed car listings
        if (!_context.CarListings.Any())
        {
            var manufacturers = _context.Manufacturers.ToList();
            var carModels = _context.CarModels.ToList();
            var attributes = _context.CarAttributes.ToList();

            var listings = new List<CarListing>();
            var random = new Random();

            for (int i = 1; i <= 15; i++)
            {
                var randomModel = carModels[random.Next(carModels.Count)];
                var year = 2022 + random.Next(3); // 2022-2024
                var basePrice = random.Next(25000, 80000);
                var mileage = random.Next(1000, 50000);

                var stockNumber = $"STK{1000 + i}";
                var listing = new CarListing
                {
                    StockNumber = stockNumber,
                    Slug = $"{stockNumber.ToLower()}-{i}", // Generate unique slug
                    VinNumber = $"1HGCM82633A{100000 + i}",
                    RegistrationDate = DateTimeOffset.UtcNow.AddMonths(-random.Next(24)),
                    PrimaryImage = $"/images/listings/car-{i}-main.jpg",
                    InteriorImages = $"/images/listings/car-{i}-interior-1.jpg,/images/listings/car-{i}-interior-2.jpg",
                    ExteriorImages = $"/images/listings/car-{i}-exterior-1.jpg,/images/listings/car-{i}-exterior-2.jpg,/images/listings/car-{i}-exterior-3.jpg",
                    Price = basePrice,
                    SalePrice = basePrice * (decimal)(0.9 + random.NextDouble() * 0.1), // 90-100% of base price
                    IsSold = random.Next(10) > 8, // 20% chance of being sold
                    IsSpecialOffer = random.Next(10) > 7, // 30% chance of being special offer
                    ManufacturerId = randomModel.ManufacturerId,
                    CarModelId = randomModel.Id,
                    Manufacturer = manufacturers.First(m => m.Id == randomModel.ManufacturerId),
                    CarModel = randomModel
                };

                listings.Add(listing);
            }

            _context.CarListings.AddRange(listings);
            await _context.SaveChangesAsync();

            // Now add the listing attributes using the actual saved listing IDs
            foreach (var listing in listings)
            {
                var year = 2022 + random.Next(3); // 2022-2024
                var mileage = random.Next(1000, 50000);

                // Add year attribute
                var yearValue = attributes.FirstOrDefault(a => a.Slug == year.ToString());
                if (yearValue != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = yearValue.Id,
                        Value = year.ToString()
                    });
                }

                // Add color attribute
                var colorOptions = new[] { "black", "white", "silver", "red", "blue" };
                var selectedColor = colorOptions[random.Next(colorOptions.Length)];
                var colorValue = attributes.FirstOrDefault(a => a.Slug == selectedColor);
                if (colorValue != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = colorValue.Id,
                        Value = selectedColor
                    });
                }

                // Add fuel type attribute
                var fuelOptions = new[] { "gasoline", "diesel", "hybrid", "electric" };
                var selectedFuel = fuelOptions[random.Next(fuelOptions.Length)];
                var fuelValue = attributes.FirstOrDefault(a => a.Slug == selectedFuel);
                if (fuelValue != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = fuelValue.Id,
                        Value = selectedFuel
                    });
                }

                // Add transmission attribute
                var transmissionOptions = new[] { "automatic", "manual" };
                var selectedTransmission = transmissionOptions[random.Next(transmissionOptions.Length)];
                var transmissionValue = attributes.FirstOrDefault(a => a.Slug == selectedTransmission);
                if (transmissionValue != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = transmissionValue.Id,
                        Value = selectedTransmission
                    });
                }

                // Add mileage attribute
                var mileageAttribute = attributes.FirstOrDefault(a => a.Slug == "mileage");
                if (mileageAttribute != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = mileageAttribute.Id,
                        Value = mileage.ToString()
                    });
                }

                // Add condition attribute
                var conditionAttribute = attributes.FirstOrDefault(a => a.Slug == "condition");
                var conditionOptions = new[] { "new", "used", "certified-pre-owned" };
                var selectedCondition = conditionOptions[random.Next(conditionOptions.Length)];

                if (conditionAttribute != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = conditionAttribute.Id,
                        Value = selectedCondition
                    });
                }

                // Add car type attribute
                var carTypeAttribute = attributes.FirstOrDefault(a => a.Slug == "car-type");
                var carTypeOptions = new[] { "suv", "sedan", "hatchback", "coupe", "convertible", "truck", "van", "wagon", "hybrid-type", "electric-type", "sports-car", "luxury", "compact", "mid-size", "full-size" };
                var selectedCarType = carTypeOptions[random.Next(carTypeOptions.Length)];

                if (carTypeAttribute != null)
                {
                    _context.CarListingAttributes.Add(new CarListingAttribute
                    {
                        CarListingId = listing.Id,
                        CarAttributeId = carTypeAttribute.Id,
                        Value = selectedCarType
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        // Seed car options
        if (!_context.CarOptions.Any())
        {
            var carOptions = new List<CarOption>
            {
                // Sunroof
                new() { Name = "Sunroof", Slug = "sunroof", Type = Domain.Enums.CarOptionType.Boolean },

                // Audio System (parent)
                new() { Name = "Audio System", Slug = "audio-system", Type = Domain.Enums.CarOptionType.Title },

                // Android Auto (child of Audio System)
                new() { Name = "Android Auto", Slug = "android-auto", ParentId = 2, Type = Domain.Enums.CarOptionType.Boolean },

                // iOS CarPlay (child of Audio System)
                new() { Name = "iOS CarPlay", Slug = "ios-car-play", ParentId = 2, Type = Domain.Enums.CarOptionType.Boolean }
            };

            _context.CarOptions.AddRange(carOptions);
            await _context.SaveChangesAsync();
        }

        // Seed car listing options
        if (!_context.CarListingOptions.Any())
        {
            var carListings = _context.CarListings.ToList();
            var carOptions = _context.CarOptions.ToList();
            var random = new Random();

            foreach (var listing in carListings)
            {
                // Add sunroof option (30% chance)
                var sunroofOption = carOptions.FirstOrDefault(o => o.Slug == "sunroof");
                if (sunroofOption != null && random.Next(10) < 3)
                {
                    _context.CarListingOptions.Add(new CarListingOption
                    {
                        CarListingId = listing.Id,
                        CarOptionId = sunroofOption.Id,
                        Value = "true"
                    });
                }

                // Add audio system options (50% chance for audio system, and then random for its children)
                var audioSystemOption = carOptions.FirstOrDefault(o => o.Slug == "audio-system");
                var androidAutoOption = carOptions.FirstOrDefault(o => o.Slug == "android-auto");
                var iosCarplayOption = carOptions.FirstOrDefault(o => o.Slug == "ios-car-play");

                if (audioSystemOption != null && androidAutoOption != null && iosCarplayOption != null && random.Next(10) < 5)
                {
                    // Add Android Auto (40% chance if audio system is present)
                    if (random.Next(10) < 4)
                    {
                        _context.CarListingOptions.Add(new CarListingOption
                        {
                            CarListingId = listing.Id,
                            CarOptionId = androidAutoOption.Id,
                            Value = "true"
                        });
                    }

                    // Add iOS CarPlay (40% chance if audio system is present)
                    if (random.Next(10) < 4)
                    {
                        _context.CarListingOptions.Add(new CarListingOption
                        {
                            CarListingId = listing.Id,
                            CarOptionId = iosCarplayOption.Id,
                            Value = "true"
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
        }

        // Seed contact submissions
        if (!_context.ContactSubmissions.Any())
        {
            var contactSubmissions = new List<ContactSubmission>
            {
                new()
                {
                    FullName = "John Smith",
                    Email = "john.smith@email.com",
                    Message = "I'm interested in the Toyota Camry. Can you provide more details about the available models and pricing options?",
                    ExtraDetails = "Looking for a 2024 model with automatic transmission and preferably white color.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddDays(-5)
                },
                new()
                {
                    FullName = "Sarah Johnson",
                    Email = "sarah.johnson@email.com",
                    Message = "Hello, I'd like to schedule a test drive for the BMW X5. Please let me know what times are available this week.",
                    ExtraDetails = "Available on weekdays after 5 PM and weekends.",
                    Type = ContactSubmissionType.TestDrive,
                    IsProcessed = true,
                    ProcessedAt = DateTimeOffset.UtcNow.AddDays(-3),
                    ProcessedBy = "admin@localhost",
                    Created = DateTimeOffset.UtcNow.AddDays(-4)
                },
                new()
                {
                    FullName = "Michael Chen",
                    Email = "mchen@email.com",
                    Message = "Do you offer financing options for the Ford Mustang? I have good credit and would like to understand the loan terms.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = true,
                    ProcessedAt = DateTimeOffset.UtcNow.AddDays(-2),
                    ProcessedBy = "admin@localhost",
                    Created = DateTimeOffset.UtcNow.AddDays(-3)
                },
                new()
                {
                    FullName = "Emily Rodriguez",
                    Email = "emily.r@email.com",
                    Message = "I'm looking for a family-friendly SUV. What safety features come standard with the Toyota RAV4?",
                    ExtraDetails = "Have two young children, so child seat compatibility is important.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddDays(-2)
                },
                new()
                {
                    FullName = "David Thompson",
                    Email = "d.thompson@email.com",
                    Message = "Can you tell me more about your electric vehicle options? I'm particularly interested in charging infrastructure and battery warranties.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddDays(-1)
                },
                new()
                {
                    FullName = "Jessica Williams",
                    Email = "jwilliams@email.com",
                    Message = "I saw your online ad for the BMW 3 Series. Is this vehicle still available? I'd like to see it in person.",
                    ExtraDetails = "Prefer to visit on Saturday morning if possible.",
                    Type = ContactSubmissionType.TestDrive,
                    IsProcessed = true,
                    ProcessedAt = DateTimeOffset.UtcNow.AddDays(-1),
                    ProcessedBy = "admin@localhost",
                    Created = DateTimeOffset.UtcNow.AddDays(-1)
                },
                new()
                {
                    FullName = "Robert Martinez",
                    Email = "rmartinez@email.com",
                    Message = "Do you accept trade-ins? I currently have a 2019 Honda Accord that I'd like to trade in for a newer model.",
                    ExtraDetails = "My car has 45,000 miles and is in excellent condition.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddHours(-12)
                },
                new()
                {
                    FullName = "Amanda Foster",
                    Email = "afoster@email.com",
                    Message = "What is your return policy if I'm not satisfied with my purchase? I want to make sure I have the option to return within a reasonable timeframe.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddHours(-8)
                },
                new()
                {
                    FullName = "Christopher Lee",
                    Email = "chris.lee@email.com",
                    Message = "I'm interested in the Ford F-150. Do you have any models with the towing package? I need it for my boat.",
                    ExtraDetails = "Looking for a crew cab with 4WD.",
                    Type = ContactSubmissionType.TestDrive,
                    IsProcessed = true,
                    ProcessedAt = DateTimeOffset.UtcNow.AddHours(-6),
                    ProcessedBy = "admin@localhost",
                    Created = DateTimeOffset.UtcNow.AddHours(-10)
                },
                new()
                {
                    FullName = "Nicole Brown",
                    Email = "nbrown@email.com",
                    Message = "Are there any current promotions or discounts available on the Toyota Corolla? I'm a first-time car buyer.",
                    ExtraDetails = "Student looking for a reliable commuter vehicle.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddHours(-4)
                },
                new()
                {
                    FullName = "Daniel Wilson",
                    Email = "dwilson@email.com",
                    Message = "I need a vehicle with good fuel economy for my daily commute. What would you recommend between the Camry and Corolla?",
                    ExtraDetails = "Commute is about 50 miles round trip, mostly highway driving.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddHours(-3)
                },
                new()
                {
                    FullName = "Michelle Taylor",
                    Email = "mtaylor@email.com",
                    Message = "Do you offer extended warranty options beyond the manufacturer's warranty? What does the coverage include?",
                    ExtraDetails = "Interested in comprehensive coverage for powertrain and electronics.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddHours(-2)
                },
                new()
                {
                    FullName = "James Anderson",
                    Email = "janderson@email.com",
                    Message = "I have a budget of around $30,000. What are my best options in your current inventory?",
                    ExtraDetails = "Prefer newer models with low mileage and good safety ratings.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddHours(-1)
                },
                new()
                {
                    FullName = "Laura Garcia",
                    Email = "lgarcia@email.com",
                    Message = "Can you provide a detailed vehicle history report for the BMW 5 Series? I want to make sure it hasn't been in any accidents.",
                    ExtraDetails = "Willing to pay for CarFax or similar report.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = true,
                    ProcessedAt = DateTimeOffset.UtcNow.AddMinutes(-30),
                    ProcessedBy = "admin@localhost",
                    Created = DateTimeOffset.UtcNow.AddMinutes(-45)
                },
                new()
                {
                    FullName = "Matthew Davis",
                    Email = "mdavis@email.com",
                    Message = "I'm ready to make a purchase. What documents do I need to bring with me to complete the transaction?",
                    ExtraDetails = "Have pre-approved loan from my bank. Need to know about insurance requirements.",
                    Type = ContactSubmissionType.Message,
                    IsProcessed = false,
                    Created = DateTimeOffset.UtcNow.AddMinutes(-15)
                }
            };

            _context.ContactSubmissions.AddRange(contactSubmissions);
            await _context.SaveChangesAsync();
        }
    }
}
