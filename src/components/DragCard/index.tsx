import React from "react";

const DragCard = ({
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
        className={`p-5 bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl cursor-grab select-none shadow-lg transition-all duration-300 border-l-4 font-medium hover:shadow-xl hover:-translate-y-1 active:cursor-grabbing ${isDragging ? "opacity-70 rotate-2 scale-105 z-50" : ""
            } ${item.id.includes("card1") || item.id.includes("item1") ? "border-l-red-400 from-red-50 to-red-100" :
                item.id.includes("card2") || item.id.includes("item2") ? "border-l-teal-400 from-teal-50 to-teal-100" :
                    "border-l-blue-400 from-blue-50 to-blue-100"
            }`}
        style={{
            zIndex: isDragging ? 1000 : 1
        }}
    >
        <h3 className="text-lg font-semibold mb-2 text-gray-800 pointer-events-none">{item.title}</h3>
        <p className="text-sm text-gray-600 pointer-events-none">{item.description}</p>
    </div>
);

export default DragCard;