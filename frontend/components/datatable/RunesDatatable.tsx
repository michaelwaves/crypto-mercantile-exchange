"use client"
import { useMemo } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

// Format timestamp to readable date
const formatTimestamp = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
};

export default function RunesDataTable({ data }: { data: any }) {
    const results = data.results
    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'symbol',
                header: 'Symbol',
                cell: ({ row }) => (
                    <div className="text-xl">{row.original.symbol}</div>
                ),
            },
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
            },
            {
                accessorKey: 'spaced_name',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Spaced Name
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
            },
            {
                accessorKey: 'number',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Number
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => <div className="text-right">{row.original.number.toLocaleString()}</div>,
            },
            {
                accessorKey: 'divisibility',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Divisibility
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => <div className="text-center">{row.original.divisibility}</div>,
            },
            {
                accessorKey: 'turbo',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Turbo
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <div className={cn("text-center font-semibold",
                        row.original.turbo ? "text-green-600" : "text-red-600"
                    )}>
                        {row.original.turbo ? "Yes" : "No"}
                    </div>
                ),
            },
            {
                accessorKey: 'supply.current',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Current Supply
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <div className="text-right font-mono">
                        {parseFloat(row.original.supply.current).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'location.timestamp',
                header: ({ column }) => (
                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Creation Date
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <div className="whitespace-nowrap">
                        {formatTimestamp(row.original.location.timestamp)}
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: results,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

    });

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <h2 className="text-2xl font-bold">Runes Explorer</h2>
                <p className="opacity-80">Displaying {data.total.toLocaleString()} total runes</p>
            </div>
            <div className='p-4'>
                <Input placeholder='Search Runes...' value={table.getState().globalFilter ?? ""}
                    onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-3 text-left font-semibold text-gray-700">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-600">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        data.total
                    )}{" "}
                    of {data.total.toLocaleString()} entries
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                        className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm px-2">
                        Page{" "}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </strong>
                    </span>

                    <button
                        className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                        className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>

                <select
                    className="border rounded px-2 py-1 text-sm"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}