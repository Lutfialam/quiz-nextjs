import { useRouter } from 'next/router';
import { RootState } from '@/app/store';
import { addHistory } from '@/services/history';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHistory } from '@/features/history/historySlice';
import { quizStartValidation } from '@/features/quiz/validation';

import HistoryType from '@/model/history';
import QuestionType from '@/model/question';
import Button from '@/components/atoms/button';
import InputRadio from '@/components/atoms/form/inputRadio';
import Authenticated from '@/components/layouts/authenticated';

interface Start {}

const Start: React.FC<Start> = () => {
  const [loading, setLoading] = useState(true);
  const [timeStart, setTimeStart] = useState(new Date().getTime());
  const [answer, setAnswer] = useState<QuestionType[]>([]);
  const [countDown, setCountDown] = useState({
    time: '',
    class: 'bg-indigo-500',
  });

  const isMounted = useRef(false);
  const answerRef = useRef<QuestionType[]>([]);
  const statusRef = useRef<'prepare' | 'start' | 'sending'>('prepare');
  answerRef.current = answer;

  const router = useRouter();
  const dispatch = useDispatch();
  const quiz = useSelector((state: RootState) => state.quiz);

  const findAnswer = (id: number) => {
    return answer.find((item: QuestionType) => item.id === id);
  };

  const onAnswerChange = (id: number, value: string) => {
    const newAnser = answer.map((item: QuestionType) => {
      if (item.id === id) {
        return { ...item, answer: value };
      }
      return item;
    });
    setAnswer(newAnser);
  };

  const startCountdown = () => {
    const time = quiz.time ?? 0;
    const countDownDate = new Date(
      new Date().getTime() + time * 60000
    ).getTime();

    var x = setInterval(async function () {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let newHours = hours < 10 ? '0' + hours : hours;
      let newMinutes = minutes < 10 ? '0' + minutes : minutes;
      let newSeconds = seconds < 10 ? '0' + seconds : seconds;

      let left = `${newHours}:${newMinutes}:${newSeconds} left`;
      setCountDown({ time: left, class: 'bg-indigo-500' });

      minutes < 5 && setCountDown({ time: left, class: 'bg-red-500' });
      if (minutes === 0 && seconds === 0) {
        clearInterval(x);
        setCountDown({ time: 'Your time is up', class: 'bg-red-500' });

        const distance = countDownDate - new Date().getTime();
        const minute = Math.ceil(((distance % 86400000) % 3600000) / 60000);
        statusRef.current != 'sending' && (await submit(minute));
      }
    }, 1000);
  };

  const getMinute = () => {
    const to = new Date().getTime();
    const distance = to - timeStart;
    return Math.ceil(((distance % 86400000) % 3600000) / 60000);
  };

  const validate = () => {
    const { isValid, error } = quizStartValidation(answerRef.current);

    if (isValid) {
      submit(getMinute());
    } else {
      const tempAnswer = answer;
      error.length > 0 && router.push(`#question_${error[0].id}`);
      setAnswer(tempAnswer);
    }
  };

  const submit = async (minute: number) => {
    setLoading(true);
    statusRef.current = 'sending';
    const result = await addHistory({
      time: minute,
      quiz_id: quiz.id ?? 0,
      questions: answerRef.current,
    });

    if (result.status === 'success') {
      const history: HistoryType = result.history;

      dispatch(setHistory(history));
      router.push(`/quiz/history/${history.id}`);
    } else {
      console.log(result);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isMounted.current) return;

    if (quiz.name && quiz.name.length > 0) {
      isMounted.current = true;
      if (statusRef.current === 'prepare') {
        statusRef.current = 'start';

        const newAnswer: QuestionType[] = [];
        quiz.questions?.map((question) => {
          newAnswer.push({
            ...question,
            answer: '',
          });
        });
        setAnswer(newAnswer);

        if (quiz.time && quiz.time > 0) {
          startCountdown();
          setTimeStart(new Date().getTime());
        }
      }
      setLoading(false);
    } else {
      router.push('/quiz');
    }
  }, [quiz, statusRef.current]);

  return (
    <Authenticated loading={loading}>
      <div className='w-full'>
        <div className='w-full border-b-2 border-indigo-400 py-4'>
          <h2 className='text-2xl font-bold mb-3'>{quiz.name}</h2>
          <p className='text-gray-600'>Time: {quiz.time} minute</p>
          <p className='text-gray-600'>Description: {quiz.description}</p>
          <p className='text-gray-600 pb-3'>
            Number of questions: {quiz.questions?.length}
          </p>
        </div>

        <div className='w-full' id='question_container'>
          {quiz.questions?.map((item, index) => (
            <div
              className='hover:bg-gray-100'
              key={item.id}
              id={`question_${item.id}`}
            >
              <div className='flex flex-col mb-5 p-5'>
                <div className='w-full flex justify-between items-center'>
                  <h1 className='text-xl'>{`${index + 1}. ${
                    item.question?.includes('?')
                      ? item.question
                      : item.question + '?'
                  }`}</h1>
                </div>
                <div className='px-2 space-y-1 mt-3'>
                  <InputRadio
                    value='A'
                    label={item.first_choice ?? ''}
                    onClick={() => {
                      onAnswerChange(item.id ?? 0, 'A');
                    }}
                    isActive={findAnswer(item.id ?? 0)?.answer == 'A'}
                  />
                  <InputRadio
                    value='B'
                    label={item.second_choice ?? ''}
                    onClick={() => {
                      onAnswerChange(item.id ?? 0, 'B');
                    }}
                    isActive={findAnswer(item.id ?? 0)?.answer == 'B'}
                  />
                  <InputRadio
                    value='C'
                    label={item.third_choice ?? ''}
                    onClick={() => {
                      onAnswerChange(item.id ?? 0, 'C');
                    }}
                    isActive={findAnswer(item.id ?? 0)?.answer == 'C'}
                  />
                  <InputRadio
                    value='D'
                    label={item.fourth_choice ?? ''}
                    onClick={() => {
                      onAnswerChange(item.id ?? 0, 'D');
                    }}
                    isActive={findAnswer(item.id ?? 0)?.answer == 'D'}
                  />
                </div>
              </div>
              <div className='w-full border-b-2 border-indigo-400'></div>
            </div>
          ))}
        </div>

        <div className='w-full flex justify-end mt-5'>
          <Button title='Submit' onClick={validate} />
        </div>

        {quiz.time && quiz.time > 0 ? (
          <div className='fixed p-5 left-0 bottom-0'>
            <div
              className={`${countDown.class} shadow-lg rounded-full px-4 py-1 text-white`}
            >
              {countDown.time}
            </div>
          </div>
        ) : null}
      </div>
    </Authenticated>
  );
};

export default Start;
