import Image from "next/image";
import React from "react";
import type { Game } from "@/types";

type Quantities = { [key: string]: number };

type Props = {
  sourceItems: Game[];
  targetItems: Game[];
  quantities: Quantities;
  prices: Quantities;
  setQuantities: React.Dispatch<React.SetStateAction<Quantities>>;
  setPrices: React.Dispatch<React.SetStateAction<Quantities>>;
  calculateItemTotal: (itemId: string) => number;
  calculateGrandTotal: () => number;
};

export default function ItemsTable({
  sourceItems,
  targetItems,
  quantities,
  prices,
  setQuantities,
  setPrices,
  calculateItemTotal,
  calculateGrandTotal,
}: Props) {
  const allItems = [...sourceItems, ...targetItems];

  return (
    <div className="max-w-6xl mx-auto mt-16">
      <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          📊 Resumo dos Itens
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">ID</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Região</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Quantidade</th>
                <th className="px-6 py-3">Preço (R$)</th>
                <th className="px-6 py-3 rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">{item.id}</td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.region_id === 1 && (
                        <>
                          <Image
                            src="/us.png"
                            alt="US"
                            width={32}
                            height={32}
                          />
                          <span className="text-xs text-gray-700">US</span>
                        </>
                      )}
                      {item.region_id === 4 && (
                        <>
                          <Image
                            src="/jp.png"
                            alt="JP"
                            width={32}
                            height={32}
                          />
                          <span className="text-xs text-gray-700">JP</span>
                        </>
                      )}
                      {!item.region_id && (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        sourceItems.find((s) => s.id === item.id)
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {sourceItems.find((s) => s.id === item.id)
                        ? "Disponível"
                        : "Em Destino"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={quantities[item.id] ?? 1}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: Number(e.target.value),
                        }))
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={prices[item.id] || ""}
                      onChange={(e) =>
                        setPrices((prev) => ({
                          ...prev,
                          [item.id]: Number(e.target.value),
                        }))
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    R$ {calculateItemTotal(item.id).toFixed(2)}
                  </td>
                </tr>
              ))}
              {allItems.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500 italic"
                  >
                    Nenhum item adicionado ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {allItems.length > 0 && (
          <div className="mt-6 flex justify-end">
            <div className="bg-gray-100 px-6 py-4 rounded-lg">
              <span className="text-gray-700 font-medium">Total Geral: </span>
              <span className="text-lg font-bold text-gray-900">
                R$ {calculateGrandTotal().toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
