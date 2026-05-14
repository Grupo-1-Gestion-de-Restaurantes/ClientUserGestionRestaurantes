import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MODEL_CONFIGS = [
  {
    key: "Burger_Menu_Empty",
    spinNodes: ["Burger", "Donut", "French_Fries"],
  },
  {
    key: "Pizza_Menu_Empty",
    spinNodes: ["Astro_Koala", "Pizza_French_Fries", "Pizza_Triangulate_3", "Coffee_Topping"],
  },
  {
    key: "Grand_Hot_Dog_Empty",
    spinNodes: ["Astro_Chik", "French_Fries_Potato.002", "Plane_2", "Ice_Cream_Toping", "Plane_5"],
  },
];

// ── Calibration: base tilt to match Planetoño's left-leaning angle ──
const BASE_ROTATION = [0.1, -0.3, 0.1];
const BASE_SCALE = 0.65;

/**
 * Deep-clone a THREE.Object3D and all materials so each instance is independent.
 * Centers the clone at world origin based on its bounding box.
 */
function cloneAndCenter(node) {
  const clone = node.clone(true);

  clone.traverse((child) => {
    child.visible = true;
    child.frustumCulled = false;
    if (child.isMesh && child.material) {
      child.material = child.material.clone();
      child.material.needsUpdate = true;
    }
  });

  const box = new THREE.Box3().setFromObject(clone);
  const center = box.getCenter(new THREE.Vector3());
  clone.position.sub(center);

  return clone;
}

export const HeroModels = ({ activeIndex }) => {
  const groupRef = useRef(null);
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const displayedIndexRef = useRef(activeIndex);
  const transitionTimeline = useRef(null);

  useEffect(() => {
    displayedIndexRef.current = displayedIndex;
  }, [displayedIndex]);

  useEffect(() => {
    return () => transitionTimeline.current?.kill();
  }, []);

  const { nodes, animations, scene } = useGLTF("/three/slider_model.glb");
  const { gl } = useThree();

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1.4;
  }, [gl]);

  // Clone and center each model group independently
  const clones = useMemo(() => {
    return MODEL_CONFIGS.map((cfg) => {
      const node = nodes[cfg.key];
      if (!node) return null;
      return cloneAndCenter(node);
    });
  }, [nodes]);

  const activeClone = clones[displayedIndex];

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => a?.stop());
    const firstAction = Object.values(actions)[0];
    firstAction?.reset?.();
    firstAction?.play();
  }, [actions, displayedIndex]);

  // ── Carousel Transition with Y-axis parallax spin ──
  useGSAP(
    () => {
      if (activeIndex === displayedIndexRef.current) return;
      const g = groupRef.current;
      if (!g) return;

      transitionTimeline.current?.kill();
      const nextIndex = activeIndex;
      const direction = nextIndex > displayedIndexRef.current ? 1 : -1;

      transitionTimeline.current = gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => { transitionTimeline.current = null; },
        })
        // ── EXIT: shrink + slide left + tilt ──
        .to(g.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 0.45, ease: "power3.inOut" })
        .to(g.position, { x: direction * -15, duration: 0.45, ease: "power3.inOut" }, "<")
        .to(g.rotation, {
          y: BASE_ROTATION[1] + direction * 1.2,
          z: BASE_ROTATION[2] + direction * 0.26,
          duration: 0.45,
          ease: "power3.inOut",
        }, "<")
        // ── SWAP model ──
        .add(() => {
          displayedIndexRef.current = nextIndex;
          setDisplayedIndex(nextIndex);
        })
        // ── ENTER: slide in from right + Y-axis parallax spin + bounce scale ──
        .fromTo(
          g.position,
          { x: direction * 15 },
          { x: 0, duration: 0.7, ease: "power3.out" }
        )
        .fromTo(
          g.scale,
          { x: 0.3, y: 0.3, z: 0.3 },
          { x: BASE_SCALE, y: BASE_SCALE, z: BASE_SCALE, duration: 0.7, ease: "power3.out" },
          "<"
        )
        .fromTo(
          g.rotation,
          { x: BASE_ROTATION[0], y: BASE_ROTATION[1] + direction * -0.6, z: BASE_ROTATION[2] + direction * -0.1 },
          { x: BASE_ROTATION[0], y: BASE_ROTATION[1], z: BASE_ROTATION[2], duration: 0.85, ease: "elastic.out(1, 0.6)" },
          "<"
        );
    },
    { dependencies: [activeIndex] }
  );

  // Subtle spin on individual food items
  useFrame(() => {
    const spinKeys = MODEL_CONFIGS[displayedIndexRef.current]?.spinNodes ?? [];
    for (const key of spinKeys) {
      const node = nodes[key];
      if (node) node.rotation.y += 0.01;
    }
  });

  if (!activeClone) return null;

  return (
    <>
      {/* ── Environment map for PBR color accuracy (cheese yellow, etc.) ── */}
      <Environment preset="city" environmentIntensity={1.2} />

      <ambientLight intensity={3} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={4} color="#fdf6c0" />

      <group
        ref={groupRef}
        scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}
        rotation={BASE_ROTATION}
      >
        <Float floatIntensity={2} rotationIntensity={0.8} speed={1.25}>
          <primitive object={activeClone} key={displayedIndex} />
        </Float>
      </group>
    </>
  );
};

useGLTF.preload("/three/slider_model.glb");
