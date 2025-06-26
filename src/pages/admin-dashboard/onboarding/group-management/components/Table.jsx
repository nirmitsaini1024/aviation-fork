// Table components with grid borders added
export const Table = ({ children, className = "" }) => (
  <table className={`w-full caption-bottom text-sm border border-gray-400 ${className}`}>
    {children}
  </table>
);

export const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b [&_tr]:border-gray-400">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="[&_tr]:border-b [&_tr]:border-gray-400 [&_tr:last-child]:border-b [&_tr:last-child]:border-gray-400">{children}</tbody>
);

export const TableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b border-gray-400 transition-colors data-[state=selected]:bg-muted ${className}`}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = "", onClick }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    onClick={onClick}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = "", colSpan }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </td>
);