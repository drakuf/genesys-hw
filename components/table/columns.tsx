"use client";

import { ColumnDef } from "@tanstack/react-table";

export interface ApiResponse<Character> {
  info: PageInfo;
  results: Character[];
}

export interface PageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Character {
  id: string;
  image: string;
  name: string;
  species: string;
  status: string;
  episode: string[];
}

export const columns: ColumnDef<Character>[] = [
  {
    accessorKey: "id",
    header: "ID",
    maxSize: 75,
  },
  {
    accessorKey: "image",
    header: "Avatar",
    maxSize: 75,
  },
  {
    accessorKey: "name",
    header: "Name",
    minSize: 200,
  },
  {
    accessorKey: "species",
    header: "Species",
    minSize: 125,
  },
  {
    accessorKey: "status",
    header: "Status",
    minSize: 125,
  },
];
