"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  useTexture,
  Html,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Model } from "./Desk";
import { PartKey, historyAnswers } from "@/lib/answers";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

// ─── Tipos ─────────────────────────────────────────────────────────────────
type OpenItem =
  | "batlle"
  | "caras"
  | "eldia"
  | "parte3"
  | "parte4"
  | "fuentes"
  | null;

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
    openItem === "batlle"
      ? "parte1"
      : openItem === "caras"
        ? "parte2"
        : openItem === "parte3"
          ? "parte3"
          : openItem === "parte4"
            ? "parte4"
            : openItem === "fuentes"
              ? "fuentes"
              : null; // <-- Agregamos esta línea

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
                  <p className="text-justify text-sm md:text-base whitespace-pre-wrap">
                    {item.a}
                  </p>
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

function Room() {
  // 1. Cargamos las texturas (las imágenes deben estar en tu carpeta /public)
  const paredTextura = useTexture("/pared-madera.jpg");
  const pisoTextura = useTexture("/piso-madera.webp");

  // 2. Configuramos la pared para que la textura se repita y no se estire
  paredTextura.wrapS = THREE.RepeatWrapping; // Repetición horizontal
  paredTextura.wrapT = THREE.RepeatWrapping; // Repetición vertical
  paredTextura.repeat.set(8, 4); // Se repite 8 veces a lo ancho, 4 a lo alto

  // 3. Configuramos el piso con su propia escala de repetición
  pisoTextura.wrapS = THREE.RepeatWrapping;
  pisoTextura.wrapT = THREE.RepeatWrapping;
  pisoTextura.repeat.set(10, 10);

  return (
    <group>
      {/* PISO */}
      <mesh
        position={[0, -3.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        {/* Reemplazamos el 'color' por 'map' para aplicar la imagen */}
        <meshStandardMaterial map={pisoTextura} roughness={0.8} />
      </mesh>

      {/* PARED DE FONDO */}
      <mesh position={[0, 4.5, -8]} receiveShadow>
        <boxGeometry args={[30, 16, 0.5]} />
        <meshStandardMaterial map={paredTextura} roughness={0.85} />
      </mesh>

      {/* PARED LATERAL (Izquierda) */}
      <mesh
        position={[-15, 4.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[30, 16, 0.5]} />
        <meshStandardMaterial map={paredTextura} roughness={0.85} />
      </mesh>

      {/* NUEVA: PARED LATERAL (Derecha) */}
      <mesh
        position={[15, 4.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[30, 16, 0.5]} />
        <meshStandardMaterial map={paredTextura} roughness={0.85} />
      </mesh>

      {/* ZÓCALOS (Podés dejarlos con color sólido para generar contraste) */}
      <mesh position={[0, -3.2, -7.7]} receiveShadow>
        <boxGeometry args={[30, 0.6, 0.1]} />
        <meshStandardMaterial color="#140b05" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ─── Libreta (Parte 3) ──────────────────────────────────────────────────────
function useLibretaTexture() {
  const texture = useRef<THREE.CanvasTexture | null>(null);
  if (!texture.current) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Fondo amarillento (papel avejentado)
    ctx.fillStyle = "#ebdcb3";
    ctx.fillRect(0, 0, 512, 512);

    // Margen rojo
    ctx.strokeStyle = "#c96565";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(80, 512);
    ctx.stroke();

    // Renglones azules
    ctx.strokeStyle = "#80a5c2";
    ctx.lineWidth = 1.5;
    for (let i = 80; i < 512; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Texto de apunte
    ctx.fillStyle = "#2c2a26";
    ctx.font = "italic 28px serif";
    ctx.fillText("Apuntes: Periodización", 100, 65);
    ctx.font = "italic 18px serif";
    ctx.fillText("- Etapa 1: Pacificación (1903-04)", 100, 105);
    ctx.fillText("- Etapa 2: Estado Moderno (1905+)", 100, 135);

    texture.current = new THREE.CanvasTexture(canvas);
  }
  return texture.current;
}

function LibretaItem({ position, isOpen, onOpen }: any) {
  const [hovered, setHovered] = useState(false);
  const tex = useLibretaTexture();
  useEffect(() => {
    document.body.style.cursor = hovered && !isOpen ? "pointer" : "auto";
  }, [hovered, isOpen]);
  const { pos, rot } = useSpring({
    pos: isOpen ? [0, 5.2, 2.6] : position,
    rot: isOpen ? [-Math.PI / 2, 0, 0] : [0, 0.3, 0],
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
      <boxGeometry args={[1.2, 0.08, 1.5]} />
      <meshStandardMaterial
        map={tex}
        color={hovered && !isOpen ? "#ffffff" : "#ebdcb3"}
      />
      {!isOpen && (
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`transition-all duration-300 pointer-events-none select-none ${hovered ? "opacity-100 -translate-y-2" : "opacity-0"}`}
          >
            <div className="bg-[#3c3836] text-[#fbf1c7] px-4 py-2 rounded border border-[#b57614] font-serif text-sm">
              ✦ Leer Apuntes (Parte 3)
            </div>
          </div>
        </Html>
      )}
    </animated.mesh>
  );
}

// ─── Carta de Reflexión (Parte 4) ───────────────────────────────────────────

function useCartaTexture() {
  const texture = useRef<THREE.CanvasTexture | null>(null);

  if (!texture.current) {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;

    // Papel blanco roto / elegante
    ctx.fillStyle = "#fcf9f2";
    ctx.fillRect(0, 0, 400, 600);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 24px serif";
    ctx.fillText("Reflexión Final", 40, 60);
    ctx.fillRect(40, 70, 160, 2); // Línea subrayada

    // Usamos serif en 14px para que sea legible pero ocupe menos ancho
    ctx.font = "14px serif";

    // El texto dividido manualmente para forzar los saltos de línea
    const text = [
      "Para la parte creativa me mandé a programar",
      "de cero este entorno 3D interactivo para",
      "simular el escritorio de 1904. Lo que más",
      "me costó, fuera del código en sí, fue",
      "escribir la editorial del diario 'El Día'.",
      "Ponerme en la cabeza de un batllista de",
      "esa época y tratar de copiar ese tono",
      "sobrador de 'somos la civilización contra",
      "lo peor', sin que sonara como una persona",
      "de hoy, fue re jodido.",
      "",
      "Y sobre lo que aprendí... me di cuenta de",
      "que la guerra de 1904 no era un simple",
      "clásico de fútbol de Blancos contra",
      "Colorados por ver quién ganaba. Era",
      "literalmente el choque de dos mundos que",
      "no podían convivir más, el Montevideo",
      "moderno y centralizado, contra el interior",
      "rural de los caudillos que querían seguir",
      "haciendo la suya. Y la verdad que del",
      "parcial en si, me gusto la libertad",
      "creativa que nos diste para poder hacer",
      "algo como este proyecto, ya que compensa",
      "un poco mi poco pensamiento filosofico de",
      "reflexion y me permite mostrar lo que",
      "aprendí de una forma mas divertida y",
      "original.",
    ];

    // Cambiamos el multiplicador a 18 para achicar el interlineado
    // y asegurar que las 27 líneas entren en los 600px de altura de la hoja
    text.forEach((line, i) => ctx.fillText(line, 40, 120 + i * 18));

    texture.current = new THREE.CanvasTexture(canvas);
  }
  return texture.current;
}

// ─── Libro de Fuentes (Bibliografía) ────────────────────────────────────────
function useFuentesTexture() {
  const texture = useRef<THREE.CanvasTexture | null>(null);

  if (!texture.current) {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 550;
    const ctx = canvas.getContext("2d")!;

    // Tapa del libro: Verde oscuro clásico (estilo biblioteca antigua)
    ctx.fillStyle = "#233329";
    ctx.fillRect(0, 0, 400, 550);

    // Borde dorado
    ctx.strokeStyle = "#b59b54";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 360, 510);
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 336, 486);

    // Detalles del lomo (simulando relieve a la izquierda)
    ctx.fillStyle = "#16211a";
    ctx.fillRect(0, 0, 15, 550);

    // Texto de la tapa
    ctx.fillStyle = "#b59b54";
    ctx.textAlign = "center";
    ctx.font = "bold 28px serif";
    ctx.fillText("BIBLIOGRAFÍA", 200, 250);

    ctx.font = "italic 16px serif";
    ctx.fillText("Fuentes y", 200, 290);
    ctx.fillText("Referencias Históricas", 200, 315);
    ctx.fillText("Lucas Gomez", 200, 340);

    // Decoración inferior
    ctx.fillRect(170, 450, 60, 3);

    texture.current = new THREE.CanvasTexture(canvas);
  }
  return texture.current;
}

function FuentesItem({ position, isOpen, onOpen }: any) {
  const [hovered, setHovered] = useState(false);
  const tex = useFuentesTexture();

  useEffect(() => {
    document.body.style.cursor = hovered && !isOpen ? "pointer" : "auto";
  }, [hovered, isOpen]);

  const { pos, rot } = useSpring({
    pos: isOpen ? [0, 5.2, 2.6] : position,
    rot: isOpen ? [-Math.PI / 2, 0, 0] : [0, 0.5, 0], // Inclinado hacia la derecha
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
      {/* Geometría un poco más gruesa para simular un libro, no una hoja */}
      <boxGeometry args={[1.1, 0.15, 1.6]} />
      <meshStandardMaterial
        map={tex}
        color={hovered && !isOpen ? "#e8e8e8" : "#d1d1d1"}
      />
      {!isOpen && (
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`transition-all duration-300 pointer-events-none select-none ${hovered ? "opacity-100 -translate-y-2" : "opacity-0"}`}
          >
            <div className="bg-[#3c3836] text-[#fbf1c7] px-4 py-2 rounded border border-[#b57614] font-serif text-sm">
              ✦ Ver Fuentes
            </div>
          </div>
        </Html>
      )}
    </animated.mesh>
  );
}

function CartaItem({ position, isOpen, onOpen }: any) {
  const [hovered, setHovered] = useState(false);
  const tex = useCartaTexture();
  useEffect(() => {
    document.body.style.cursor = hovered && !isOpen ? "pointer" : "auto";
  }, [hovered, isOpen]);
  const { pos, rot } = useSpring({
    pos: isOpen ? [0, 5.2, 2.6] : position,
    rot: isOpen ? [-Math.PI / 2, 0, 0] : [0, -0.2, 0],
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
      <boxGeometry args={[1.0, 0.01, 1.4]} />
      <meshStandardMaterial
        map={tex}
        color={hovered && !isOpen ? "#ffffff" : "#e6e1d5"}
      />
      {!isOpen && (
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`transition-all duration-300 pointer-events-none select-none ${hovered ? "opacity-100 -translate-y-2" : "opacity-0"}`}
          >
            <div className="bg-[#3c3836] text-[#fbf1c7] px-4 py-2 rounded border border-[#b57614] font-serif text-sm">
              ✦ Reflexión Final (Parte 4)
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

  const POSITIONS = {
    batlle: [-0.4, 3.7, 0.5] as [number, number, number],
    caras: [1, 3.7, 0.2] as [number, number, number],
    eldia: [-2.2, 3.7, -0.8] as [number, number, number],
    parte3: [2.2, 3.7, -0.6] as [number, number, number],
    parte4: [-1.5, 3.7, 1.8] as [number, number, number],
    fuentes: [1.6, 3.7, 1.3] as [number, number, number], // <-- Nueva posición
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
      <div className="w-full h-screen">
        <Canvas
          shadows
          camera={{ position: [0, 5.5, 4.5], fov: 65 }}
          onCreated={({ camera }) => camera.lookAt(0, 3.7, 0)}
        >
          <CameraRig targetPos={camTarget} targetLook={camLook} />
          {/* Controles para explorar */}
          {/* <OrbitControls makeDefault /> */}

          {/* El Environment YA NO TIENE 'background'. 
              Ahora solo aporta reflejos de luz física, pero no se ve la foto. */}
          <Environment preset="night" blur={0.2} />

          {/* Luz de ambiente tenue para rellenar la habitación */}
          <ambientLight intensity={0.4} />

          {/* Lámparas que generan las sombras direccionales contra el piso y paredes */}
          <pointLight
            position={[-1, 5, 1]}
            intensity={1.5}
            color="#e8b359"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight
            position={[3, 8, 2]}
            intensity={1.0}
            color="#f4dca6"
            castShadow
          />

          <Suspense fallback={null}>
            {/* Montamos la habitación en la escena */}
            <Room />

            <Model
              scale={[8, 8, 8]}
              position={[0, -3.5, 0]}
              castShadow
              receiveShadow
            />

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

            <LibretaItem
              position={POSITIONS.parte3}
              isOpen={openItem === "parte3"}
              onOpen={() => setOpenItem("parte3")}
            />

            <CartaItem
              position={POSITIONS.parte4}
              isOpen={openItem === "parte4"}
              onOpen={() => setOpenItem("parte4")}
            />
            <FuentesItem
              position={POSITIONS.fuentes}
              isOpen={openItem === "fuentes"}
              onOpen={() => setOpenItem("fuentes")}
            />
          </Suspense>
        </Canvas>
      </div>

      <ContentPanel openItem={openItem} onClose={() => setOpenItem(null)} />
    </>
  );
}
