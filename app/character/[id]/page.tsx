"use client";

import { Character } from "@/components/table/columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CharacterPageProps {
  params: {
    id: string;
  };
}

const CharacterPage: React.FC<CharacterPageProps> = ({
  params,
}: {
  params: { id: string };
}) => {
  const route = useRouter();

  const [character, setCharacter] = useState<Character>();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHARACTER_API_URL}/${params.id}`,
        );
        const data = await response.json();

        setCharacter(data);
      } catch (error) {
        console.error("Failed to fetch character:", error);
      }
    };

    fetchCharacter();
  }, [params.id]);

  const navigateToHome = () => {
    route.push("/");
  };

  return (
    <div className="flex h-svh max-h-svh flex-col items-center justify-center gap-6 p-12">
      <span
        className="cursor-pointer font-bold text-[#FAFAF5]"
        onClick={() => navigateToHome()}
      >
        BACK TO THE HOME PAGE
      </span>
      <Card className="flex h-full flex-col items-center justify-start overflow-auto">
        <CardHeader className="flex flex-col gap-6">
          <div className="flex w-full items-center justify-center gap-10 text-lg font-bold">
            <CardTitle>{character?.name}</CardTitle>
            <CardDescription>ID: {character?.id}</CardDescription>
          </div>
          <div className="relative m-auto h-40 w-40">
            <Image
              src={character?.image ?? ""}
              alt={character?.name ?? ""}
              fill
              unoptimized
            />
          </div>
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-1 overflow-auto">
          {character?.episode.map((episode) => (
            <div key={episode}>{episode}</div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterPage;
