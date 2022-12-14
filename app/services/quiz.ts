import QuizType, { CreateQuizType, EditQuizType } from '@/model/quiz';
import instance from '@/services/instance';

export const getQuiz = async (search?: string, page?: number) => {
  const s = search && search.length > 0 ? `&search=${search}` : '';
  const url = `/api/quiz?page=${page ?? 1}${s}`;

  const { data } = await instance.get(url);
  return data;
};

export const getSearchableQuiz = async (search: string, page?: number) => {
  const url = `/api/quiz?search=${search}&page=${page ?? 1}`;
  const { data } = await instance.get(url);
  return data;
};

export const getQuizById = async (id: number) => {
  const { data } = await instance.get(`/api/quiz/${id}`);
  return data;
};

export const getHiddenAnswerQuizList = async (page?: number) => {
  const url = '/api/quiz-list-hidden-answer';
  const { data } = await instance.get(`${url}?page=${page ?? 1}`);
  return data;
};

export const getHiddenAnswerQuiz = async (quiz_id: number) => {
  const url = '/api/quiz-hidden-answer?quiz_id=' + quiz_id;
  const { data } = await instance.get(url);
  return data;
};

const toFormData = (quiz: CreateQuizType) => {
  const { name, time, description, image, questions } = quiz;

  const form = new FormData();
  form.append('name', name as string);
  form.append('time', (time as number).toString());
  form.append('questions', JSON.stringify(questions));
  form.append('category_id', quiz.category_id.toString());

  image && typeof image != 'string' && form.append('image', image);
  description && form.append('description', description);

  return form;
};

export const addQuiz = async (quiz: CreateQuizType) => {
  const form = toFormData(quiz);
  instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  let data: any = {};
  await instance
    .post('/api/quiz', form)
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};

export const updateQuiz = async (quiz: EditQuizType, deleted: number[]) => {
  console.log('====================================');
  console.log(quiz);
  console.log(deleted);
  console.log('====================================');
  const form = toFormData(quiz);
  form.append('_method', 'PUT');
  form.append('deleted_question', JSON.stringify(deleted));

  instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  let data: any = {};
  await instance
    .post(`/api/quiz/${quiz.id}`, form)
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};

export const deleteQuiz = async (quiz_id: number) => {
  const { data } = await instance.delete('/api/quiz/' + quiz_id);
  return data;
};
