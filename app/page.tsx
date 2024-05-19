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
        className="md:ring-offset-opacity-50 md:ring-offset-solid mb-4 w-full rounded border border-gray-300 px-2 py-1 md:mb-0 md:mr-4 md:w-auto md:transform md:rounded-lg md:border-[#97ce4c] md:bg-[#44281d] md:px-4 md:py-2 md:text-[#FAFAF5] md:placeholder-[#97ce4c] md:placeholder-opacity-50 md:ring-2 md:ring-[#97ce4c] md:ring-opacity-50 md:ring-offset-[#97ce4c] md:transition-all md:duration-300 md:ease-in-out md:hover:scale-105 md:focus:border-[#97ce4c] md:focus:outline-none md:active:scale-95"
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
