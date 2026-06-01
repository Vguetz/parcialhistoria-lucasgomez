// app/page.tsx
"use client";

import { useState, useRef } from "react";
import Scene from "../components/3d/Scene";
import Modal from "../components/ui/Modal";
import { PartKey } from "../lib/answers";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePart, setActivePart] = useState<PartKey | null>(null);

  // Estados para la intro, la música y el volumen
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // Empezamos en 20%

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .catch((error) => console.log("Audio bloqueado:", error));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Función para manejar el slider de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;

      // Si el usuario sube el volumen mientras estaba muteado, lo desmuteamos
      if (newVolume > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
      // Opcional: si lo baja a 0, lo consideramos muteado
      if (newVolume === 0 && !isMuted) {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleOpenModal = (part: PartKey) => {
    setActivePart(part);
    setIsModalOpen(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      <audio ref={audioRef} src="/jazz.mp3" loop />

      {/* MARCA DE AGUA / FIRMA FLOTANTE */}
      <div
        className={`absolute bottom-6 left-6 z-[60] flex items-center gap-3 transition-opacity duration-1000 select-none pointer-events-none ${
          started ? "opacity-70" : "opacity-0"
        }`}
      >
        {/* Contenedor de la Foto/Avatar */}
        <div className="w-12 h-12 rounded-full border-2 border-[#b57614]/50 overflow-hidden bg-[#1a1814] flex items-center justify-center shadow-lg">
          {/* Si querés poner tu foto real, borrá el <span> de abajo y descomentá el <img>: */}
          {/* <img src="/tu-foto.jpg" alt="Lucas" className="w-full h-full object-cover" /> */}
          <span className="text-[#b57614] font-black text-xl font-serif">
            L
          </span>
        </div>

        {/* Textos */}
        <div className="font-serif">
          <p className="text-[#b57614] text-sm font-bold tracking-widest uppercase shadow-black drop-shadow-md">
            Lucas
          </p>
          <p className="text-[#d4c8b8] text-xs opacity-90 shadow-black drop-shadow-md">
            Proyecto de Historia
          </p>
        </div>
      </div>

      {/* CONTROLES DE AUDIO FLOTANTES */}
      <div
        className={`absolute bottom-6 right-6 z-[60] transition-opacity duration-1000 flex items-center gap-3 bg-[#1a1814]/80 px-4 py-2 rounded-full border border-[#b57614]/50 backdrop-blur-sm shadow-xl ${
          started ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Slider de volumen */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 md:w-24 accent-[#b57614] cursor-pointer"
          title="Ajustar volumen"
        />

        {/* Botón de mute */}
        <button
          onClick={toggleMute}
          className="text-[#b57614] hover:text-[#fbf1c7] transition-colors flex items-center justify-center cursor-pointer p-2"
          title={isMuted ? "Activar música" : "Mutear música"}
        >
          {isMuted || volume === 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>
      </div>

      {/* TELÓN DE INTRODUCCIÓN */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-[#d4c8b8] font-serif transition-opacity duration-[2000ms] ease-in-out ${
          started ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center max-w-2xl px-6 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-widest uppercase border-b border-[#b57614] pb-4">
            Montevideo
            <span className="block text-3xl md:text-5xl mt-2 text-[#b57614]">
              1904
            </span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mb-12 text-stone-400">
            La República se encuentra dividida. En las calles del interior se
            respira la guerra civil, mientras en la capital se decide el futuro
            del Estado moderno.
          </p>

          <button
            onClick={handleStart}
            className="px-8 py-3 border border-[#b57614] text-[#b57614] hover:bg-[#b57614] hover:text-[#0a0a0a] transition-all duration-300 uppercase tracking-widest text-sm font-bold cursor-pointer"
          >
            Adentrarse en la historia
          </button>
        </div>
      </div>

      <Scene />
    </main>
  );
}
