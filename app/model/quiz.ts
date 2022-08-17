import QuestionType, { QuestionTypeError } from '@/model/question';
import CategoryType from './category';

interface QuizType {
  id?: number;
  name?: string;
  time?: number;
  image?: File | string;
  questions?: QuestionType[];
  categories?: CategoryType;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizFormType {
  id?: number;
  name: string;
  time: number;
  category_id: number;
  image?: File | string;
  questions: QuestionType[];
  description?: string;
}

export interface QuizTypeError {
  name?: string;
  time?: string;
  image?: string;
  category?: string;
  questions?: QuestionTypeError[];
  description?: string;
}

export default QuizType;
