import { useRouter } from 'next/router';

const Quiz = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Quiz: {id}</p>;
};

export default Quiz;
