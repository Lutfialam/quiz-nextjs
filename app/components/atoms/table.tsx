import React from 'react';

interface Table {
  children: React.ReactNode;
}

interface Head {
  children: React.ReactNode;
}

interface Body {
  children: React.ReactNode;
}

interface HeadCell {
  className?: string;
  value: React.ReactNode | string;
}

interface Cell {
  colSpan?: number;
  className?: string;
  children: React.ReactNode | string;
}
interface Row {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode | string;
}

type TableType = React.FunctionComponent<Table> & {
  Head: React.FC<Head>;
  HeadCell: React.FC<HeadCell>;
  Body: React.FC<Body>;
  Row: React.FC<Row>;
  Cell: React.FC<Cell>;
};

const Table: TableType = ({ children }) => {
  return (
    <div className='overflow-x-auto w-full'>
      <table className='text-left shadow-lg w-full'>{children}</table>
    </div>
  );
};

const Head: React.FC<Head> = ({ children }) => (
  <thead>
    <tr>{children}</tr>
  </thead>
);

const HeadCell: React.FC<HeadCell> = ({ value, className }) => {
  return (
    <th className={`${className} py-4 px-6 bg-primary border-b text-white`}>
      {value}
    </th>
  );
};

const Body: React.FC<Body> = ({ children }) => <tbody>{children}</tbody>;

const Row: React.FC<Row> = ({ className, onClick, children }) => {
  return (
    <tr className={`${className} hover:bg-gray-200`} onClick={onClick}>
      {children}
    </tr>
  );
};

const Cell: React.FC<Cell> = ({ children, className, colSpan, ...props }) => {
  return (
    <td
      {...props}
      colSpan={colSpan}
      className={`${className} border-b border-gray-200 py-4 px-6 text-sm`}
    >
      {children}
    </td>
  );
};

Table.Head = Head;
Table.Body = Body;
Table.HeadCell = HeadCell;
Table.Cell = Cell;
Table.Row = Row;

export default Table;
