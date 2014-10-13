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
    [RoutePrefix("api/quizzes/{quizId}/questions")]
    public class QuestionsController : ApiController
    {
        private QuizzicalContext db = new QuizzicalContext();

        // GET: api/Questions
        [Route("")]
        public IQueryable<Question> GetQuestions(long quizId)
        {
            return db.Questions;
        }

        // GET: api/Questions/5
        [Route("{questionId}")]
        [ResponseType(typeof(Question))]
        public async Task<IHttpActionResult> GetQuestion(long quizId, long questionId)
        {
            var questions = db.Quizzes.Where(x => x.Id == quizId).SelectMany(x => x.Questions);
            var question = await questions.FirstOrDefaultAsync(x => x.Id == questionId);

            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        // PUT: api/Questions/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutQuestion(long quizId, long id, Question question)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != question.Id)
            {
                return BadRequest();
            }

            db.Entry(question).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
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

        // POST: api/Questions
        [ResponseType(typeof(Question))]
        public async Task<IHttpActionResult> PostQuestion(long quizId, Question question)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Questions.Add(question);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = question.Id }, question);
        }

        // DELETE: api/Questions/5
        [ResponseType(typeof(Question))]
        public async Task<IHttpActionResult> DeleteQuestion(long quizId, long id)
        {
            Question question = await db.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            db.Questions.Remove(question);
            await db.SaveChangesAsync();

            return Ok(question);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QuestionExists(long id)
        {
            return db.Questions.Count(e => e.Id == id) > 0;
        }
    }
}