import { Game } from "@/types";
import React from "react";
import Image from "next/image";

interface SearchCardProps {
  card: Game;
  onAdd: (card: Game) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onAdd }) => (
  <button
    type="button"
    onClick={() => onAdd(card)}
    className="group relative size-32 overflow-hidden border border-indigo-200 bg-white cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    title={card.title}
  >
    {card.imageUrl ? (
      <Image
        src={card.imageUrl}
        alt={card.title}
        fill
        sizes="128px"
        className="object-cover"
        priority={false}
      />
    ) : (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <span className="text-xs text-indigo-500 px-2 text-center">
          No Image
        </span>
      </div>
    )}

    {/* Plus overlay */}
    <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        +
      </div>
    </div>
  </button>
);

export default SearchCard;
