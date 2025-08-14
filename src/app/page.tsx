"use client";

import { useState } from "react";
import Image from "next/image";

import SearchCard from "@/components/SearchCard";
import DragCard from "@/components/DragCard";

export default function Home() {
  // Base de dados de Jogos disponíveis para busca
  const availableJogos = [
    {
      id: "game1",
      title: "🚗 Gran Turismo",
      description:
        "Simulador de corrida realista com dezenas de carros e pistas",
      category: "racing",
    },
    {
      id: "game2",
      title: "🧟 Resident Evil",
      description: "Clássico survival horror com zumbis e tensão constante",
      category: "horror",
    },
    {
      id: "game3",
      title: "🕹️ Metal Gear Solid",
      description: "Jogo de espionagem tático com narrativa cinematográfica",
      category: "stealth",
    },
    {
      id: "game4",
      title: "🐉 Final Fantasy VII",
      description: "RPG épico com história envolvente e batalhas estratégicas",
      category: "rpg",
    },
    {
      id: "game5",
      title: "🧠 Silent Hill",
      description: "Terror psicológico em uma cidade envolta em névoa",
      category: "horror",
    },
    {
      id: "game6",
      title: "🥋 Tekken 3",
      description: "Luta frenética com personagens icônicos e combos insanos",
      category: "fighting",
    },
    {
      id: "game7",
      title: "🦊 Crash Bandicoot",
      description: "Plataforma divertida com um marsupial carismático",
      category: "platform",
    },
    {
      id: "game8",
      title: "🌀 Castlevania: Symphony of the Night",
      description: "Aventura gótica com exploração e ação refinada",
      category: "action",
    },
    {
      id: "game9",
      title: "🏎️ Need for Speed III",
      description: "Corridas urbanas com perseguições policiais intensas",
      category: "racing",
    },
    {
      id: "game10",
      title: "🧙‍♂️ Legend of Dragoon",
      description: "RPG com sistema de combate único e narrativa épica",
      category: "rpg",
    },
  ];

  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOver, setDragOver] = useState("");

  const handleSearch = (query) => {
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
  const addCardToSource = (card) => {
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

  const handleDragStart = (e, item) => {
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

  const handleDragOver = (e, area) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(area);
  };

  const handleDragLeave = (e) => {
    // Melhora a detecção de saída da área
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOver("");
    }
  };

  const handleDrop = (e, targetArea) => {
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
            onDragLeave={(e) => handleDragLeave(e, "source")}
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
            onDragLeave={(e) => handleDragLeave(e, "target")}
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
