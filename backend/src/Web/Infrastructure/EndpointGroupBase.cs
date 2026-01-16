namespace MyApp.Web.Infrastructure;

public abstract class EndpointGroupBase
{
    public virtual string? GroupName { get; }
    public virtual string? Scope { get; }
    public abstract void Map(RouteGroupBuilder groupBuilder);
}
