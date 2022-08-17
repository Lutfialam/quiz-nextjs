import Authenticated from '@/components/layouts/authenticated';
import QuizCard from '@/components/atoms/quizCard';
import HistoryType from '@/model/history';
import { getHistory } from '@/services/history';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/atoms/button';

interface History {}

const History: React.FC<History> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState({
    total: 0,
    perPage: 0,
    currentPage: 0,
    lastPage: 0,
  });
  const [history, setHistory] = useState<HistoryType[]>([]);

  const getData = async () => {
    const data = await getHistory();
    console.log(data);

    setHistory(data.data);
    setPageMeta({
      total: data.total,
      perPage: data.per_page,
      currentPage: data.current_page,
      lastPage: data.last_page,
    });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Authenticated loading={loading}>
      <h1 className='font-semibold text-3xl mb-5'>Your history</h1>
      <div className='flex flex-wrap'>
        {history.length > 0 ? (
          history.map((item, index) => {
            return (
              <QuizCard
                key={index}
                showCategory={false}
                quiz={item.quiz ?? {}}
                onClick={() => {
                  router.push(`/quiz/history/${item.id}`);
                }}
              />
            );
          })
        ) : (
          <div className='w-full flex flex-col'>
            <div className='w-full h-full flex flex-col-reverse sm:flex-row justify-between items-center py-20 px-10'>
              <div className='w-full sm:w-4/12 prose'>
                <h1 className='text-indigo-500 hidden sm:flex font-semibold'>
                  QUIZ APP
                </h1>
                <p>
                  You have not taken any quiz yet. <br /> Go to{' '}
                  <Link href='/quiz'>
                    <span className='text-indigo-500 font-semibold'>
                      Quiz page
                    </span>
                  </Link>{' '}
                  to take a quiz.
                </p>
                <Button
                  rounded
                  title='Go to quiz list'
                  onClick={() => {
                    router.push('/quiz');
                  }}
                />
              </div>
              <div className='w-full sm:w-6/12'>
                {/* <Image src={undrawLoading} /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </Authenticated>
  );
};

export default History;
