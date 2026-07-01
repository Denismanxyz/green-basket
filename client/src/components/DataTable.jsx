import { ArrowDownUp } from 'lucide-react';

const DataTable = ({ columns, rows, onSort, empty = 'No records found' }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <button
                  type="button"
                  onClick={() => column.sortable && onSort?.(column.key)}
                  className={`inline-flex items-center gap-1 ${column.sortable ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {column.label}
                  {column.sortable && <ArrowDownUp size={13} />}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length ? (
            rows.map((row) => (
              <tr key={row._id || row.id} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
