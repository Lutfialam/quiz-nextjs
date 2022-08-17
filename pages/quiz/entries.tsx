import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteQuiz, getQuiz } from '@/services/quiz';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';

import Swal from 'sweetalert2';
import QuizType from '@/model/quiz';
import Table from '@/components/atoms/table';
import Admin from '@/components/layouts/admin';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';
import useDebounce from '@/app/hooks/useDebounce';

interface Entries {}

const Entries: React.FC<Entries> = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [pageMeta, setPageMeta] = useState({
    perPage: 10,
    currentPage: 1,
    totalPage: 1,
    lastPage: 1,
  });

  const router = useRouter();
  const debounceValue = useDebounce(search, 500);

  const getData = async () => {
    const result = await getQuiz(debounceValue, pageMeta.currentPage);
    setQuiz(result.data);
    setPageMeta({
      currentPage: result.current_page,
      totalPage: result.last_page,
      lastPage: result.last_page,
      perPage: result.per_page,
    });
    setLoading(false);
  };

  const deleteData = async (id: number) => {
    Swal.fire({
      title: 'Are you sure to delete this data?',
      text: 'You will delete this data permanently',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#6366f1',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const res = await deleteQuiz(id);
        if (res.status === 'success') {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success',
          });
          getData();
        }
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getData();
  }, [debounceValue]);

  return (
    <Admin loading={loading}>
      <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 justify-between mb-5 sm:items-center sm:content-center'>
        <Button
          title='Create new quiz'
          onClick={() => {
            router.push('/quiz/create');
          }}
        />
        <Input
          name='search'
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search quiz here'
        />
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell value='#' className='rounded-tl-lg' />
          <Table.HeadCell value='Name' />
          <Table.HeadCell value='Description' />
          <Table.HeadCell value='Question' />
          <Table.HeadCell value='Time' />
          <Table.HeadCell value='Category' />
          <Table.HeadCell value='Action' className='rounded-tr-lg' />
        </Table.Head>
        <Table.Body>
          {quiz.length > 0 ? (
            quiz.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell className='w-1/12'>{index + 1}</Table.Cell>
                <Table.Cell className='w-2/12'>{item.name}</Table.Cell>
                <Table.Cell className='w-2/12'>
                  {item.description?.substring(0, 50)}...
                </Table.Cell>
                <Table.Cell className='w-1/12'>
                  {item.questions?.length}
                </Table.Cell>
                <Table.Cell className='w-2/12'>{item.time} minute</Table.Cell>
                <Table.Cell className='w-2/12'>
                  {item.categories?.name}
                </Table.Cell>
                <Table.Cell className='w-1/12'>
                  <div className='flex space-x-3'>
                    <Link href={`/quiz/${item.id}/edit`}>
                      <a className='text-yellow-400 hover:text-white'>
                        <span className='sr-only'>Edit</span>
                        <PencilIcon className='h-5 w-5' />
                      </a>
                    </Link>
                    <button
                      className='text-red-500 hover:text-white'
                      onClick={() => {
                        deleteData(item.id ?? 0);
                      }}
                    >
                      <span className='sr-only'>Delete</span>
                      <TrashIcon className='h-5 w-5' />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <div className='w-full flex justify-center'>
                  <p className='font-semibold'>No data found</p>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Admin>
  );
};

export default Entries;
