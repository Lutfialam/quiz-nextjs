import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Fragment, useState } from 'react';
import Loading from '@/components/atoms/loading';

interface Value {
  id: number;
  value: string;
}

interface SelectSearch {
  value: Value;
  label?: string;
  error?: string;
  options: Value[];
  loading?: boolean;
  className?: string;
  onChange: (value: Value) => void;
  onSearch: (value: string) => void;
}

const SelectSearch: React.FC<SelectSearch> = ({
  value,
  error,
  label = 'Select',
  options,
  className,
  onChange,
  onSearch,
  loading = true,
}) => {
  const [query, setQuery] = useState('');

  const filteredOption =
    query === ''
      ? options
      : options.filter((person) =>
          person.value
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className={className}>
      <label
        className={error && error.length > 0 ? 'text-red-500' : 'text-gray-500'}
      >
        {label}
      </label>
      <Combobox value={value} onChange={onChange}>
        <div className='relative mt-1'>
          <div
            className={`${
              error && error.length > 0 ? 'border-red-500' : 'border-gray-300'
            } border relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm`}
          >
            <Combobox.Input
              className='w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0'
              displayValue={(option: Value) => option.value}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                onSearch(event.currentTarget.value);
              }}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <p>Select</p>
              <SelectorIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className={`${
                error && error.length > 0 ? 'border-red-500' : 'border-gray-300'
              } border absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
            >
              {loading ? (
                <div className='p-2 flex items-center space-x-2'>
                  <Loading show />
                  <h3 className='text-primary text-lg font-semibold'>
                    Searching...
                  </h3>
                </div>
              ) : filteredOption.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredOption.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.value}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && error.length > 0 && (
        <small className='text-red-500'>{error}</small>
      )}
    </div>
  );
};

export default SelectSearch;
