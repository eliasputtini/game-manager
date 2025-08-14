import { Game } from "@/types";
import React from "react";

interface SearchCardProps {
  card: Game;
  onAdd: (card: Game) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onAdd }) => (
  <div
    className="p-2 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group relative"
    onClick={() => onAdd(card)}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="text-base font-semibold text-gray-800 mb-1">
          {card.title}
        </h4>
      </div>
      <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          +
        </div>
      </div>
    </div>
    <div className="mt-2">
      <span className="inline-block px-2 py-1 text-xs bg-indigo-200 text-indigo-700 rounded-full">
        {card.category}
      </span>
    </div>
  </div>
);

export default SearchCard;
