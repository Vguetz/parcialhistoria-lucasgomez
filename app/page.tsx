// app/page.tsx (o donde renderices la escena)
"use client";

import { useState } from "react";
import Scene from "../components/3d/Scene"; // Ajustá tu ruta
import Modal from "../components/ui/Modal";
import { PartKey } from "../lib/answers";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePart, setActivePart] = useState<PartKey | null>(null);

  const handleOpenModal = (part: PartKey) => {
    setActivePart(part);
    setIsModalOpen(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Pasamos la función a la escena para que la dispare a los modelos */}
      <Scene />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        partKey={activePart}
      />
    </main>
  );
}
