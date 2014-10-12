using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Quizzical.Startup))]

namespace Quizzical
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
