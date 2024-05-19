"use client";

import Spinner from "@/components/spinner/spinner";
import { ApiResponse, Character, columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPage = parseInt(searchParams.get("page") as string, 10) || 1;
  const queryName = searchParams.get("name") || "";

  const [searchValue, setSearchValue] = useState(queryName);
  const [data, setData] = useState<ApiResponse<Character>>();
  const [page, setPage] = useState(queryPage);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const debouncedSearch = useDebouncedCallback(
    (value: string, newPage: number) => {
      setSearchValue(value);
      setPage(newPage);
    },
    300,
  );

  const fetchCharacters = async (name: string, page: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHARACTER_API_URL}?page=${page}&name=${name}`,
      );
      const data = await response.json();

      setData(data);
      setHasNextPage(data.info.next != null);
      setHasPrevPage(data.info.prev != null);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      setHasNextPage(false);
      setHasPrevPage(false);
    }
  };

  useEffect(() => {
    fetchCharacters(searchValue, page);
  }, [page, searchValue]);

  useEffect(() => {
    if (page !== queryPage || searchValue !== queryName) {
      const params = new URLSearchParams({
        page: page.toString(),
      });

      if (searchValue) {
        params.set("name", searchValue);
      }

      router.push(`/?${params.toString()}`);
    }
  }, [page, searchValue, queryPage, queryName, router]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    debouncedSearch(value, 1);
  };

  return (
    <main className="relative flex h-svh max-h-svh flex-col items-center justify-start gap-6 p-12">
      <input
        type="text"
        placeholder="Search by name"
        defaultValue={searchValue}
        onChange={handleSearchChange}
        className="mb-4 rounded border border-gray-300 px-2 py-1"
      />
      {data ? (
        <DataTable
          columns={columns}
          data={data}
          page={page}
          setPage={setPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      ) : (
        <Spinner />
      )}
    </main>
  );
}
