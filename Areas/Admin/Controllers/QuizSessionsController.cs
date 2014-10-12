using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web.Http.Results;
using System.Web.Mvc;
using Quizzical.Controllers;
using Quizzical.Models;

namespace Quizzical.Areas.Admin.Controllers
{
    public class QuizSessionsController : Controller
    {
        private QuizzicalContext db = new QuizzicalContext();

        // GET: Admin/QuizSessions
        public async Task<ActionResult> Index()
        {
            var quizSessions = db.QuizSessions.Include(q => q.Quiz);
            return View(await quizSessions.ToListAsync());
        }

        public async Task<ActionResult> Panel(long id)
        {
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            if (quizSession == null)
            {
                return HttpNotFound();
            }
            return PartialView(quizSession);
        }

        public enum QuestionDirection
        {
            Unknown = 0,
            Next = 1,
            Prev = 2,
        }

        public async Task<ActionResult> ChangeQuestion(long id, string val)
        {
            long? newQuestionId = null;

            long tmp;
            if (long.TryParse(val, out tmp)) newQuestionId = tmp;

            QuestionDirection direction;
            Enum.TryParse(val, true, out direction);

            if (direction == QuestionDirection.Unknown && newQuestionId == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid parameter: val");

            var session = await db.QuizSessions.SingleOrDefaultAsync(x => x.Id == id);

            if (session == null)
            {
                return HttpNotFound();
            }

            if (newQuestionId == null)
            {
                var questionIds = session.Quiz.Questions.Select(x => x.Id).ToArray();
                var currentQuestionId = questionIds.FirstOrDefault(questionId => questionId == session.CurrentQuestionId);

                long? prevQuestionId = null;
                bool selectNextQuestion = false;

                foreach (var questionId in questionIds)
                {
                    if (selectNextQuestion)
                    {
                        newQuestionId = questionId;
                        selectNextQuestion = false;
                        break;
                    }

                    if (questionId == currentQuestionId)
                    {
                        switch (direction)
                        {
                            case QuestionDirection.Next:
                                selectNextQuestion = true;
                                break;
                            case QuestionDirection.Prev:
                                newQuestionId = prevQuestionId;
                                break;
                            default:
                                Console.Error.WriteLine("Invalid question direction");
                                break;
                        }
                    }

                    prevQuestionId = questionId;
                }

                if (newQuestionId == null && !selectNextQuestion)
                    newQuestionId = questionIds.FirstOrDefault();
            }
            
            if (newQuestionId != session.CurrentQuestionId)
            {
                session.CurrentQuestionId = newQuestionId;
                await db.SaveChangesAsync();
                QuizSessionHub.UpdateCurrentQuestion(session.Id, session.CurrentQuestionId.GetValueOrDefault());

                return new HttpStatusCodeResult(HttpStatusCode.OK, "Current Question ID changed");
            }

            return new HttpStatusCodeResult(HttpStatusCode.NotModified, "Current Question ID was not changed");
        }

        // GET: Admin/QuizSessions/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            if (quizSession == null)
            {
                return HttpNotFound();
            }
            return View(quizSession);
        }

        // GET: Admin/QuizSessions/Create
        public ActionResult Create()
        {
            ViewBag.QuizId = new SelectList(db.Quizzes, "Id", "Name");
            return View();
        }

        // POST: Admin/QuizSessions/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,QuizId,CurrentQuestionId")] QuizSession quizSession)
        {
            if (ModelState.IsValid)
            {
                db.QuizSessions.Add(quizSession);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.QuizId = new SelectList(db.Quizzes, "Id", "Name", quizSession.QuizId);
            return View(quizSession);
        }

        // GET: Admin/QuizSessions/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            if (quizSession == null)
            {
                return HttpNotFound();
            }
            ViewBag.QuizId = new SelectList(db.Quizzes, "Id", "Name", quizSession.QuizId);
            return View(quizSession);
        }

        // POST: Admin/QuizSessions/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit([Bind(Include = "Id,QuizId,CurrentQuestionId")] QuizSession quizSession)
        {
            if (ModelState.IsValid)
            {
                db.Entry(quizSession).State = EntityState.Modified;
                await db.SaveChangesAsync();

                if (quizSession.CurrentQuestionId != null)
                    QuizSessionHub.UpdateCurrentQuestion(quizSession.Id, quizSession.CurrentQuestionId.GetValueOrDefault());

                return RedirectToAction("Index");
            }
            ViewBag.QuizId = new SelectList(db.Quizzes, "Id", "Name", quizSession.QuizId);
            return View(quizSession);
        }

        // GET: Admin/QuizSessions/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            if (quizSession == null)
            {
                return HttpNotFound();
            }
            return View(quizSession);
        }

        // POST: Admin/QuizSessions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            QuizSession quizSession = await db.QuizSessions.FindAsync(id);
            db.QuizSessions.Remove(quizSession);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
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
