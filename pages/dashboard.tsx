import { RootState } from '@/app/store';
import Card from '@/components/atoms/card';
import Authenticated from '@/components/layouts/authenticated';
import QuizList from '@/components/molecules/quizList';
import HistoryType from '@/model/history';
import QuizType from '@/model/quiz';
import { getCountData } from '@/services/countData';
import { getHistory } from '@/services/history';
import { getHiddenAnswerQuizList } from '@/services/quiz';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Dashboard {}
interface CountData {
  user: number;
  quiz: number;
  category: number;
}

const Dashboard: React.FC<Dashboard> = () => {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [countData, setCountData] = useState({} as CountData);

  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const getQuizList = useCallback(async () => {
    const result = await getHiddenAnswerQuizList();
    const histo = await getHistory();

    setHistory(histo.data);
    setQuiz(result.data);
    setLoading(false);
  }, []);

  const getCountList = async (signal: AbortSignal) => {
    const result = await getCountData(signal);
    if (result.data) setCountData(result.data);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (user.name && user.name.length > 0) {
      setLoading(false);
      user.level == 'admin' ? getCountList(signal) : getQuizList();
    }

    return () => {
      controller.abort();
    };
  }, [user]);

  return (
    <Authenticated loading={loading}>
      {user.level == 'admin' ? (
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0'>
          <Card
            onClick={() => {
              router.push('/quiz');
            }}
          >
            <h1 className='font-bold text-3xl text-white'>Total quiz</h1>
            <h1 className='font-bold text-3xl text-white text-right'>
              {countData.quiz}
            </h1>
          </Card>

          <Card
            background='bg-red-400'
            onClick={() => {
              router.push('/user');
            }}
          >
            <h1 className='font-bold text-3xl text-white'>Total user</h1>
            <h1 className='font-bold text-3xl text-white text-right'>
              {countData.user}
            </h1>
          </Card>

          <Card
            background='bg-green-400'
            onClick={() => {
              router.push('/category');
            }}
          >
            <h1 className='font-bold text-3xl text-white'>Total category</h1>
            <h1 className='font-bold text-3xl text-white text-right'>
              {countData.category}
            </h1>
          </Card>
        </div>
      ) : (
        <div className='w-full'>
          <div className='bg-indigo-500 w-full h-56 p-5 rounded-md items-center flex justify-between'>
            <div className='prose w-4/12 ml-5'>
              <h1 className='text-white'>Let play and be the first!</h1>
              <p className='text-white'>
                Quiz you have done: {history.length}{' '}
              </p>
            </div>
          </div>

          <div className='w-full my-5'>
            <div className='flex flex-col justify-between mx-5'>
              <h1 className='text-xl font-semibold text-gray-600'>
                Newest quiz
              </h1>

              <QuizList quiz={quiz} />
            </div>
          </div>
        </div>
      )}
    </Authenticated>
  );
};

export default Dashboard;
