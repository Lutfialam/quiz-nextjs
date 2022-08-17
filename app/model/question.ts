interface QuestionType {
  id?: number;
  index?: number;
  quiz_id?: number;
  question?: string;
  answer?: string;
  first_choice?: string;
  second_choice?: string;
  third_choice?: string;
  fourth_choice?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionTypeError {
  id?: number;
  index?: number;
  question?: string;
  answer?: string;
  first_choice?: string;
  second_choice?: string;
  third_choice?: string;
  fourth_choice?: string;
}

export default QuestionType;
