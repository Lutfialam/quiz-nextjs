import QuestionType from './question';
import QuizType from './quiz';
import UserType from './user';

interface HistoryType {
  id?: number;
  time?: number;
  score?: number;
  user?: UserType;
  quiz?: QuizType;
  created_at?: string;
  updated_at?: string;
}

export interface CreateHistoryType {
  time: number;
  quiz_id: number;
  questions: QuestionType[];
}

export default HistoryType;
