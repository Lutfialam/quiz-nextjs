import QuestionType, {
  EditQuestionType,
  QuestionTypeError,
} from '@/model/question';
import CategoryType from './category';

interface BaseQuiz {
  id?: number;
  name?: string;
  time?: number;
  image?: File | string;
  description?: string;
}

interface QuizType extends BaseQuiz {
  questions?: QuestionType[];
  categories?: CategoryType;
  created_at?: string;
  updated_at?: string;
}

export interface CreateQuizType extends BaseQuiz {
  category_id: number;
  questions: QuestionType[];
}

export interface EditQuizType extends BaseQuiz {
  delete?: boolean;
  description?: string;
  category_id: number;
  questions: EditQuestionType[];
}

export interface QuizTypeError {
  name?: string;
  time?: string;
  image?: string;
  category?: string;
  description?: string;
  questions?: QuestionTypeError[];
}

export default QuizType;
