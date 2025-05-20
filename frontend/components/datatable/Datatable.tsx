"use client"
import React, { useState, useMemo } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ArrowUpDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface DataTableProps<TData> {
    data: TData[]
}

export function DataTable<TData extends object>({ data }: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const router = useRouter()
    const pathname = usePathname()
    const columns = useMemo<ColumnDef<TData, any>[]>(() => {
        if (!data.length) return []

        const sample = data[0]

        const autoColumns = Object.keys(sample).map((key) => ({
            accessorKey: key,
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-left px-0 dark:text-gray-300 hover:text-emerald-400 transition-colors"
                >
                    {key}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) => {
                const value = row.getValue(key)
                if (value === null || value === undefined) return "-"
                if (Array.isArray(value)) return value.join(", ")
                return String(value)
            },
        }))

        const selectColumn: ColumnDef<TData, any> = {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="bg-gray-700 border-gray-600 checked:bg-emerald-500 checked:border-emerald-600"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="bg-gray-700 border-gray-600 checked:bg-emerald-500 checked:border-emerald-600"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        }

        return [selectColumn, ...autoColumns]
    }, [data])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            rowSelection,
            globalFilter,
            columnFilters,
        },
        enableRowSelection: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="space-y-4">
            {/* Global Filter */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-green-300" />
                </div>
                <input
                    type="text"
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="block w-full p-2 pl-10 text-sm rounded-lg border bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Search all columns..."
                />
            </div>

            <div className="rounded-md border border-gray-700 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 shadow-lg">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-700 dark">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="dark:text-gray-300 bg-gray-800">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className={`transition-colors hover:bg-emerald-800/20 ${row.getIsSelected() ? "bg-emerald-900/30" : ""
                                        }`

                                    }
                                    //@ts-expect-error description: row.original.id exists in our data
                                    onClick={() => router.push(`${pathname}/${row.original.id}`)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="dark:text-gray-300 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center dark:text-gray-400">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between space-x-2 px-4 py-3 bg-gray-800 border-t border-gray-700 rounded-b-md text-gray-300">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="dark:text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="dark:text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                            Next
                        </Button>
                    </div>

                    <div className="flex items-center space-x-1 text-sm">
                        <span>
                            Page <strong className="text-emerald-400">{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                            <strong className="text-emerald-400">{table.getPageCount()}</strong>
                        </span>
                    </div>

                    {/* Rows per page selector */}
                    <select
                        className="bg-gray-700 border border-gray-600 rounded-md p-1 text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-400"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}