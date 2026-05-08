import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

const DataTable = ({ columns, data, onRowClick, emptyMessage = "No data found" }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && requestSort(column.key)}
                className={cn(
                  "px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider",
                  column.sortable && "cursor-pointer hover:text-primary transition-colors"
                )}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && sortConfig.key === column.key && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "hover:bg-gray-50/50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-navy">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
