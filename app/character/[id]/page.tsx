"use client";

import Spinner from "@/components/spinner/spinner";
import { Character } from "@/components/table/columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CharacterPageProps {
  params: {
    id: string;
  };
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

const CharacterPage: React.FC<CharacterPageProps> = ({ params }) => {
  const route = useRouter();

  const [character, setCharacter] = useState<Character>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/character/${params.id}`,
        );
        const data = await response.json();

        setCharacter(data);
      } catch (error) {
        console.error("Failed to fetch character:", error);
      }
    };

    fetchCharacter();
  }, [params.id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (character?.episode.length) {
        const episodeIds = character.episode
          .map((e) => {
            const parts = e.split("/");
            return parts[parts.length - 1];
          })
          .join(",");

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/episode/${episodeIds}`,
          );
          const data = await response.json();
          setEpisodes(Array.isArray(data) ? data : [data]);
        } catch (error) {
          console.error("Failed to fetch episodes:", error);
        }
      }
    };

    fetchEpisodes();
  }, [character]);

  const navigateToHome = () => {
    route.push("/");
  };

  const characterInfo = [
    { label: "ID", value: character?.id },
    { label: "Name", value: character?.name },
    { label: "Species", value: character?.species },
    { label: "Status", value: character?.status },
    { label: "Gender", value: character?.gender },
    { label: "Origin", value: character?.origin?.name },
    { label: "Location", value: character?.location?.name },
    { label: "Type", value: character?.type },
  ];

  return (
    <div className="flex h-svh max-h-svh flex-col items-center justify-center gap-6 overflow-auto p-6 md:p-12">
      <span
        className="cursor-pointer font-bold text-[#FAFAF5]"
        onClick={() => navigateToHome()}
      >
        BACK TO THE HOME PAGE
      </span>
      <Card className="flex h-full flex-col items-center justify-start gap-3 overflow-auto border border-[#97ce4c] bg-[#44281d] p-6 text-[#FAFAF5] md:gap-10">
        <CardHeader className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center md:gap-10">
          <div className="flex flex-1 flex-col gap-1">
            {characterInfo.map(
              (info) =>
                info.value && (
                  <div
                    key={info.label}
                    className="flex justify-between gap-5 font-bold"
                  >
                    <span>{info.label}:</span>
                    <span className="font-normal">{info.value}</span>
                  </div>
                ),
            )}
          </div>
          {character && (
            <div className="relative m-auto flex h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#97ce4c] md:h-56 md:w-56">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-3 overflow-auto">
          {episodes.length ? (
            episodes.map((episode) => (
              <div key={episode.id}>
                {episode.episode}: {episode.name} ({episode.air_date})
              </div>
            ))
          ) : (
            <Spinner />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterPage;
