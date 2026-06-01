// components/ui/Modal.tsx
import { historyAnswers, PartKey } from "../../lib/answers";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  partKey: PartKey | null;
}

export default function Modal({ isOpen, onClose, partKey }: ModalProps) {
  // Prevenir scroll en el fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !partKey) return null;

  const content = historyAnswers[partKey];

  return (
    // Backdrop con blur para que el escritorio 3D se vea de fondo borroso
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
      {/* El "Papel" del documento */}
      <div className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-[#fbf1c7] text-[#3c3836] rounded shadow-2xl border-2 border-[#b57614] custom-scrollbar">
        {/* Botón de cierre pegajoso */}
        <div className="sticky top-0 right-0 flex justify-end p-4 bg-[#fbf1c7]/90 backdrop-blur-md border-b border-[#b57614]/30">
          <button
            onClick={onClose}
            className="text-xl cursor-pointer font-bold font-serif hover:text-[#9d0006] transition-colors px-4 py-1 border border-[#3c3836] rounded"
          >
            Cerrar Archivo
          </button>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-4xl font-black mb-8 border-b-2 border-[#b57614] pb-4 font-serif">
            {content.titulo}
          </h2>

          <div className="space-y-8 font-serif text-lg leading-relaxed">
            {content.preguntas.map((item, index) => (
              <div key={index}>
                <h3 className="font-bold mb-3 italic text-[#9d0006]">
                  {item.q}
                </h3>
                <p className="text-justify">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
