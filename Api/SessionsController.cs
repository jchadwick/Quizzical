using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Quizzical.Models;

namespace Quizzical.Api
{
    public class SessionsController : ApiController
    {
        private QuizzicalContext db = new QuizzicalContext();

        [HttpGet]
        [Route("api/sessions/simulate")]
        public async Task<IHttpActionResult> Simulate()
        {
            return Ok();
        }

        [Route("api/sessions")]
        [Route("api/sessions/available")]
        public IQueryable<QuizSession> GetQuizSessions()
        {
            return db.QuizSessions;
        }

        // GET: api/QuizSessions/5
        [ResponseType(typeof(QuizSession))]
        public async Task<IHttpActionResult> GetQuizSession(long id)
        {
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            if (quizSession == null)
            {
                return NotFound();
            }

            return Ok(quizSession);
        }

        // PUT: api/QuizSessions/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutQuizSession(long id, QuizSession quizSession)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quizSession.Id)
            {
                return BadRequest();
            }

            db.Entry(quizSession).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizSessionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/QuizSessions
        [ResponseType(typeof(QuizSession))]
        public async Task<IHttpActionResult> PostQuizSession(QuizSession quizSession)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.QuizSessions.Add(quizSession);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = quizSession.Id }, quizSession);
        }

        // DELETE: api/QuizSessions/5
        [ResponseType(typeof(QuizSession))]
        public async Task<IHttpActionResult> DeleteQuizSession(long id)
        {
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            if (quizSession == null)
            {
                return NotFound();
            }

            db.QuizSessions.Remove(quizSession);
            await db.SaveChangesAsync();

            return Ok(quizSession);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QuizSessionExists(long id)
        {
            return db.QuizSessions.Count(e => e.Id == id) > 0;
        }
    }
}