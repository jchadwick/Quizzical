using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Quizzical.Controllers;
using Quizzical.Models;

namespace Quizzical.Api
{
    [RoutePrefix("api/sessions/{sessionId}/questions/{questionId}")]
    public class AnswersController : ApiController
    {
        private QuizzicalContext db = new QuizzicalContext();

        protected string UserId
        {
            get { return userId ?? System.Guid.NewGuid().ToString("N") ?? User.Identity.Name; }
            set { userId = value; }
        }
        private string userId;

        [Route("answers")]
        public IQueryable<Answer> GetAnswers()
        {
            return db.Answers;
        }

        [Route("answer")]
        [ResponseType(typeof(Answer))]
        public async Task<IHttpActionResult> GetAnswer(long sessionId, long questionId)
        {
            var answer = await db.Answers.FindAnswerAsync(questionId, sessionId, UserId);
            if (answer == null)
            {
                return NotFound();
            }

            return Ok(answer);
        }

        [Route("answers/summary")]
        [ResponseType(typeof(AnswersSummary))]
        public async Task<IHttpActionResult> GetSummary(long sessionId, long questionId)
        {
            var answer = await db.Answers.GetSummaryAsync(questionId, sessionId);
            if (answer == null)
            {
                return NotFound();
            }

            answer.QuizId = db.QuizSessions.Find(sessionId).QuizId;

            return Ok(answer);
        }


        [Route("answer")]
        [ResponseType(typeof(Answer))]
        public async Task<IHttpActionResult> PostAnswer(long questionId, long sessionId, Answer answer)
        {
            var existing = await db.Answers.FindAnswerAsync(questionId, sessionId, UserId);
            
            if (existing == null)
            {
                answer.UserId = UserId;
                db.Answers.Add(answer);
            }
            else
            {
                existing.QuestionOptionId = answer.QuestionOptionId;
            }

            await db.SaveChangesAsync();

            var summary = await db.Answers.GetSummaryAsync(questionId, sessionId);
            QuizSessionHub.UpdateQuestionSummary(summary);

            return Ok(existing);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}