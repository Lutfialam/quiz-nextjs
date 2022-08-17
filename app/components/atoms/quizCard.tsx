import QuizType from '@/model/quiz';

interface QuizCard {
  quiz: QuizType;
  onClick?: () => void;
  showCategory?: boolean;
}

const QuizCard: React.FC<QuizCard> = ({
  quiz,
  onClick,
  showCategory = true,
}) => {
  return (
    <div className='w-full sm:w-4/12 p-2'>
      <div
        className='w-full shadow-lg hover:shadow-2xl hover:border hover:border-indigo-400 bg-white rounded-lg p-3 flex items-center'
        onClick={onClick}
      >
        <div className='bg-indigo-500 rounded-lg w-12 h-10 p-1 mr-4'>
          <h1 className='uppercase text-white h-full w-full flex items-center justify-center'>
            {quiz.name ? quiz.name?.charAt(0) + quiz.name?.charAt(1) : 'NN'}
          </h1>
        </div>

        <div className='flex flex-col w-full'>
          <div className='w-full flex justify-between'>
            <h4 className='font-semibold text-lg text-gray-700'>{quiz.name}</h4>
            {showCategory && (
              <div
                className={`${
                  quiz.categories?.name ? 'flex' : 'hidden'
                } hidden sm:flex rounded-full bg-indigo-400 items-center px-2`}
              >
                <p className='text-xs text-white text-center'>
                  {quiz.categories?.name}
                </p>
              </div>
            )}
          </div>
          <p>Time: {quiz.time} Minute</p>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
