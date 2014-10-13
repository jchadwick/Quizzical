using System;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Quizzical.Models
{
    public class QuizzicalContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public QuizzicalContext() : base("name=QuizzicalContext")
        {
            Database.SetInitializer(new Initializer());
        }

        public DbSet<QuizSession> QuizSessions { get; set; }

        public DbSet<Question> Questions { get; set; }

        public DbSet<Quiz> Quizzes { get; set; }


        class Initializer : DropCreateDatabaseAlways<QuizzicalContext>
        {
            protected override void Seed(QuizzicalContext context)
            {
                base.Seed(context);

                var quiz = new Quiz { Name = "The JavaScript Interview Quiz" };
                context.Quizzes.Add(quiz);

                var trueOption = new QuestionOption {Description = "True"};
                var falseOption = new QuestionOption { Description = "False" };
                context.QuestionOptions.Add(trueOption);
                context.QuestionOptions.Add(falseOption);

                var question1 = new Question
                {
                    Description = "What is the best language for coding the web?",
                    QuestionType = QuestionType.MultipleChoice,
                };
                question1.Options.Add(new QuestionOption { Description = "JavaScript"});
                question1.Options.Add(new QuestionOption { Description = "C#"});
                question1.Options.Add(new QuestionOption { Description = "Ruby"});
                question1.Options.Add(new QuestionOption { Description = "PHP"});
                quiz.Questions.Add(question1);

                var question2 = new Question
                {
                    Description = "JavaScript is basically the best language ever.",
                    QuestionType = QuestionType.TrueFalse,
                };
                question2.Options.Add(trueOption);
                question2.Options.Add(falseOption);
                quiz.Questions.Add(question2);

                var session = new QuizSession {Quiz = quiz};
                context.QuizSessions.Add(session);

                context.SaveChanges();
            }
        }

        public DbSet<Answer> Answers { get; set; }

        public DbSet<QuestionOption> QuestionOptions { get; set; }

        public System.Data.Entity.DbSet<Quizzical.User> Users { get; set; }
    }


    public static class QuizzicalContextExtensions
    {
        public static Task<Answer> FindAnswerAsync(this DbSet<Answer> answers, 
                                              long questionId, long sessionId, string userId)
        {
            return
                answers.FirstOrDefaultAsync(
                    x => x.QuestionId == questionId && x.SessionId == sessionId && x.UserId == userId);
        }

        public static async Task<AnswersSummary> GetSummaryAsync(this DbSet<Answer> answers, 
                                              long questionId, long sessionId)
        {
            var filtered = answers.Where(x => x.QuestionId == questionId && x.SessionId == sessionId);
            double totalCount = filtered.Count();

            var summaries =
                from answer in filtered
                group answer by answer.QuestionOptionId into grouped
                let count = grouped.Count()
                let percentage = Math.Floor((count / totalCount) * 100)
                select new AnswerSummary
                {
                    QuestionOptionId = grouped.Key,
                    Count = count,
                    Percentage = (int)percentage
                };

            long quizId = await filtered.Select(x => x.Session.QuizId).FirstAsync();

            return new AnswersSummary
            {
                QuizId = quizId,
                QuestionId = questionId,
                SessionId = sessionId,
                Answers = await summaries.ToArrayAsync(),
            };
        }
    }

}
