"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ApiResponse } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: ApiResponse<TData> | undefined;
  page: number;
  setPage: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  setPage,
  hasNextPage,
  hasPrevPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    manualPagination: true,
    pageCount: data?.info?.pages ?? 0,
  });

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setPage(page - 1);
    }
  };

  return (
    <div className="border border-[#97ce4c] overflow-auto w-full bg-[#44281d] rounded-lg flex flex-col">
      <ScrollArea className="flex-1 overflow-auto">
        <Table className="text-[#FAFAF5]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[#97ce4c] font-bold"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {cell.column.id === "name" ? (
                        <Link
                          href={`/character/${
                            (row.original as { id: number }).id
                          }`}
                          className="text-blue-500 underline"
                        >
                          {cell.getValue() as string}
                        </Link>
                      ) : cell.column.id === "image" ? (
                        <div className="relative h-12 w-12">
                          <Image
                            src={cell.getValue() as string}
                            alt={(row.original as { name: string }).name}
                            fill
                          />
                        </div>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="sticky bottom-0 bg-[#44281d] py-4 flex flex-col space-y-3">
        <div className="flex w-full items-center justify-center text-sm text-[#FAFAF5] font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center justify-center space-x-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
