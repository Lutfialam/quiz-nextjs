import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';
import Table from '@/components/atoms/table';
import Admin from '@/components/layouts/admin';
import UserType from '@/model/user';
import { getUserlist } from '@/services/user';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface Index {}

const Index: React.FC<Index> = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<UserType[]>([]);
  const [pageMeta, setPageMeta] = useState({});

  const router = useRouter();

  const deleteData = async (id: number) => {};

  const getData = async (signal: AbortSignal) => {
    const result = await getUserlist(signal, search);
    console.log(result);

    setUser(result.data);
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);

    return () => {
      setUser([]);
      controller.abort();
    };
  }, []);

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
          <Table.HeadCell value='Email' />
          <Table.HeadCell value='Level' />
          <Table.HeadCell value='Action' className='rounded-tr-lg' />
        </Table.Head>
        <Table.Body>
          {user.length > 0 ? (
            user.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell className='w-1/12'>{index + 1}</Table.Cell>
                <Table.Cell className='w-2/12'>{item.name}</Table.Cell>
                <Table.Cell className='w-2/12'>{item.email}</Table.Cell>
                <Table.Cell className='w-2/12'>{item.level}</Table.Cell>
                <Table.Cell className='w-1/12'>
                  <div className='flex space-x-3'>
                    <Link href={`/user/${item.id}/edit`}>
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

export default Index;
