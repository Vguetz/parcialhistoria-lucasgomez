"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useTexture, Html } from "@react-three/drei";
import { Model } from "./Desk";
import { PartKey, historyAnswers } from "@/lib/answers";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

// ─── Tipos ─────────────────────────────────────────────────────────────────
type OpenItem = "batlle" | "caras" | "eldia" | null;

// ─── Cámara animada con lerp ────────────────────────────────────────────────
function CameraRig({
  targetPos,
  targetLook,
}: {
  targetPos: THREE.Vector3;
  targetLook: THREE.Vector3;
}) {
  const { camera } = useThree();
  const lookRef = useRef(new THREE.Vector3());

  useFrame(() => {
    camera.position.lerp(targetPos, 0.06);
    lookRef.current.lerp(targetLook, 0.06);
    camera.lookAt(lookRef.current);
  });

  return null;
}

// ─── Panel de contenido (fuera del Canvas, overlay puro CSS) ───────────────
function ContentPanel({
  openItem,
  onClose,
}: {
  openItem: OpenItem;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (openItem) {
      setRendered(true);
      // Pequeño delay para que la animación de entrada se vea
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 400);
      return () => clearTimeout(t);
    }
  }, [openItem]);

  if (!rendered || !openItem) return null;

  // ElDia tiene su propio layout especial
  const isElDia = openItem === "eldia";
  const partKey: PartKey | null =
    openItem === "batlle" ? "parte1" : openItem === "caras" ? "parte2" : null;

  return (
    <div
      className={`fixed inset-0 z-50 flex pointer-events-none ${
        isElDia ? "items-center justify-center" : "items-center justify-end"
      }`}
      style={isElDia ? {} : { paddingRight: "clamp(1rem, 4vw, 3rem)" }}
    >
      {/* Backdrop — para El Día es oscuro siempre, para el resto solo en mobile */}
      <div
        className={`absolute inset-0 transition-opacity duration-400 pointer-events-auto ${
          isElDia
            ? `bg-black/80 ${visible ? "opacity-100" : "opacity-0"}`
            : `bg-black/40 md:bg-transparent ${visible ? "opacity-100" : "opacity-0"}`
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
        relative pointer-events-auto
        ${
          isElDia
            ? "w-[95vw] h-[92vh] overflow-hidden" // ← fullscreen para El Día
            : `w-full md:w-[min(520px,45vw)] max-h-[85vh] overflow-y-auto`
        }
        bg-[#fbf1c7] text-[#3c3836]
        rounded shadow-2xl border-2 border-[#b57614]
        font-serif custom-scrollbar
        transition-all duration-400 ease-out
        ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : isElDia
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-0 translate-x-8 pointer-events-none"
        }
      `}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center px-5 py-3 bg-[#fbf1c7]/95 backdrop-blur-md border-b border-[#b57614]/40 z-10">
          <span className="text-xs uppercase tracking-widest text-[#b57614] font-bold">
            {isElDia
              ? "El Día — 1904"
              : partKey === "parte1"
                ? "Parte 1"
                : "Parte 2"}
          </span>
          <button
            onClick={onClose}
            className="text-sm cursor-pointer font-bold font-serif hover:text-[#9d0006] transition-colors px-3 py-1 border border-[#3c3836]/40 rounded hover:border-[#9d0006]"
          >
            Dejar en la mesa ✕
          </button>
        </div>

        {/* El Día: iframe fullscreen */}
        {isElDia && (
          <iframe
            src="/articulo"
            className="w-full border-0"
            style={{ height: "calc(92vh - 52px)" }} // ← altura del panel menos el header
            title="El Día — Edición 1904"
          />
        )}

        {/* Otras partes */}
        {!isElDia && partKey && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-2 border-[#b57614] pb-3">
              {historyAnswers[partKey].titulo}
            </h2>
            <div className="space-y-6 text-base leading-relaxed">
              {historyAnswers[partKey].preguntas.map((item, i) => (
                <div key={i}>
                  <h3 className="font-bold mb-2 italic text-[#9d0006] text-sm md:text-base">
                    {item.q}
                  </h3>
                  <p className="text-justify text-sm md:text-base">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Revista / Caricatura ───────────────────────────────────────────────────
function FloatingItem({
  position,
  rotation = [0, 0, 0],
  texturePath,
  tooltipLabel,
  size,
  isOpen,
  onOpen,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  texturePath: string;
  tooltipLabel: string;
  size: [number, number, number];
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(texturePath);

  useEffect(() => {
    document.body.style.cursor = hovered && !isOpen ? "pointer" : "auto";
  }, [hovered, isOpen]);

  const { pos, rot } = useSpring({
    pos: isOpen ? [0, 5.2, 2.6] : position,
    rot: isOpen
      ? [-Math.PI / 2, 0, 0] // ← gira la cara superior (textura) para mirar a la cámara
      : rotation,
    config: { mass: 1, tension: 80, friction: 22 },
  });

  return (
    <animated.mesh
      position={pos as any}
      rotation={rot as any}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (!isOpen) onOpen();
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        color={isOpen ? "#ffffff" : hovered ? "#ffffff" : "#d4c8b8"}
      />

      {!isOpen && (
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`transition-all duration-300 pointer-events-none select-none ${
              hovered ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"
            }`}
          >
            <div className="bg-[#3c3836] text-[#fbf1c7] px-4 py-2 rounded shadow-xl border border-[#b57614] font-serif text-sm whitespace-nowrap">
              ✦ {tooltipLabel}
            </div>
          </div>
        </Html>
      )}
    </animated.mesh>
  );
}

// ─── Diario El Día ─────────────────────────────────────────────────────────
// ─── Textura procedural para El Día ────────────────────────────────────────
function useElDiaTexture() {
  const texture = useRef<THREE.CanvasTexture | null>(null);

  if (!texture.current) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 720;
    const ctx = canvas.getContext("2d")!;

    // Fondo papel viejo
    ctx.fillStyle = "#f5ead6";
    ctx.fillRect(0, 0, 512, 720);

    // Borde decorativo
    ctx.strokeStyle = "#3c3836";
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 488, 696);
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 472, 680);

    // Cabecera
    ctx.fillStyle = "#3c3836";
    ctx.fillRect(20, 20, 472, 80);

    // Título "El Día"
    ctx.fillStyle = "#f5ead6";
    ctx.font = "bold 52px serif";
    ctx.textAlign = "center";
    ctx.fillText("El Día", 256, 78);

    // Subtítulo
    ctx.fillStyle = "#3c3836";
    ctx.font = "11px serif";
    ctx.fillText("MONTEVIDEO — 1904 — EDICIÓN ESPECIAL", 256, 118);

    // Línea separadora
    ctx.fillRect(20, 125, 472, 3);

    // Columnas simuladas (líneas de texto)
    ctx.fillStyle = "#6b5a45";
    ctx.font = "9px serif";
    const lorem = [
      "La situación política del país",
      "atraviesa momentos de gravedad",
      "sin precedentes. El gobierno de",
      "Batlle y Ordóñez ha convocado...",
      "",
      "Las reformas sociales impulsadas",
      "desde el ejecutivo generan debate",
      "en todos los sectores. El proyecto",
      "de ley de divorcio...",
    ];
    lorem.forEach((line, i) => {
      ctx.fillText(line, 170, 160 + i * 16);
    });

    // Columna izquierda
    const col2 = [
      "GUERRA CIVIL",
      "─────────────",
      "Los enfrentamientos",
      "continúan en el",
      "interior del país.",
      "Saravia avanza con",
      "sus fuerzas hacia",
      "el norte...",
    ];
    ctx.textAlign = "left";
    col2.forEach((line, i) => {
      ctx.font = i === 0 ? "bold 9px serif" : "9px serif";
      ctx.fillText(line, 30, 160 + i * 16);
    });

    // Línea vertical entre columnas
    ctx.fillStyle = "#3c3836";
    ctx.fillRect(140, 140, 1, 200);
    ctx.fillRect(330, 140, 1, 200);

    // Imagen simulada (rectángulo con texto)
    ctx.fillStyle = "#e0d4be";
    ctx.fillRect(30, 360, 452, 180);
    ctx.strokeStyle = "#3c3836";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 360, 452, 180);
    ctx.fillStyle = "#9d8a6e";
    ctx.font = "italic 11px serif";
    ctx.textAlign = "center";
    ctx.fillText("[Fotografía de época]", 256, 455);

    // Pie de página
    ctx.fillStyle = "#3c3836";
    ctx.font = "9px serif";
    ctx.fillText("Precio: 2 centésimos — Año IV — Número 1.247", 256, 680);

    texture.current = new THREE.CanvasTexture(canvas);
  }

  return texture.current;
}

// ─── Diario El Día ─────────────────────────────────────────────────────────
function ElDiaItem({
  position,
  isOpen,
  onOpen,
}: {
  position: [number, number, number];
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const elDiaTexture = useElDiaTexture(); // ← volvé a la textura procedural

  useEffect(() => {
    document.body.style.cursor = hovered && !isOpen ? "pointer" : "auto";
  }, [hovered, isOpen]);

  const { pos, rot } = useSpring({
    pos: isOpen ? [0, 5.2, 2.6] : position,
    rot: isOpen ? [Math.PI / 2, 0, 0] : [0, -Math.PI / 5, 0],
    config: { mass: 1, tension: 80, friction: 22 },
  });

  return (
    <animated.mesh
      position={pos as any}
      rotation={rot as any}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (!isOpen) onOpen();
      }}
    >
      <boxGeometry args={[2.5, 0.02, 3.5]} />
      <meshStandardMaterial
        attach="material-2"
        map={elDiaTexture}
        color={isOpen ? "#ffffff" : hovered ? "#f0e4ce" : "#e8dcc7"}
      />
      <meshStandardMaterial attach="material-0" color="#d4c4a0" />
      <meshStandardMaterial attach="material-1" color="#d4c4a0" />
      <meshStandardMaterial attach="material-3" color="#d4c4a0" />
      <meshStandardMaterial attach="material-4" color="#d4c4a0" />
      <meshStandardMaterial attach="material-5" color="#d4c4a0" />

      {!isOpen && (
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`transition-all duration-300 pointer-events-none select-none ${hovered ? "opacity-100 -translate-y-2" : "opacity-0"}`}
          >
            <div className="bg-[#3c3836] text-[#fbf1c7] px-4 py-2 rounded shadow-xl border border-[#b57614] font-serif text-sm whitespace-nowrap">
              ✦ Leer edición especial de &quot;El Día&quot;
            </div>
          </div>
        </Html>
      )}
    </animated.mesh>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────
export default function Scene() {
  const [openItem, setOpenItem] = useState<OpenItem>(null);

  // Posiciones de los objetos
  const POSITIONS = {
    batlle: [-0.4, 3.7, 0.5] as [number, number, number],
    caras: [1.2, 3.7, 0.2] as [number, number, number],
    eldia: [-2.2, 3.7, -0.8] as [number, number, number],
  };

  const camTarget = new THREE.Vector3(
    0,
    openItem ? 5.8 : 5.5,
    openItem ? 4.8 : 4.5,
  );

  const camLook = new THREE.Vector3(
    0,
    openItem === "eldia" ? 5.2 : openItem ? 4.8 : 3.7,
    openItem === "eldia" ? 2.6 : 0,
  );

  return (
    <>
      <div className="w-full h-screen bg-[#1a1814]">
        <Canvas
          shadows
          camera={{ position: [0, 5.5, 4.5], fov: 65 }}
          onCreated={({ camera }) => camera.lookAt(0, 3.7, 0)}
        >
          <CameraRig targetPos={camTarget} targetLook={camLook} />

          <ambientLight intensity={0.5} />
          <pointLight
            position={[-1, 2, 1]}
            intensity={1.5}
            color="#e8b359"
            castShadow
          />
          <pointLight
            position={[-1, 8, 1]}
            intensity={2.5}
            color="#e8b359"
            castShadow
          />

          <Suspense fallback={null}>
            <Model scale={[8, 8, 8]} position={[0, -3.5, 0]} />

            <FloatingItem
              position={POSITIONS.batlle}
              rotation={[0, Math.PI / 8, 0]}
              texturePath="/batlle-caricatura.png"
              tooltipLabel="Inspeccionar documento (Parte 1)"
              size={[1.2, 0.01, 1.6]}
              isOpen={openItem === "batlle"}
              onOpen={() => setOpenItem("batlle")}
            />

            <FloatingItem
              position={POSITIONS.caras}
              texturePath="/caras-y-caretas.png"
              tooltipLabel="Analizar portada de 1903 (Parte 2)"
              size={[1.5, 0.05, 2]}
              isOpen={openItem === "caras"}
              onOpen={() => setOpenItem("caras")}
            />

            <ElDiaItem
              position={POSITIONS.eldia}
              isOpen={openItem === "eldia"}
              onOpen={() => setOpenItem("eldia")}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Panel de contenido: completamente fuera del Canvas */}
      <ContentPanel openItem={openItem} onClose={() => setOpenItem(null)} />
    </>
  );
}
