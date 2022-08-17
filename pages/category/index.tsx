import Swal, { SweetAlertOptions } from 'sweetalert2';
import CategoryType from '@/model/category';
import Admin from '@/components/layouts/admin';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';
import useDebounce from '@/app/hooks/useDebounce';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteCategory, getCategory } from '@/services/category';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import Table from '@/components/atoms/table';
import Link from 'next/link';

interface Category {}

const Category: React.FC<Category> = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [pageMeta, setPageMeta] = useState({
    perPage: 10,
    currentPage: 1,
    totalPage: 1,
    lastPage: 1,
  });

  const router = useRouter();
  const debounceValue = useDebounce(search, 500);

  const getData = async (signal: AbortSignal) => {
    const result = await getCategory(
      signal,
      debounceValue,
      pageMeta.currentPage
    );
    setCategory(result.data);
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
        const result = await deleteCategory(id);

        const option: SweetAlertOptions = {
          title: 'Deleted!',
          text: '',
          icon: 'success',
        };

        if (result.status != 'success') {
          Swal.fire({
            title: 'Error',
            text: `Error when deleting data`,
            icon: 'error',
          });
        }

        Swal.fire(option);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getData(signal);

    return () => {
      controller.abort();
    };
  }, [debounceValue]);

  return (
    <Admin loading={loading}>
      <div className='flex flex-col sm:flex-row justify-between mb-5 sm:items-center content-center space-y-3 sm:space-y-0'>
        <Button
          title='Create new category'
          onClick={() => {
            router.push('/category/create');
          }}
        />
        <Input
          name='search'
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search category here'
        />
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell className='rounded-tl-lg' value='#' />
          <Table.HeadCell value='Name' />
          <Table.HeadCell value='Description' />
          <Table.HeadCell value='Created at' />
          <Table.HeadCell className='rounded-tr-lg' value='Action' />
        </Table.Head>
        <Table.Body>
          {category.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>
                {new Date(item.created_at ?? '').toUTCString()}
              </Table.Cell>
              <Table.Cell>
                <div className='w-full flex items-center space-x-3'>
                  <Link href={`/category/${item.id}/edit`}>
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
          ))}
        </Table.Body>
      </Table>
    </Admin>
  );
};

export default Category;
