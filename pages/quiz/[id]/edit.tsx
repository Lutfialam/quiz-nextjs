import { RootState } from '@/app/store';
import { useRouter } from 'next/router';
import { EditQuizType } from '@/model/quiz';
import { getCategory } from '@/services/category';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '@/features/alert/alertSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { getQuizById, updateQuiz } from '@/services/quiz';
import { quizCreateValidation } from '@/features/quiz/validation';

import Admin from '@/components/layouts/admin';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';
import useDebounce from '@/app/hooks/useDebounce';
import Select from '@/components/atoms/form/select';
import TextArea from '@/components/atoms/form/textArea';
import ImagePicker from '@/components/atoms/imagePicker';
import SelectSearch from '@/components/atoms/form/selectSearch';
import confirmation from '@/app/utils/alert/confirmation';
import {
  setQuiz,
  addQuestion as addQuest,
  setQuizError,
  setQuizEdit,
  setCategory,
  setSelectedCategory,
  removeQuestion as removeQuest,
  resetQuizEdit,
} from '@/features/quiz/quizEditSlice';

const Update = () => {
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(true);

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const debounceSearch = useDebounce(searchCategory, 500);

  const { quiz, quizError, category, deletedQuestion, selectedCategory } =
    useSelector((state: RootState) => state.quizEdit);

  const onChange = (e: ChangeEvent) => {
    let { name, value, files } = e.currentTarget as HTMLInputElement;
    dispatch(setQuiz({ ...quiz, [name]: files ? files[0] : value }));
  };

  const onQuestChange = (e: ChangeEvent, index: number) => {
    const { name, value } = e.currentTarget as HTMLInputElement;

    const question = quiz.questions?.map((item) => {
      if (item.index === index) {
        return { ...item, [name]: value };
      }
      return item;
    });

    dispatch(setQuiz({ ...quiz, questions: question }));
  };

  const submit = async () => {
    let { isValidated, error } = quizCreateValidation(quiz, quizError);

    if (isValidated) {
      setLoading(true);
      const result = await updateQuiz(quiz, deletedQuestion);

      if (result.status == 'success') {
        dispatch(setAlert({ message: `Quiz ${quiz.name} is updated!` }));
        router.push('/quiz');
      }

      error = { ...(result.errors ?? {}) };
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
    }

    dispatch(setQuizError({ ...quizError, ...error }));
  };

  const getCategoryList = async (signal: AbortSignal) => {
    setLoadingCategory(true);
    const search = category.filter((cat) =>
      cat.value.toLowerCase().includes(debounceSearch.toLowerCase())
    );

    if (search.length <= 0) {
      const result = await getCategory(signal, debounceSearch);
      dispatch(setCategory(result.data));
    }
    setLoadingCategory(false);
  };

  const getData = async () => {
    const result = await getQuizById(parseInt(id as string));

    const quizCategory = {
      id: result.categories.id,
      value: result.categories.name,
    };

    dispatch(setQuizEdit(result));
    dispatch(setSelectedCategory(quizCategory));
    setLoading(false);
  };

  const removeQuestion = (index: number) => {
    confirmation((isConfirmed) => {
      if (isConfirmed) dispatch(removeQuest(index));
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (id) getData(), getCategoryList(signal);

    return () => {
      dispatch(resetQuizEdit());
      controller.abort();
    };
  }, [id, debounceSearch]);

  return (
    <Admin loading={loading}>
      <div className='flex bg-white flex-col py-10 sm:p-5'>
        <div className='w-full flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-bold text-gray-500'>
            Edit quiz {quiz.name}
          </h1>
        </div>

        <div className='w-full'>
          <div className='w-full flex my-1'>
            <Input
              label='Quiz name'
              name='name'
              value={quiz.name}
              className='w-6/12 p-2'
              error={quizError.name}
              onChange={onChange}
            />
            <Input
              name='time'
              type='number'
              label='Time'
              className='w-6/12 p-2'
              value={quiz.time ?? 0}
              error={quizError.time}
              info="Set time to 0 if quiz doesn't have time limit"
              onChange={onChange}
            />
          </div>
          <div className='w-full'>
            <SelectSearch
              options={category}
              className='px-2 mb-5'
              label='Select Category'
              value={selectedCategory}
              loading={loadingCategory}
              error={quizError.category}
              onChange={(value) => {
                setSelectedCategory(value);
                setQuiz({ ...quiz, category_id: value.id });
              }}
              onSearch={setSearchCategory}
            />
          </div>
          <div className='w-full flex flex-col sm:flex-row items-end space-y-3 sm:space-y-0'>
            <TextArea
              name='description'
              label='Description'
              className='px-2 w-full sm:w-6/12'
              value={quiz.description}
              error={quizError.description}
              onChange={(e) => {
                setQuiz({ ...quiz, description: e.currentTarget.value });
              }}
            />
            <ImagePicker
              value={quiz.image as string}
              className='px-2 w-full sm:w-6/12'
              onImageChange={onChange}
            />
          </div>

          <div className='w-full flex justify-between items-center mt-10 pb-5 border-b-2 border-indigo-400'>
            <h1 className='text-2xl font-bold text-gray-500'>Question</h1>

            <div className='flex'>
              <Button
                rounded
                title='Add question'
                onClick={() => {
                  dispatch(addQuest());
                }}
              />
            </div>
          </div>

          <div id='quiz_form'>
            {quiz.questions?.map((item, index) => {
              return !item.remove ? (
                <div
                  className='hover:bg-gray-100 border-b-2 border-indigo-400'
                  key={index}
                >
                  <div className='flex justify-between items-center sm:px-5 pt-5'>
                    <h1 className='text-xl'>
                      Question {(item.index ?? 0) + 1}
                    </h1>
                    <Button
                      rounded
                      background='bg-red-500'
                      title='Remove this question'
                      onClick={() => {
                        removeQuestion(item.index as number);
                      }}
                    />
                  </div>
                  <div className='flex flex-col mb-5 p-2 sm:p-5'>
                    <div className='w-full'>
                      <Input
                        name='question'
                        label='Question'
                        value={item.question}
                        error={quizError.questions?.[index]?.question}
                        onChange={(e) => {
                          onQuestChange(e, item.index as number);
                        }}
                      />
                    </div>
                    <div className='w-full flex flex-col sm:flex-row justify-between items-center mt-2'>
                      <div className='w-full sm:w-1/2'>
                        <Input
                          name='first_choice'
                          label='Fist choice'
                          className='sm:m-2'
                          value={item.first_choice}
                          error={quizError.questions?.[index]?.first_choice}
                          onChange={(e) => {
                            onQuestChange(e, item.index as number);
                          }}
                        />
                      </div>
                      <div className='w-full sm:w-1/2'>
                        <Input
                          name='second_choice'
                          label='Second choice'
                          className='sm:m-2'
                          value={item.second_choice}
                          error={quizError.questions?.[index]?.second_choice}
                          onChange={(e) => {
                            onQuestChange(e, item.index as number);
                          }}
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-col sm:flex-row justify-between items-center mb-2'>
                      <div className='w-full sm:w-1/2'>
                        <Input
                          name='third_choice'
                          label='Third choice'
                          className='sm:m-2'
                          value={item.third_choice}
                          error={quizError.questions?.[index]?.third_choice}
                          onChange={(e) => {
                            onQuestChange(e, item.index as number);
                          }}
                        />
                      </div>
                      <div className='w-full sm:w-1/2'>
                        <Input
                          name='fourth_choice'
                          label='Fourth choice'
                          className='sm:m-2'
                          value={item.fourth_choice}
                          error={quizError.questions?.[index]?.fourth_choice}
                          onChange={(e) => {
                            onQuestChange(e, item.index as number);
                          }}
                        />
                      </div>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                      <Select
                        name='answer'
                        value={item.answer ?? 'A'}
                        option={['A', 'B', 'C', 'D']}
                        className='w-6/12'
                        onChange={(e) => {
                          onQuestChange(e, item.index as number);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <div className='w-full flex justify-between mt-5 items-center'>
            <h1>Question total: {quiz.questions?.length}</h1>
            <Button rounded title='Submit quiz data' onClick={submit} />
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default Update;
