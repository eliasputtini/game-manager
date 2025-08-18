"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Game, DraggedItem } from "@/types";
import {
  searchGamesByName,
  convertGamesDBToGame,
  type GamesDBGame,
} from "@/services/gamesdb";

import SearchCard from "@/components/SearchCard";
import DragCard from "@/components/DragCard";
import ItemsTable from "@/components/ItemsTable";

export default function Home() {
  // Searches now use the external API only; local availableJogos removed

  const [sourceItems, setSourceItems] = useState<Game[]>([]);
  const [targetItems, setTargetItems] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOver, setDragOver] = useState<string>("");

  // Add these new state variables at the top with other useState declarations
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  // Debounce state
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Platform filter toggles: PS1 (10) and PS2 (11)
  const [includePS1, setIncludePS1] = useState<boolean>(true);
  const [includePS2, setIncludePS2] = useState<boolean>(false);
  const US_REGION_ID = 1;
  const JP_REGION_ID = 4;
  const [includeUS, setIncludeUS] = useState<boolean>(true);
  const [includeJP, setIncludeJP] = useState<boolean>(false);

  // Refs to avoid effect re-running on list changes
  const sourceItemsRef = useRef<Game[]>(sourceItems);
  const targetItemsRef = useRef<Game[]>(targetItems);
  const includePS1Ref = useRef<boolean>(includePS1);
  const includePS2Ref = useRef<boolean>(includePS2);
  const includeUSRef = useRef<boolean>(includeUS);
  const includeJPRef = useRef<boolean>(includeJP);
  useEffect(() => {
    sourceItemsRef.current = sourceItems;
  }, [sourceItems]);
  useEffect(() => {
    targetItemsRef.current = targetItems;
  }, [targetItems]);
  useEffect(() => {
    includePS1Ref.current = includePS1;
  }, [includePS1]);
  useEffect(() => {
    includePS2Ref.current = includePS2;
  }, [includePS2]);
  useEffect(() => {
    includeUSRef.current = includeUS;
  }, [includeUS]);
  useEffect(() => {
    includeJPRef.current = includeJP;
  }, [includeJP]);

  // Debounce effect: wait after user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 1000);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Perform the API search
  const performSearch = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResults([]);
      return;
    }

    try {
      // Decide platforms and regions based on toggles
      const selectedPlatforms: (number | undefined)[] =
        includePS1Ref.current && includePS2Ref.current
          ? [10, 11]
          : includePS1Ref.current
          ? [10]
          : includePS2Ref.current
          ? [11]
          : [undefined];

      const selectedRegions: (number | undefined)[] =
        includeUSRef.current && includeJPRef.current
          ? [US_REGION_ID, JP_REGION_ID]
          : includeUSRef.current
          ? [US_REGION_ID]
          : includeJPRef.current
          ? [JP_REGION_ID]
          : [undefined];

      // Build all combinations; if both arrays are [undefined], we'll get a single undefined/undefined call
      const tasks: Promise<GamesDBGame[]>[] = [];
      for (const plat of selectedPlatforms) {
        for (const reg of selectedRegions) {
          tasks.push(searchGamesByName(query, plat, reg));
        }
      }
      const results = await Promise.all(tasks);
      // flatten and dedupe by id
      const byId: Record<number, GamesDBGame> = {};
      results.flat().forEach((g) => {
        byId[g.id] = g;
      });
      const apiResults: GamesDBGame[] = Object.values(byId);

      const convertedGames = apiResults.map(convertGamesDBToGame);
      const filtered = convertedGames.filter((card) => {
        const isAlreadyAdded = [
          ...sourceItemsRef.current,
          ...targetItemsRef.current,
        ].some((item) => item.id === card.id);
        return !isAlreadyAdded;
      });
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching games:", error);
      setSearchResults([]);
    }
  }, []);

  // Trigger search when debouncedQuery changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Trigger search when platform or region toggles change (using current debounced query)
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [
    includePS1,
    includePS2,
    includeUS,
    includeJP,
    debouncedQuery,
    performSearch,
  ]);

  // Função para adicionar card da busca aos itens disponíveis
  const addCardToSource = (card: Game) => {
    setSourceItems((prev) => [...prev, card]);
    // Define quantidade padrão como 1 se ainda não existir
    setQuantities((prev) => ({
      ...prev,
      [card.id]: prev[card.id] ?? 1,
    }));
    // Remove da busca após adicionar
    setSearchResults((prev) => prev.filter((item) => item.id !== card.id));
    // Limpa a busca se não houver mais resultados
    if (searchResults.length === 1) {
      setSearchQuery("");
    }
  };

  // Função para limpar o estado de drag
  const clearDragState = () => {
    setDraggedItem(null);
    setDragOver("");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Game) => {
    // Pequeno delay para garantir que o drag iniciou corretamente
    setTimeout(() => {
      setDraggedItem(item);
    }, 0);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
  };

  const handleDragEnd = () => {
    // Força a limpeza do estado após um pequeno delay
    setTimeout(clearDragState, 100);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, area: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(area);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Melhora a detecção de saída da área
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOver("");
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetArea: string
  ) => {
    e.preventDefault();
    clearDragState();

    const draggedId = e.dataTransfer.getData("text/plain");
    const item = [...sourceItems, ...targetItems].find(
      (item) => item.id === draggedId
    );

    if (!item) return;

    if (targetArea === "source") {
      // Move para área de origem
      if (targetItems.find((i) => i.id === item.id)) {
        setTargetItems((prev) => prev.filter((i) => i.id !== item.id));
        setSourceItems((prev) => [...prev, item]);
      }
    } else if (targetArea === "target") {
      // Move para área de destino
      if (sourceItems.find((i) => i.id === item.id)) {
        setSourceItems((prev) => prev.filter((i) => i.id !== item.id));
        setTargetItems((prev) => [...prev, item]);
      }
    }
  };

  const calculateItemTotal = (itemId: string) => {
    const quantity = quantities[itemId] ?? 1;
    const price = prices[itemId] || 0;
    return quantity * price;
  };

  const calculateGrandTotal = () => {
    return [...sourceItems, ...targetItems].reduce((total, item) => {
      return total + calculateItemTotal(item.id);
    }, 0);
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <Image
          className="mx-auto mb-6"
          src="/PlayStation.png"
          alt="PS logo"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Controle de Estoque
        </h1>
        <p className="text-gray-600">
          Busque e adicione Jogos, depois arraste entre as seções
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              🔍 Buscar Jogos
            </h2>
            <div className="flex flex-col items-end gap-2">
              {/* Region flags */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIncludeUS((v) => !v)}
                  className={`rounded-md p-0.5 transition ${
                    includeUS ? "opacity-100" : "opacity-50"
                  }`}
                  title="Toggle USA region (region_id 1)"
                >
                  <Image
                    src="/us.png"
                    alt="United States flag"
                    width={32}
                    height={32}
                    priority={false}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeJP((v) => !v)}
                  className={`rounded-md p-0.5 transition ${
                    includeJP ? "opacity-100" : "opacity-50"
                  }`}
                  title="Toggle Japan region"
                >
                  <Image
                    src="/jp.png"
                    alt="Japan flag"
                    width={32}
                    height={32}
                    priority={false}
                  />
                </button>
              </div>
              {/* Platform toggles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIncludePS1((v) => !v)}
                  className={`px-3 py-1 rounded-lg border text-sm transition ${
                    includePS1
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  title="Toggle PS1 (platform 10)"
                >
                  PS1
                </button>
                <button
                  type="button"
                  onClick={() => setIncludePS2((v) => !v)}
                  className={`px-3 py-1 rounded-lg border text-sm transition ${
                    includePS2
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  title="Toggle PS2 (platform 11)"
                >
                  PS2
                </button>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite para buscar Jogos (ex: Dino Crisis, Resident Evil, etc.)"
              className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-3">
                {searchResults.length} card
                {searchResults.length !== 1 ? "s" : ""} encontrado
                {searchResults.length !== 1 ? "s" : ""}:
              </p>
              <div className="flex gap-2 p-2">
                {searchResults.map((card) => (
                  <SearchCard
                    key={card.id}
                    card={card}
                    onAdd={addCardToSource}
                  />
                ))}
              </div>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="text-center text-gray-500 italic py-8">
              Nenhum card encontrado para &quot;{searchQuery}&quot;
            </div>
          )}

          {!searchQuery && (
            <div className="text-center text-gray-500 italic py-4">
              Digite algo para buscar Jogos disponíveis
            </div>
          )}
        </div>
      </div>

      {/* Drag and Drop Areas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Area */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 border-l-4 border-green-500 pl-4">
            📦 Itens Disponíveis
            <span className="bg-gray-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs ml-2">
              {sourceItems.length}
            </span>
          </h2>

          <div
            className={`min-h-64 border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
              dragOver === "source"
                ? "border-green-400 bg-green-50 scale-102"
                : "border-gray-300"
            }`}
            onDragOver={(e) => handleDragOver(e, "source")}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e, "source")}
          >
            <div className="space-y-4">
              {sourceItems.map((item) => (
                <DragCard
                  key={item.id}
                  item={item}
                  isDragging={draggedItem?.id === item.id}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  clearDragState={clearDragState}
                  draggedItem={draggedItem}
                />
              ))}
              {sourceItems.length === 0 && (
                <div className="text-center text-gray-500 italic mt-12">
                  Nenhum card adicionado ainda.
                  <br />
                  <span className="text-sm">
                    Use a busca acima para encontrar e adicionar Jogos
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Target Area */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-4">
            🎯 Área de Destino
            <span className="bg-gray-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs ml-2">
              {targetItems.length}
            </span>
          </h2>

          <div
            className={`min-h-64 border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
              dragOver === "target"
                ? "border-blue-400 bg-blue-50 scale-102"
                : "border-gray-300"
            }`}
            onDragOver={(e) => handleDragOver(e, "target")}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e, "target")}
          >
            <div className="space-y-4">
              {targetItems.map((item) => (
                <DragCard
                  key={item.id}
                  item={item}
                  isDragging={draggedItem?.id === item.id}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  clearDragState={clearDragState}
                  draggedItem={draggedItem}
                />
              ))}
              {targetItems.length === 0 && (
                <div className="text-center text-gray-500 italic mt-12">
                  Arraste os itens aqui
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <ItemsTable
        sourceItems={sourceItems}
        targetItems={targetItems}
        quantities={quantities}
        prices={prices}
        setQuantities={setQuantities}
        setPrices={setPrices}
        calculateItemTotal={calculateItemTotal}
        calculateGrandTotal={calculateGrandTotal}
      />

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-16 flex gap-6 flex-wrap items-center justify-center text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-800"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-800"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-800"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
