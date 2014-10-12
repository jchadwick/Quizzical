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
    public class QuestionOptionsController : Controller
    {
        private QuizzicalContext db = new QuizzicalContext();

        // GET: Admin/QuestionOptions
        public async Task<ActionResult> Index()
        {
            return View(await db.QuestionOptions.ToListAsync());
        }

        // GET: Admin/QuestionOptions/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            QuestionOption questionOption = await db.QuestionOptions.FindAsync(id);
            if (questionOption == null)
            {
                return HttpNotFound();
            }
            return View(questionOption);
        }

        // GET: Admin/QuestionOptions/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/QuestionOptions/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Description")] QuestionOption questionOption)
        {
            if (ModelState.IsValid)
            {
                db.QuestionOptions.Add(questionOption);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(questionOption);
        }

        // GET: Admin/QuestionOptions/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            QuestionOption questionOption = await db.QuestionOptions.FindAsync(id);
            if (questionOption == null)
            {
                return HttpNotFound();
            }
            return View(questionOption);
        }

        // POST: Admin/QuestionOptions/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Description")] QuestionOption questionOption)
        {
            if (ModelState.IsValid)
            {
                db.Entry(questionOption).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(questionOption);
        }

        // GET: Admin/QuestionOptions/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            QuestionOption questionOption = await db.QuestionOptions.FindAsync(id);
            if (questionOption == null)
            {
                return HttpNotFound();
            }
            return View(questionOption);
        }

        // POST: Admin/QuestionOptions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            QuestionOption questionOption = await db.QuestionOptions.FindAsync(id);
            db.QuestionOptions.Remove(questionOption);
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
