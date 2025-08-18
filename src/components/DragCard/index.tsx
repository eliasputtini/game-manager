import React from "react";
import Image from "next/image";
import { Game, DraggedItem } from "@/types";

interface DragCardProps {
  item: Game;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, item: Game) => void;
  handleDragEnd: () => void;
  clearDragState: () => void;
  draggedItem: DraggedItem | null;
}

const DragCard: React.FC<DragCardProps> = ({
  item,
  isDragging,
  handleDragStart,
  handleDragEnd,
  clearDragState,
  draggedItem,
}) => (
  <div
    draggable
    onDragStart={(e) => handleDragStart(e, item)}
    onDragEnd={handleDragEnd}
    onMouseDown={() => {
      if (draggedItem && draggedItem.id !== item.id) {
        clearDragState();
      }
    }}
    className={`p-5 bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl cursor-grab select-none shadow-lg transition-all duration-300 border-l-4 font-medium hover:shadow-xl hover:-translate-y-1 active:cursor-grabbing ${
      isDragging ? "opacity-70 rotate-2 scale-105 z-50" : ""
    } ${
      item.id.includes("card1") || item.id.includes("item1")
        ? "border-l-red-400 from-red-50 to-red-100"
        : item.id.includes("card2") || item.id.includes("item2")
        ? "border-l-teal-400 from-teal-50 to-teal-100"
        : "border-l-blue-400 from-blue-50 to-blue-100"
    }`}
    style={{
      zIndex: isDragging ? 1000 : 1,
    }}
  >
    <div className="flex items-start gap-3">
      {item.imageUrl ? (
        <div className="shrink-0 overflow-hidden border border-gray-200 bg-white">
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold mb-1 text-gray-800 pointer-events-none truncate">
            {item.title}
          </h3>
          <div className="shrink-0 size-8">
            {item.region_id === 1 && (
              <Image src="/us.png" alt="US" width={32} height={32} />
            )}
            {item.region_id === 4 && (
              <Image src="/jp.png" alt="JP" width={32} height={32} />
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 pointer-events-none line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  </div>
);

export default DragCard;
