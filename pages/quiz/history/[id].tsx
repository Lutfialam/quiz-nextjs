import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getHistoryResult } from '@/services/history';
import Authenticated from '@/components/layouts/authenticated';
import HistoryType from '@/model/history';
import Button from '@/components/atoms/button';
import Link from 'next/link';

interface History {}

const History: React.FC<History> = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryType>();

  const getHistory = async () => {
    const data = await getHistoryResult(parseInt(id as string));

    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    id && getHistory();
  }, [id]);

  return (
    <Authenticated loading={loading}>
      <div className='w-full flex justify-center'>
        <div className='w-full sm:w-10/12 h-full flex-col-reverse sm:flex-row flex justify-between items-center sm:py-20'>
          <div className='w-full sm:w-4/12 items-center prose'>
            <h1 className='text-indigo-500 font-semibold hidden sm:flex'>
              QUIZ APP
            </h1>
            <p className='text-center sm:text-left'>
              You have finished the quiz. and you get score {history?.score}{' '}
              from {history?.quiz?.questions?.length} question. and you can see
              your history in
              <Link href='/quiz/history'>
                <span className='text-indigo-500 px-1'>quiz history</span>
              </Link>
              page
            </p>

            <p className='pb-5 text-center sm:text-left'>
              finished in: {history?.time} minute
            </p>

            <div className='flex justify-center sm:justify-start'>
              <Button
                rounded
                title='Back to dashboard'
                onClick={() => {
                  router.push('/dashboard');
                }}
              />
            </div>
          </div>
          <div className='w-6/12 flex justify-center items-center'>
            <h1
              className='text-indigo-500 text-[10rem] font-semibold'
              id='result_score'
            >
              {`${history?.score}/${history?.quiz?.questions?.length}`}
            </h1>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default History;
