import CategoryType from '@/model/category';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import QuizType, { EditQuizType, QuizTypeError } from '@/model/quiz';
import QuestionType, { QuestionTypeError } from '@/model/question';

interface CategoryValue {
  id: number;
  value: string;
}

interface QuizEdit {
  quiz: EditQuizType;
  quizError: QuizTypeError;
  deletedQuestion: number[];

  category: CategoryValue[];
  selectedCategory: CategoryValue;
}

const initialState: QuizEdit = {
  quiz: {} as EditQuizType,
  quizError: {} as QuizTypeError,
  deletedQuestion: [],

  category: [] as CategoryValue[],
  selectedCategory: {} as CategoryValue,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizEdit(state, action: PayloadAction<QuizType>) {
      const quiz = action.payload;
      const quest: QuestionType[] = [];
      const questError: QuestionTypeError[] = [];

      quiz.questions?.map((item: QuestionType, idx: number) => {
        quest.push({
          index: idx,
          id: item.id,
          answer: item.answer,
          question: item.question,
          first_choice: item.first_choice,
          second_choice: item.second_choice,
          third_choice: item.third_choice,
          fourth_choice: item.fourth_choice,
        });
        questError.push({
          index: idx,
          id: item.id,
          answer: '',
          question: '',
          first_choice: '',
          second_choice: '',
          third_choice: '',
          fourth_choice: '',
        });
      });

      return {
        ...state,
        quiz: {
          id: quiz.id,
          name: quiz.name,
          time: quiz.time,
          description: quiz.description,
          image:
            quiz.image != 'default.png'
              ? `${process.env.NEXT_PUBLIC_API_URL}/images/${quiz.image}`
              : undefined,
          category_id: quiz.categories?.id ?? 0,
          questions: quest,
        },
        quizError: {
          name: '',
          time: '',
          image: '',
          category: '',
          description: '',
          questions: questError,
        },
      };
    },

    setQuiz(state, action: PayloadAction<EditQuizType>) {
      return { ...state, quiz: action.payload };
    },

    setQuizError(state, action: PayloadAction<QuizTypeError>) {
      return { ...state, quizError: action.payload };
    },

    setQuestion(state, action: PayloadAction<QuestionType[]>) {
      return { ...state, quiz: { ...state.quiz, questions: action.payload } };
    },

    addQuestion(state) {
      const index = state.quiz.questions.length;
      const question = {
        index,
        answer: '',
        question: '',
        first_choice: '',
        second_choice: '',
        third_choice: '',
        fourth_choice: '',
      };

      return {
        ...state,
        quiz: {
          ...state.quiz,
          questions: [
            ...(state.quiz.questions ?? []),
            { ...question, answer: 'A' },
          ],
        },
        quizError: {
          ...state.quizError,
          questions: [...(state.quizError.questions ?? []), { ...question }],
        },
      };
    },

    addDeletedQuestion(state, action: PayloadAction<number>) {
      return {
        ...state,
        deletedQuestion: [...state.deletedQuestion, action.payload],
      };
    },

    setCategory(state, action: PayloadAction<CategoryType[]>) {
      const categoryList: CategoryValue[] = action.payload.map(
        (item: CategoryType) => {
          return {
            id: item.id as number,
            value: item.name as string,
          };
        }
      );
      return {
        ...state,
        category: categoryList,
      };
    },

    setSelectedCategory(state, action: PayloadAction<CategoryValue>) {
      return {
        ...state,
        selectedCategory: action.payload,
      };
    },

    removeQuestion(state, action: PayloadAction<number>) {
      const index = action.payload;
      const selectedQuestion = state.quiz.questions.filter(
        (item) => item.index === index
      );

      let newDeleted = state.deletedQuestion;
      if (selectedQuestion.length > 0 && selectedQuestion[0].id) {
        newDeleted = [...newDeleted, selectedQuestion[0].id];
      }

      const newQuestion = state.quiz.questions.filter(
        (item) => item.index !== index
      );
      const newQuestionError = state.quizError.questions?.filter(
        (item) => item.index !== index
      );

      return {
        ...state,
        deletedQuestion: newDeleted,
        quiz: { ...state.quiz, questions: newQuestion },
        quizError: { ...state.quizError, questions: newQuestionError },
      };
    },

    resetQuizEdit(state) {
      return initialState;
    },
  },
});

export const {
  setQuiz,
  setQuizEdit,
  setQuizError,
  addQuestion,
  addDeletedQuestion,
  setCategory,
  setSelectedCategory,
  removeQuestion,
  resetQuizEdit,
} = quizSlice.actions;

export default quizSlice.reducer;
