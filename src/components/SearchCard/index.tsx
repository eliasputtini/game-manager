import { Game } from "@/types";
import React from "react";

interface SearchCardProps {
  card: Game;
  onAdd: (card: Game) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onAdd }) => (
  <div
    className="p-2 size-32 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group relative"
    onClick={() => onAdd(card)}
  >
    <div className="flex flex-col items-center text-center">
      <h4 className="w-32 text-base font-semibold text-gray-800 mb-1 whitespace-normal break-words text-center">
        {card.title}
      </h4>

      <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          +
        </div>
      </div>

      <div className="mt-2">
        <span className="inline-block px-2 py-1 text-xs bg-indigo-200 text-indigo-700 rounded-full">
          {card.category}
        </span>
      </div>
    </div>
  </div>
);

export default SearchCard;
