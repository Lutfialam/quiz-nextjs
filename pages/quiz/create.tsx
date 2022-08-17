import Button from '@/components/atoms/button';
import ImagePicker from '@/components/atoms/imagePicker';
import Select from '@/components/atoms/form/select';
import Admin from '@/components/layouts/admin';
import Input from '@/components/atoms/form/input';
import TextArea from '@/components/atoms/form/textArea';
import { quizCreateValidation } from '@/features/quiz/validation';
import { QuizFormType, QuizTypeError } from '@/model/quiz';
import { useEffect, useState } from 'react';
import { addQuiz } from '@/services/quiz';
import { getCategory } from '@/services/category';
import CategoryType from '@/model/category';
import useDebounce from '@/app/hooks/useDebounce';
import SelectSearch from '@/components/atoms/form/selectSearch';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@/features/alert/alertSlice';

interface Create {}
interface SearchType {
  id: number;
  value: string;
}

const Create: React.FC<Create> = () => {
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [category, setCategory] = useState<{ id: number; value: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SearchType>(
    {} as SearchType
  );

  const [quiz, setQuiz] = useState<QuizFormType>({} as QuizFormType);
  const [quizError, setQuizError] = useState<QuizTypeError>(
    {} as QuizTypeError
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const debounceSearch = useDebounce(searchCategory, 500);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.currentTarget;
    setQuiz({ ...quiz, [name]: files ? files[0] : value });
  };

  const onQuestChange = (e: any, id: number) => {
    const question = quiz.questions?.map((item, index) => {
      if (item.id === id) {
        return {
          ...item,
          [e.currentTarget.name]: e.currentTarget.value,
        };
      }
      return item;
    });
    setQuiz({ ...quiz, questions: question });
  };

  const addQuestion = () => {
    const question = {
      id: quiz?.questions?.length ?? 0,
      answer: '',
      question: '',
      first_choice: '',
      second_choice: '',
      third_choice: '',
      fourth_choice: '',
    };

    setQuiz({
      name: quiz.name,
      time: quiz.time,
      category_id: quiz.category_id,
      description: quiz.description,
      questions: [
        ...quiz.questions,
        {
          ...question,
          answer: 'A',
        },
      ],
    });

    setQuizError({
      name: quizError.name,
      time: quizError.time,
      category: quizError.category,
      description: quizError.description,
      questions: [...(quizError.questions ?? []), { ...question }],
    });
  };

  const submit = async () => {
    const { isValidated, error } = quizCreateValidation(quiz, quizError);

    if (isValidated) {
      const result = await addQuiz(quiz);
      if (result.errors) {
        setQuizError({ ...quizError, ...result.errors });
        setLoading(false);
      }
      if (result.status == 'success') {
        dispatch(
          setAlert({
            status: 'success',
            message: 'Quiz created successfully',
          })
        );
        router.push('/quiz');
      }
    }
    setQuizError(error);
  };

  const getCategoryList = async () => {
    setLoadingCategory(true);
    const search = category.filter((cat) =>
      cat.value.toLowerCase().includes(debounceSearch.toLowerCase())
    );

    if (search.length <= 0) {
      const result = await getCategory(debounceSearch);
      const categoryList = result.data.map((item: CategoryType) => {
        return {
          id: item.id,
          value: item.name,
        };
      });

      setCategory(categoryList);
    }
    setLoadingCategory(false);
  };

  useEffect(() => {
    getCategoryList();
    if (quiz.questions.length <= 0) {
      addQuestion();
    }
    setLoading(false);
  }, [debounceSearch]);

  return (
    <Admin loading={loading}>
      <div className='flex bg-white flex-col py-10 sm:p-5'>
        <div className='w-full flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-bold text-gray-500'>Create new quiz</h1>
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
                  addQuestion();
                }}
              />
            </div>
          </div>

          <div id='quiz_form'>
            {quiz.questions?.map((item, index) => {
              return (
                <div
                  className='hover:bg-gray-100 border-b-2 border-indigo-400'
                  key={index}
                >
                  <div className='flex justify-between items-center sm:px-5 pt-5'>
                    <h1 className='text-xl'>Question {index + 1}</h1>
                    <Button
                      title='Remove this question'
                      background='bg-red-500'
                      rounded
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
                          onQuestChange(e, item.id ?? 1);
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
                            onQuestChange(e, item.id ?? 1);
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
                            onQuestChange(e, item.id ?? 1);
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
                            onQuestChange(e, item.id ?? 1);
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
                            onQuestChange(e, item.id ?? 1);
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
                          onQuestChange(e, item.id ?? 1);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
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

export default Create;
