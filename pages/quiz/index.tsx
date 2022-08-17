import { RootState } from '@/app/store';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getHiddenAnswerQuizList } from '@/services/quiz';
import { useCallback, useEffect, useRef, useState } from 'react';

import QuizType from '@/model/quiz';
import Button from '@/components/atoms/button';
import QuizList from '@/components/molecules/quizList';
import Authenticated from '@/components/layouts/authenticated';
import Loading from '@/components/atoms/loading';

const Quiz = () => {
  const router = useRouter();
  const isMounted = useRef<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [pageMeta, setPageMeta] = useState({
    currentPage: 0,
    lastPage: 0,
    perPage: 0,
  });

  const getData = useCallback(async () => {
    const result = await getHiddenAnswerQuizList();

    setQuiz(result.data);
    setPageMeta({
      currentPage: result.current_page,
      lastPage: result.last_page,
      perPage: result.per_page,
    });
    setLoading(false);
  }, []);

  const loadMoreQuiz = async () => {
    setLoadingMore(true);
    const result = await getHiddenAnswerQuizList(pageMeta.currentPage + 1);

    setQuiz([...quiz, ...result.data]);
    setPageMeta({
      currentPage: result.current_page,
      lastPage: result.last_page,
      perPage: result.per_page,
    });
    setLoadingMore(false);
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    getData();
  }, []);

  return (
    <Authenticated loading={loading}>
      <div className='w-full flex justify-between items-center p-2'>
        <h2 className='text-gray-700 text-xl font-semibold'>Quiz list</h2>
        {user.level === 'admin' && (
          <Button
            title='Show entries data'
            onClick={() => {
              router.push('/quiz/entries');
            }}
          />
        )}
      </div>

      <QuizList quiz={quiz} />
      <div className='w-full flex justify-center my-5'>
        {loadingMore && (
          <div className='flex space-x-2 items-center'>
            <Loading show />
            <span className='text-primary'>Loading...</span>
          </div>
        )}
        {!loadingMore && pageMeta.currentPage < pageMeta.lastPage && (
          <Button rounded title='Load more' onClick={loadMoreQuiz} />
        )}
      </div>
    </Authenticated>
  );
};

export default Quiz;
