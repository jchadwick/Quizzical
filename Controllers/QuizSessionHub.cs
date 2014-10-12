using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace Quizzical.Controllers
{
    public class QuizSessionHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();
        private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, string>> SessionConnections = new ConcurrentDictionary<string, ConcurrentDictionary<string, string>>();

        public async Task<IEnumerable<dynamic>> GetConnectedUsers()
        {
            return await GetConnectedUsers(null);
        }

        public async Task<IEnumerable<dynamic>> GetConnectedUsers(int? sessionId)
        {
            var connectionIds = 
                (sessionId > 0)
                    ? ConnectedUsers.Keys 
                    : SessionConnections[sessionId.ToString()].Keys;

            dynamic[] users = connectionIds.Select(MapToUser).ToArray();

            return users;
        }

        public void JoinSession(long sessionId)
        {
            Groups.Add(Context.ConnectionId, sessionId.ToString());

            if(!SessionConnections.ContainsKey(sessionId.ToString()))
                SessionConnections[sessionId.ToString()] = new ConcurrentDictionary<string, string>();

            var connections = SessionConnections[sessionId.ToString()];
            connections.AddOrUpdate(sessionId.ToString(), string.Empty, (s, s1) => string.Empty);
        }

        public void LeaveSession(long sessionId)
        {
            Groups.Remove(Context.ConnectionId, sessionId.ToString());

            var connections = SessionConnections[sessionId.ToString()];
            string x;
            connections.TryRemove(sessionId.ToString(), out x);
        }

        public override Task OnConnected()
        {
            RegisterConnectedUser();
            JoinSession(1);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var connectionId = Context.ConnectionId;

            if (ConnectedUsers.ContainsKey(connectionId))
            {
                string x;
                ConnectedUsers.TryRemove(connectionId, out x);
                Clients.Others.onUserDisconnected(connectionId);
            }

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            RegisterConnectedUser();
            return base.OnReconnected();
        }

        private void RegisterConnectedUser()
        {
            var connectionId = Context.ConnectionId;

            if (!ConnectedUsers.ContainsKey(connectionId))
            {
                ConnectedUsers.TryAdd(connectionId, Context.User.Identity.Name);
                Clients.All.onUserConnected(MapToUser(connectionId));
            }
        }

        private dynamic MapToUser(string connectionId)
        {
            var user = new
            {
                ConnectionId = connectionId, 
                DisplayName = ConnectedUsers[connectionId],
            };
            return user;
        }


        public static void UpdateCurrentQuestion(long sessionId, long questionId)
        {
            SessionClients(sessionId).onQuestionChanged(questionId);
        }

        private static dynamic SessionClients(long sessionId)
        {
            return GlobalHost.ConnectionManager.GetHubContext<QuizSessionHub>().Clients.Group(sessionId.ToString());
        }
    }
}