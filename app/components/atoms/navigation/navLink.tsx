import Link from 'next/link';

interface NavLink {
  href: string;
  active: boolean;
  children: React.ReactNode;
}
const NavLink: React.FC<NavLink> = ({ href, active = false, children }) => {
  const className = () => {
    const baseClass =
      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out cursor-pointer';

    const activeClass = `${baseClass} border-primary focus:border-indigo-700 text-gray-900`;
    const notActiveClass = `${baseClass} border-transparent text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:border-gray-300`;

    return active ? activeClass : notActiveClass;
  };

  return (
    <Link href={href}>
      <div className={className()}>{children}</div>
    </Link>
  );
};

export default NavLink;
