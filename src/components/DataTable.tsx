import React from 'react';
import { 
  BadgeIndianRupee, 
  User, 
  UserCircle, 
  CircleDollarSign, 
  Award, 
  Crown, 
  Shield, 
  Target, 
  TrendingUp, 
  ArrowDownToLine,
  Calculator
} from 'lucide-react';

interface DataTableProps {
  data: any[];
  columns: { key: string; label: string }[];
}

const getColumnIcon = (key: string) => {
  const icons = {
    empId: <User className="h-4 w-4" />,
    agentName: <UserCircle className="h-4 w-4" />,
    silver: <CircleDollarSign className="h-4 w-4" />,
    gold: <Award className="h-4 w-4" />,
    platinum: <Crown className="h-4 w-4" />,
    standard: <Shield className="h-4 w-4" />,
    target: <Target className="h-4 w-4" />,
    achieved: <TrendingUp className="h-4 w-4" />,
    remaining: <ArrowDownToLine className="h-4 w-4" />,
    total: <Calculator className="h-4 w-4" />
  };
  return icons[key as keyof typeof icons] || <BadgeIndianRupee className="h-4 w-4" />;
};

const getColumnColor = (key: string) => {
  const colors = {
    // These styles mimic the colored badges in your ActivationsTable.
    empId: 'bg-white-100 text-yellow-500',
    agentName: 'bg-white-100 text-blue-500 font-bold',
    silver: 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 text-gray-900',
    gold: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-900',
    platinum: 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-900',
    standard: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-900',
    target: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-900',
    achieved: 'bg-gradient-to-r from-green-500/10 to-emerald-500/20 text-green-900',
    remaining: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-900'
  };
  return colors[key as keyof typeof colors] || '';
};

const getHeaderColor = (key: string) => {
  const colors = {
    empId: 'text-blue-500',
    agentName: 'text-blue-500',
    silver: 'text-gray-500',
    gold: 'text-yellow-500',
    platinum: 'text-indigo-500',
    standard: 'text-emerald-900',
    target: 'text-blue-500',
    achieved: 'text-green-500',
    remaining: 'text-red-500'
  };
  return colors[key as keyof typeof colors] || 'text-white/80';
};

export function DataTable({ data, columns }: DataTableProps) {
  // 1. Sort the data based on the 'achieved' field (highest first)
  const sortedData = [...data].sort((a, b) => Number(b.achieved) - Number(a.achieved));

  // 2. Reorder columns so that "agentName" comes first, then "achieved", "target", and "remaining"
  const prioritizedKeys = ['empId', 'agentName', 'achieved', 'target', 'remaining'];
  const orderedColumns = [
    ...columns
      .filter(col => prioritizedKeys.includes(col.key))
      .sort((a, b) => prioritizedKeys.indexOf(a.key) - prioritizedKeys.indexOf(b.key)),
    ...columns.filter(col => !prioritizedKeys.includes(col.key))
  ];

  const calculateColumnTotal = (key: string) => {
    if (['empId', 'agentName'].includes(key)) return '';
    return sortedData.reduce((sum, row) => sum + (Number(row[key]) || 0), 0).toLocaleString();
  };

  return (
    <div className="overflow-hidden bg-white rounded-xl">
      <div className="overflow-x-auto max-h-[900px] relative">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600">
              {orderedColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    {getColumnIcon(column.key)}
                    {column.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => {
              const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
              return (
                <tr
                  key={index}
                  className={`${rowClass} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}
                >
                  {orderedColumns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColumnColor(column.key)}`}
                      >
                        {typeof row[column.key] === 'number'
                          ? row[column.key].toLocaleString()
                          : row[column.key]}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
            {/* Totals Row */}
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 font-bold text-lg border-t-2 border-indigo-100">
              {orderedColumns.map((column) => (
                <td
                  key={`total-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.key === 'empId' ? (
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Total
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColumnColor(column.key)}`}
                    >
                      {calculateColumnTotal(column.key)}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
