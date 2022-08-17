import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Link from 'next/link';

interface Dropdown {
  name: string;
  type: string;
  children?: React.ReactNode;
}

interface MenuLink {
  to?: string;
  activeColor?: string;
  children(active: boolean): React.ReactNode;
}

interface MenuClick {
  activeColor?: string;
  onClick?: () => void;
  children(active: boolean): React.ReactNode;
}

type DropdownType = React.FunctionComponent<Dropdown> & {
  MenuLink: React.FC<MenuLink>;
  MenuClick: React.FC<MenuClick>;
};

const Dropdown: DropdownType = ({ name, type, children }) => {
  return (
    <div className='top-16 w-56 text-right'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button
            className={`${
              type == 'transparent'
                ? 'bg-transparent text-gray-500'
                : 'bg-primary text-white'
            } inline-flex w-full justify-center rounded-md bg-opacity-20 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            {name}
            <ChevronDownIcon
              className='ml-2 -mr-1 h-5 w-5 text-gray-500 hover:bg-opacity-30'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute p-1 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export const MenuLink: React.FC<MenuLink> = ({ to, activeColor, children }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link href={to ?? ''}>
          <div
            className={`${
              active
                ? activeColor ?? 'bg-violet-500 text-white'
                : 'text-gray-900'
            } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
          >
            {children(active)}
          </div>
        </Link>
      )}
    </Menu.Item>
  );
};

export const MenuClick: React.FC<MenuClick> = ({
  onClick,
  activeColor,
  children,
}) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <div
          onClick={onClick}
          className={`${
            active ? activeColor ?? 'bg-violet-500 text-white' : 'text-gray-900'
          } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
        >
          {children(active)}
        </div>
      )}
    </Menu.Item>
  );
};

Dropdown.MenuLink = MenuLink;
Dropdown.MenuClick = MenuClick;

export default Dropdown;
