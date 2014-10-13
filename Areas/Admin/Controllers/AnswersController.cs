using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Quizzical;
using Quizzical.Models;

namespace Quizzical.Areas.Admin.Controllers
{
    public class AnswersController : Controller
    {
        private QuizzicalContext db = new QuizzicalContext();

        // GET: Admin/Answers
        public async Task<ActionResult> Index()
        {
            var answers = db.Answers.Include(a => a.Question).Include(a => a.QuestionOption).Include(a => a.Session);
            return View(await answers.ToListAsync());
        }

        // GET: Admin/Answers/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Answer answer = await db.Answers.FindAsync(id);
            if (answer == null)
            {
                return HttpNotFound();
            }
            return View(answer);
        }

        // GET: Admin/Answers/Create
        public ActionResult Create()
        {
            ViewBag.QuestionId = new SelectList(db.Questions, "Id", "Description");
            ViewBag.QuestionOptionId = new SelectList(db.QuestionOptions, "Id", "Description");
            ViewBag.SessionId = new SelectList(db.QuizSessions, "Id", "Id");
            ViewBag.UserId = new SelectList(db.Users, "Id", "Name");
            return View();
        }

        // POST: Admin/Answers/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,QuestionId,QuestionOptionId,SessionId,UserId")] Answer answer)
        {
            if (ModelState.IsValid)
            {
                db.Answers.Add(answer);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.QuestionId = new SelectList(db.Questions, "Id", "Description", answer.QuestionId);
            ViewBag.QuestionOptionId = new SelectList(db.QuestionOptions, "Id", "Description", answer.QuestionOptionId);
            ViewBag.SessionId = new SelectList(db.QuizSessions, "Id", "Id", answer.SessionId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Name", answer.UserId);
            return View(answer);
        }

        // GET: Admin/Answers/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Answer answer = await db.Answers.FindAsync(id);
            if (answer == null)
            {
                return HttpNotFound();
            }
            ViewBag.QuestionId = new SelectList(db.Questions, "Id", "Description", answer.QuestionId);
            ViewBag.QuestionOptionId = new SelectList(db.QuestionOptions, "Id", "Description", answer.QuestionOptionId);
            ViewBag.SessionId = new SelectList(db.QuizSessions, "Id", "Id", answer.SessionId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Name", answer.UserId);
            return View(answer);
        }

        // POST: Admin/Answers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,QuestionId,QuestionOptionId,SessionId,UserId")] Answer answer)
        {
            if (ModelState.IsValid)
            {
                db.Entry(answer).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.QuestionId = new SelectList(db.Questions, "Id", "Description", answer.QuestionId);
            ViewBag.QuestionOptionId = new SelectList(db.QuestionOptions, "Id", "Description", answer.QuestionOptionId);
            ViewBag.SessionId = new SelectList(db.QuizSessions, "Id", "Id", answer.SessionId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Name", answer.UserId);
            return View(answer);
        }

        // GET: Admin/Answers/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Answer answer = await db.Answers.FindAsync(id);
            if (answer == null)
            {
                return HttpNotFound();
            }
            return View(answer);
        }

        // POST: Admin/Answers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            Answer answer = await db.Answers.FindAsync(id);
            db.Answers.Remove(answer);
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
