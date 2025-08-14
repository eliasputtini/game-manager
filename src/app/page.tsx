"use client";

import { useState } from "react";
import Image from "next/image";
import { Game, DraggedItem } from "@/types";

import SearchCard from "@/components/SearchCard";
import DragCard from "@/components/DragCard";

export default function Home() {
  // Type the availableJogos array
  const availableJogos: Game[] = [
    {
      id: "game3",
      title: "🕹️ Metal Gear Solid",
      description: "Jogo de espionagem tático com narrativa cinematográfica",
      category: "stealth",
    },
    {
      id: "game11",
      title: "🌴 GTA Vice City JP",
      description:
        "Versão japonesa do icônico jogo de mundo aberto em Vice City",
      category: "action",
    },
    {
      id: "game12",
      title: "🏙️ GTA 3 JP",
      description: "Versão japonesa do clássico que definiu o gênero sandbox",
      category: "action",
    },
    {
      id: "game13",
      title: "🏜️ GTA San Andreas JP",
      description: "Versão japonesa da saga de CJ em San Andreas",
      category: "action",
    },
    {
      id: "game14",
      title: "🌴 GTA Vice City",
      description: "Exploração e ação nos anos 80 em Vice City",
      category: "action",
    },
    {
      id: "game15",
      title: "🏙️ GTA 3",
      description: "O jogo que revolucionou o mundo aberto 3D",
      category: "action",
    },
    {
      id: "game16",
      title: "🏜️ GTA San Andreas",
      description: "Aventuras em Los Santos, San Fierro e Las Venturas",
      category: "action",
    },
    {
      id: "game17",
      title: "🎯 Hitman",
      description: "Infiltração e assassinatos estratégicos como Agente 47",
      category: "stealth",
    },
    {
      id: "game18",
      title: "😈 Devil May Cry JP",
      description: "Versão japonesa do hack and slash estiloso de Dante",
      category: "action",
    },
    {
      id: "game19",
      title: "🤖 Ratchet & Clank (4 jogos) JP",
      description: "Coleção japonesa com quatro aventuras de ação e humor",
      category: "platform",
    },
    {
      id: "game20",
      title: "🏺 Tomb Raider PS1",
      description: "Aventura clássica de exploração com Lara Croft",
      category: "adventure",
    },
    {
      id: "game21",
      title: "🏁 CTR Crash Corrida PS1",
      description: "Corrida divertida com personagens de Crash Bandicoot",
      category: "racing",
    },
    {
      id: "game22",
      title: "🥷 Naruto (2 jogos) JP PS2",
      description: "Dois jogos japoneses de luta e aventura do ninja Naruto",
      category: "fighting",
    },
    {
      id: "game23",
      title: "🎖️ Medal of Honor PS2",
      description: "Ação militar intensa na Segunda Guerra Mundial",
      category: "shooter",
    },
    {
      id: "game24",
      title: "🎸 Guitar Hero III: Legends of Rock",
      description: "Toque solos lendários neste jogo musical",
      category: "music",
    },
    {
      id: "game25",
      title: "🎖️ Medal of Honor: Frontline",
      description: "Campanha épica da Segunda Guerra em missões históricas",
      category: "shooter",
    },
    {
      id: "game26",
      title: "🌴 Grand Theft Auto: Vice City",
      description: "Ação e crime na ensolarada Vice City",
      category: "action",
    },
    {
      id: "game27",
      title: "🏜️ Grand Theft Auto: San Andreas",
      description: "Missões e caos no maior mundo aberto da série",
      category: "action",
    },
    {
      id: "game28",
      title: "🏍️ ATV Offroad Fury 2",
      description: "Corridas radicais de quadriciclo em terrenos off-road",
      category: "racing",
    },
    {
      id: "game29",
      title: "🏀 NBA 2K3",
      description: "Simulação realista de basquete com jogadores da NBA",
      category: "sports",
    },
    {
      id: "game30",
      title: "🎩 Mafia",
      description: "História imersiva de crime organizado nos anos 30",
      category: "action",
    },
    {
      id: "game31",
      title: "🛡️ Warriors of Might and Magic",
      description: "Aventura de fantasia com batalhas e magia",
      category: "rpg",
    },
    {
      id: "game32",
      title: "🛹 Tony Hawk's American Wasteland",
      description: "Skate livre em um mundo aberto repleto de desafios",
      category: "sports",
    },
  ];

  const [sourceItems, setSourceItems] = useState<Game[]>([]);
  const [targetItems, setTargetItems] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOver, setDragOver] = useState<string>("");

  // Add these new state variables at the top with other useState declarations
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = availableJogos.filter((card) => {
      const isAlreadyAdded = [...sourceItems, ...targetItems].some(
        (item) => item.id === card.id
      );
      const matchesQuery =
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase()) ||
        card.category.toLowerCase().includes(query.toLowerCase());
      return !isAlreadyAdded && matchesQuery;
    });

    setSearchResults(filtered);
  };

  // Função para adicionar card da busca aos itens disponíveis
  const addCardToSource = (card: Game) => {
    setSourceItems((prev) => [...prev, card]);
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
    const quantity = quantities[itemId] || 0;
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
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            🔍 Buscar Jogos
          </h2>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Digite para buscar Jogos (ex: estratégia, inovação, design...)"
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
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Quantidade</th>
                  <th className="px-6 py-3">Preço (R$)</th>
                  <th className="px-6 py-3 rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...sourceItems, ...targetItems].map((item) => (
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
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          sourceItems.find((source) => source.id === item.id)
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {sourceItems.find((source) => source.id === item.id)
                          ? "Disponível"
                          : "Em Destino"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        value={quantities[item.id] || ""}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [item.id]: Number(e.target.value),
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
                        value={prices[item.id] || ""}
                        onChange={(e) =>
                          setPrices({
                            ...prices,
                            [item.id]: Number(e.target.value),
                          })
                        }
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">
                      R$ {calculateItemTotal(item.id).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {sourceItems.length === 0 && targetItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500 italic"
                    >
                      Nenhum item adicionado ainda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Section */}
          {(sourceItems.length > 0 || targetItems.length > 0) && (
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
