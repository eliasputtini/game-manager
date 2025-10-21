import Image from "next/image";
import React from "react";
import type { Game } from "@/types";

type Quantities = { [key: string]: number };

type Pkg = { id: string; name: string; items: Game[] };

type Props = {
  sourceItems: Game[];
  targetItems: Game[];
  sourcePackages: Pkg[];
  targetPackages: Pkg[];
  packageFreight: Record<string, number>;
  setPackageFreight: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  packageTax: Record<string, number>;
  setPackageTax: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onDeleteSourcePackage: (pkgId: string) => void;
  onDeleteTargetPackage: (pkgId: string) => void;
  quantities: Quantities;
  prices: Quantities;
  sellingPrices: Quantities;
  setQuantities: React.Dispatch<React.SetStateAction<Quantities>>;
  setPrices: React.Dispatch<React.SetStateAction<Quantities>>;
  setSellingPrices: React.Dispatch<React.SetStateAction<Quantities>>;
  calculateItemTotal: (itemId: string) => number;
  calculateGrandTotal: () => number;
};

export default function ItemsTable({
  sourceItems,
  targetItems,
  sourcePackages,
  targetPackages,
  packageFreight,
  setPackageFreight,
  packageTax,
  setPackageTax,
  onDeleteSourcePackage,
  onDeleteTargetPackage,
  quantities,
  prices,
  sellingPrices,
  setQuantities,
  setPrices,
  setSellingPrices,
  calculateItemTotal,
  calculateGrandTotal,
}: Props) {
  const allItems = [
    ...sourceItems,
    ...targetItems,
    ...sourcePackages.flatMap((p) => p.items),
    ...targetPackages.flatMap((p) => p.items),
  ];

  const renderTable = (
    title: string,
    items: Game[],
    status: "Disponível" | "Em Destino",
    keyProp?: string,
    pkgId?: string
  ) => (
    <div className="mt-8" key={keyProp}>
      <div className="group flex items-center justify-start gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {pkgId && (
          <button
            type="button"
            onClick={() =>
              status === "Disponível"
                ? onDeleteSourcePackage(pkgId)
                : onDeleteTargetPackage(pkgId)
            }
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
            title={
              status === "Disponível"
                ? "Excluir pacote (mantém itens como soltos)"
                : "Excluir pacote do destino (mantém itens como soltos)"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        )}
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            status === "Disponível"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 table-fixed">
          <thead className="text-xs uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3 rounded-tl-lg w-64">Título</th>
              <th className="px-6 py-3 w-28">Categoria</th>
              <th className="px-6 py-3 w-28">Região</th>
              <th className="px-6 py-3 w-28">Quantidade</th>
              <th className="px-6 py-3 w-28 text-right">Preço (R$)</th>
              <th className="px-6 py-3 w-28 text-right">Preço Venda (R$)</th>
              <th className="px-6 py-3 w-28 text-right">Frete (R$)</th>
              <th className="px-6 py-3 w-28 text-right">Imposto (R$)</th>
              <th className="px-6 py-3 rounded-tr-lg w-32 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 truncate">{item.title}</td>
                <td className="px-6 py-4">
                  {item.category === "PS1" || item.category === "PS2" ? (
                    <div className="inline-flex items-center gap-2">
                      <Image
                        src={item.category === "PS1" ? "/ps1.png" : "/ps2.png"}
                        alt={String(item.category)}
                        unoptimized
                        width={32}
                        height={32}
                      />
                      <span className="text-xs text-gray-700">
                        {item.category}
                      </span>
                    </div>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                      {item.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {(item.region_id === 1 || item.region_id === 8) && (
                      <>
                        <Image
                          src="/us.png"
                          alt="US"
                          width={32}
                          height={32}
                          unoptimized
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
                          unoptimized
                        />
                        <span className="text-xs text-gray-700">JP</span>
                      </>
                    )}
                    {!item.region_id && (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="1"
                    value={
                      quantities[item.id] === undefined
                        ? ""
                        : quantities[item.id]
                    }
                    onChange={(e) =>
                      setQuantities((prev) => {
                        const val = e.target.value;
                        const next = { ...prev };
                        if (val === "") {
                          delete next[item.id];
                        } else {
                          next[item.id] = Number(val);
                        }
                        return next;
                      })
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={prices[item.id] || ""}
                    onChange={(e) =>
                      setPrices((prev) => ({
                        ...prev,
                        [item.id]: Number(e.target.value),
                      }))
                    }
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={sellingPrices[item.id] || ""}
                    onChange={(e) =>
                      setSellingPrices((prev) => ({
                        ...prev,
                        [item.id]: Number(e.target.value),
                      }))
                    }
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                  />
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {(() => {
                    // Freight is split equally among items (same weight assumption)
                    let allocatedFreight = 0;
                    if (pkgId) {
                      const freight = packageFreight[pkgId] || 0;
                      const itemCount = items.length || 1;
                      allocatedFreight = freight / itemCount;
                    }
                    return <span>R$ {allocatedFreight.toFixed(2)}</span>;
                  })()}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {(() => {
                    const basePaid = calculateItemTotal(item.id);
                    let allocatedTax = 0;
                    if (pkgId) {
                      const tax = packageTax[pkgId] || 0;
                      const itemsSubtotal = items.reduce(
                        (sum, it) => sum + calculateItemTotal(it.id),
                        0
                      );
                      if (itemsSubtotal > 0 && tax > 0) {
                        allocatedTax = (basePaid / itemsSubtotal) * tax;
                      }
                    }
                    return <span>R$ {allocatedTax.toFixed(2)}</span>;
                  })()}
                </td>
                <td className="px-6 py-4 font-medium text-right whitespace-nowrap">
                  {(() => {
                    const basePaid = calculateItemTotal(item.id);
                    let allocatedTax = 0;
                    let allocatedFreight = 0;
                    if (pkgId) {
                      const tax = packageTax[pkgId] || 0;
                      const itemsSubtotal = items.reduce(
                        (sum, it) => sum + calculateItemTotal(it.id),
                        0
                      );
                      if (itemsSubtotal > 0 && tax > 0) {
                        allocatedTax = (basePaid / itemsSubtotal) * tax;
                      }
                      const freight = packageFreight[pkgId] || 0;
                      const itemCount = items.length || 1;
                      allocatedFreight = freight / itemCount;
                    }
                    return (
                      <>
                        R${" "}
                        {(basePaid + allocatedTax + allocatedFreight).toFixed(
                          2
                        )}
                      </>
                    );
                  })()}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  Nenhum item neste grupo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {typeof pkgId === "string" && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">➡️ Frete:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={
                    packageFreight[pkgId] === undefined
                      ? ""
                      : packageFreight[pkgId]
                  }
                  onChange={(e) =>
                    setPackageFreight((prev) => {
                      const val = e.target.value;
                      const next = { ...prev };
                      if (val === "") {
                        delete next[pkgId];
                      } else {
                        next[pkgId] = Number(val);
                      }
                      return next;
                    })
                  }
                  className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">🧾 Imposto:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={
                    packageTax[pkgId] === undefined ? "" : packageTax[pkgId]
                  }
                  onChange={(e) =>
                    setPackageTax((prev) => {
                      const val = e.target.value;
                      const next = { ...prev };
                      if (val === "") {
                        delete next[pkgId];
                      } else {
                        next[pkgId] = Number(val);
                      }
                      return next;
                    })
                  }
                  className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-800">
            <p className="mb-1 flex justify-between">
              <span className="font-medium mr-1">➡️ Frete:</span>
              <span className="text-gray-900 font-semibold">{`R$ ${(
                packageFreight[pkgId] || 0
              ).toFixed(2)}`}</span>
            </p>
            <p className="mb-1 flex justify-between">
              <span className="font-medium mr-1">🧾 Imposto:</span>
              <span className="text-gray-900 font-semibold">{`R$ ${(
                packageTax[pkgId] || 0
              ).toFixed(2)}`}</span>
            </p>
            <p className="mb-1 flex justify-between">
              <span className="font-medium mr-1">💿 Subtotal Itens:</span>
              <span className="text-gray-900 font-semibold">
                {`R$ ${items
                  .reduce((sum, it) => sum + calculateItemTotal(it.id), 0)
                  .toFixed(2)}`}
              </span>
            </p>
            <p>
              <span className="font-medium mr-1">➡️ Subtotal Pacote:</span>
              <span className="text-gray-900 font-semibold">
                {(() => {
                  const itemsSubtotal = items.reduce(
                    (sum, it) => sum + calculateItemTotal(it.id),
                    0
                  );
                  const freight = packageFreight[pkgId] || 0;
                  const tax = packageTax[pkgId] || 0;
                  return `R$ ${(itemsSubtotal + freight + tax).toFixed(2)}`;
                })()}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto mt-16">
      <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          📊 Gastos por Pacotes
        </h2>

        {/* Tabelas para Itens Soltos */}
        {sourceItems.length > 0 &&
          renderTable("Itens soltos (Disponíveis)", sourceItems, "Disponível")}
        {targetItems.length > 0 &&
          renderTable("Itens soltos (Destino)", targetItems, "Em Destino")}

        {/* Tabelas por Pacote (Origem) */}
        {sourcePackages.map((pkg) =>
          renderTable(`${pkg.name}`, pkg.items, "Disponível", pkg.id, pkg.id)
        )}

        {/* Tabelas por Pacote (Destino) */}
        {targetPackages.map((pkg) =>
          renderTable(`${pkg.name}`, pkg.items, "Em Destino", pkg.id, pkg.id)
        )}

        {allItems.length > 0 && (
          <div className="mt-6 flex justify-end">
            <div className="bg-gray-100 px-6 py-4 rounded-lg">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-gray-700 font-medium mr-1">Lucro:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {(() => {
                      const sellingTotal = allItems.reduce((sum, it) => {
                        const qty = quantities[it.id] ?? 1;
                        const sell = sellingPrices[it.id] || 0;
                        return sum + qty * sell;
                      }, 0);
                      const profit = sellingTotal - calculateGrandTotal();
                      return `R$ ${profit.toFixed(2)}`;
                    })()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium mr-1">
                    Gasto Geral:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    R$ {calculateGrandTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
