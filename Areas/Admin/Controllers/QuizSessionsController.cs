using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
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
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,QuizId,CurrentQuestionId")] QuizSession quizSession)
        {
            if (ModelState.IsValid)
            {
                db.Entry(quizSession).State = EntityState.Modified;
                await db.SaveChangesAsync();
                
                var currentQuestionId = quizSession.CurrentQuestionId;
                if(currentQuestionId != null)
                    QuizSessionHub.UpdateCurrentQuestion(quizSession.Id, currentQuestionId.GetValueOrDefault());
                
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
