import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setQuiz } from '@/features/quiz/quizSlice';

import Image from 'next/image';
import QuizType from '@/model/quiz';
import Button from '@/components/atoms/button';
import QuizCard from '@/components/atoms/quizCard';
import undrawPreview from '@/public/images/undraw_quiz_preview.svg';

interface QuizList {
  quiz: QuizType[];
}

const QuizList: React.FC<QuizList> = ({ quiz }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType>({});

  const startQuiz = () => {
    dispatch(setQuiz(selectedQuiz));
    router.push(`/quiz/${selectedQuiz.id}/start`);
  };

  return (
    <>
      <div className='flex flex-wrap'>
        {quiz.map((item, index) => {
          return (
            <QuizCard
              key={index}
              quiz={item}
              onClick={() => {
                setSelectedQuiz(item);
                setModal(true);
              }}
            />
          );
        })}
      </div>
      {selectedQuiz && (
        <Modal
          size='7xl h-full'
          show={modal}
          position='center'
          onClose={() => {
            setModal(false);
          }}
        >
          <Modal.Header>{selectedQuiz.name}</Modal.Header>
          <Modal.Body>
            <div className='p-2 sm:p-6 space-y-2 flex justify-evenly'>
              <div className='w-full sm:w-5/12 flex flex-col items-center justify-center'>
                <div className='w-full prose'>
                  <h1 className='text-indigo-500 font-semibold'>
                    Are you ready?
                  </h1>
                  <div className='not-prose'>
                    <p className='text-lg'>
                      {`You will do the ${selectedQuiz.name} quiz in ${selectedQuiz.time} minute with ${selectedQuiz.questions?.length} question. make sure you are ready to do it!`}
                    </p>
                  </div>
                </div>
              </div>
              <div className='w-full sm:w-5/12 hidden sm:flex justify-center p-5'>
                <Image src={undrawPreview} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='w-full flex justify-end space-x-4'>
              <Button
                title='Continue'
                onClick={() => {
                  startQuiz();
                }}
              />
              <Button
                title='Cancel'
                background='bg-gray-500'
                onClick={() => {
                  setModal(false);
                }}
              />
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default QuizList;
