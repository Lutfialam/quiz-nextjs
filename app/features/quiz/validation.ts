import QuestionType, { QuestionTypeError } from '@/model/question';
import { QuizFormType, QuizTypeError } from '@/model/quiz';

const isNotEmpty = (value?: string) => {
  return value && value.length > 0;
};

export const quizCreateValidation = (
  quiz: QuizFormType,
  quizError: QuizTypeError
) => {
  let isValidated = true;
  let newError: QuizTypeError = {};

  if (!isNotEmpty(quiz.name)) {
    isValidated = false;
    newError = { ...newError, name: 'Name is required' };
  }
  if (!isNotEmpty(quiz.description)) {
    isValidated = false;
    newError = { ...newError, description: 'Description is required' };
  }
  if (quiz.category_id === 0) {
    isValidated = false;
    newError = { ...newError, category: 'Category is required' };
  }

  let questions = quizError.questions ?? [];
  quiz.questions?.map((item, index) => {
    const list = [
      'question',
      'first_choice',
      'second_choice',
      'third_choice',
      'fourth_choice',
    ] as const;

    list.map((key) => {
      if (!isNotEmpty(item[key])) {
        isValidated = false;

        questions[index] = {
          ...questions[index],
          [key]: `${key} cannot be null`,
        };
      }
    });
  });

  return { isValidated, error: { ...newError, questions } };
};

export const quizStartValidation = (question: QuestionType[]) => {
  let isValid = question.length > 0;
  let newError: QuestionTypeError[] = [];

  question.map((item, index) => {
    if (!isNotEmpty(item.answer)) {
      isValid = false;
      newError.push({
        id: item.id,
        answer: `Select an answer`,
      });
    }
  });

  return { isValid, error: newError };
};
