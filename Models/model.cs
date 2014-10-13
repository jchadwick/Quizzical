using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Quizzical {

    public class User {
        [Required]
        public string Id { get; set; }
        
        [Required]
        public string Name { get; set; }

        [Required]
        public string DisplayName { get; set; }
	}

	public class Quiz {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }
		
        public virtual ICollection<Question> Questions { get; private set; }

	    public Quiz()
	    {
	        Questions = new Collection<Question>();
	    }
	}

	public class Question {
        public long Id { get; set; }

        [Required]
        public string Description { get; set; }
        
        public string ExtendedDescription { get; set; }

        [Required]
        public QuestionType QuestionType { get; set; }

        public virtual ICollection<QuestionOption> Options { get; private set; }

	    public Question()
	    {
	        Options = new Collection<QuestionOption>();
	    }
	}

    public enum QuestionType {
		Unknown,
		TrueFalse,
		MultipleChoice,
		OpenEnded
	}

	public class QuestionOption {
        public long Id { get; set; }

        [Required]
        public string Description { get; set; }
	}

	public class Answer {
        public long Id { get; set; }
       
        public long QuestionId { get; set; }
        public virtual Question Question { get; set; }

        public long QuestionOptionId { get; set; }
        public virtual QuestionOption QuestionOption { get; set; }

        public long SessionId { get; set; }
        public virtual QuizSession Session { get; set; }

	    public string UserId { get; set; }
	}

    public class AnswersSummary {
        [JsonProperty("questionId")]
        public long QuestionId { get; set; }
        [JsonProperty("quizId")]
        public long QuizId { get; set; }
        [JsonProperty("sessionId")]
        public long SessionId { get; set; }
        [JsonProperty("answers")]
        public IEnumerable<AnswerSummary> Answers { get; set; }
    }

    public class AnswerSummary {
        [JsonProperty("questionOptionId")]
        public long QuestionOptionId { get; set; }
        [JsonProperty("count")]
        public int Count { get; set; }
        [JsonProperty("percentage")]
        public int Percentage { get; set; }
    }

	public class QuizSession {
        public long Id { get; set; }
        public long QuizId { get; set; }
        public virtual Quiz Quiz { get; set; }

        public long? CurrentQuestionId { get; set; }
	}
}
