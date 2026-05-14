import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const MODEL_CONFIGS = [
  {
    key: "Burger_Menu_Empty",
    position: [8.5, 2.9, 6.8],
    rotation: [1.0, -2.8, 0],
    spinNodes: ["Burger", "Donut", "French_Fries"],
  },
  {
    key: "Pizza_Menu_Empty",
    position: [8.5, 2.9, 6.8],
    rotation: [1.0, -2.8, 0],
    spinNodes: ["Astro_Koala", "Pizza_French_Fries", "Pizza_Triangulate_3", "Coffee_Topping"],
  },
  {
    key: "Hotdog_Menu_Empty",
    position: [8.5, 2.9, 6.8],
    rotation: [1.0, -2.8, 0],
    spinNodes: ["Astro_Chik", "French_Fries_Potato.002", "Plane_2", "Ice_Cream_Toping", "Plane_5"],
  },
];

export const HeroModels = ({ activeIndex }) => {
  const modelRef = useRef();
  const model = useGLTF("/three/slider_model.glb");
  const config = MODEL_CONFIGS[activeIndex];

  useThree(({ gl }) => {
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((a) => a?.stop());
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }
  }, [actions, activeIndex]);

  useFrame(() => {
    config.spinNodes.forEach((key) => {
      const node = model.nodes[key];
      if (node) node.rotation.y += 0.01;
    });
  });

  const object = model.nodes[config.key];
  if (!object) return null;

  return (
    <>
      <primitive
        ref={modelRef}
        object={object}
        position={config.position}
        rotation={config.rotation}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      <OrbitControls enableZoom={false} />
    </>
  );
};

useGLTF.preload("/three/slider_model.glb");