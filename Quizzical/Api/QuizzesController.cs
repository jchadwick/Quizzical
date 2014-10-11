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
    public class QuizzesController : ApiController
    {
        private QuizzicalContext db = new QuizzicalContext();

        // GET: api/Quizzes
        public IQueryable<Quiz> GetQuizs()
        {
            return db.Quizzes;
        }

        // GET: api/Quizzes/5
        [ResponseType(typeof(Quiz))]
        public async Task<IHttpActionResult> GetQuiz(long id)
        {
            Quiz quiz = await db.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        // PUT: api/Quizzes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutQuiz(long id, Quiz quiz)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quiz.Id)
            {
                return BadRequest();
            }

            db.Entry(quiz).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizExists(id))
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

        // POST: api/Quizzes
        [ResponseType(typeof(Quiz))]
        public async Task<IHttpActionResult> PostQuiz(Quiz quiz)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Quizzes.Add(quiz);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = quiz.Id }, quiz);
        }

        // DELETE: api/Quizzes/5
        [ResponseType(typeof(Quiz))]
        public async Task<IHttpActionResult> DeleteQuiz(long id)
        {
            Quiz quiz = await db.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            db.Quizzes.Remove(quiz);
            await db.SaveChangesAsync();

            return Ok(quiz);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QuizExists(long id)
        {
            return db.Quizzes.Count(e => e.Id == id) > 0;
        }
    }
}