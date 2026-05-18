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

const SLIDER_CAMERA_POSES = [
  { pos: [-1.5, 0.25, 45], target: [0, 0, 0], fov: 45 },
  { pos: [1.35, 0.6, 44], target: [0, 0, 0], fov: 45 },
  { pos: [-0.9, -0.25, 45.5], target: [0, 0, 0], fov: 45 },
];

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

export const HeroModels = ({ activeIndex, isStarting }) => {
  const offsetGroupRef = useRef(null);
  const groupRef = useRef(null);
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const displayedIndexRef = useRef(activeIndex);
  const transitionTimeline = useRef(null);

  const blenderCamRef = useRef(null);
  const camInitRef = useRef(false);
  const camRigRef = useRef({
    pos: new THREE.Vector3(0, 0, 45),
    target: new THREE.Vector3(0, 0, 0),
    fov: 45,
  });
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const lastFovRef = useRef(null);

  useEffect(() => {
    displayedIndexRef.current = displayedIndex;
  }, [displayedIndex]);

  useEffect(() => {
    return () => transitionTimeline.current?.kill();
  }, []);

  const { nodes, animations, scene } = useGLTF("/three/slider_model.glb");
  const { scene: cameraScene } = useGLTF("/three/slider_camera.glb");
  const { gl } = useThree();

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1.0;
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

  useEffect(() => {
    if (camInitRef.current) return;
    camInitRef.current = true;

    blenderCamRef.current = null;
    cameraScene.updateMatrixWorld(true);
    cameraScene.traverse((obj) => {
      if (blenderCamRef.current) return;
      if (obj.isCamera) blenderCamRef.current = obj;
    });

    const pose = SLIDER_CAMERA_POSES[activeIndex] || SLIDER_CAMERA_POSES[0];
    camRigRef.current.pos.set(pose.pos[0], pose.pos[1], pose.pos[2]);
    camRigRef.current.target.set(pose.target[0], pose.target[1], pose.target[2]);
    camRigRef.current.fov = pose.fov;
  }, [cameraScene, activeIndex]);

  useGSAP(
    () => {
      const pose = SLIDER_CAMERA_POSES[activeIndex] || SLIDER_CAMERA_POSES[0];
      const rig = camRigRef.current;

      gsap.to(rig.pos, {
        x: pose.pos[0],
        y: pose.pos[1],
        z: pose.pos[2],
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(rig.target, {
        x: pose.target[0],
        y: pose.target[1],
        z: pose.target[2],
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(rig, {
        fov: pose.fov,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: true,
      });
    },
    { dependencies: [activeIndex] },
  );

  // ── Initial Portal Entrance Animation ──
  useGSAP(() => {
    if (isStarting && groupRef.current) {
      const g = groupRef.current;
      gsap.fromTo(g.position, 
        { z: -50 }, 
        { z: 0, duration: 1.8, ease: "power3.out" }
      );
      gsap.fromTo(g.scale, 
        { x: 0, y: 0, z: 0 }, 
        { x: BASE_SCALE, y: BASE_SCALE, z: BASE_SCALE, duration: 1.5, ease: "elastic.out(1, 0.6)", delay: 0.1 }
      );
    }
  }, [isStarting]);

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
  useFrame((state) => {
    const blenderCam = blenderCamRef.current;
    if (blenderCam) {
      const rig = camRigRef.current;
      blenderCam.position.copy(rig.pos);
      blenderCam.lookAt(rig.target);
      blenderCam.updateMatrixWorld(true);

      state.camera.position.setFromMatrixPosition(blenderCam.matrixWorld);
      blenderCam.getWorldQuaternion(tmpQuat);
      state.camera.quaternion.copy(tmpQuat);

      if (blenderCam.isPerspectiveCamera && typeof rig.fov === "number") {
        if (lastFovRef.current !== rig.fov) {
          lastFovRef.current = rig.fov;
          state.camera.fov = rig.fov;
          state.camera.updateProjectionMatrix();
        }
      }
    }

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
      <Environment preset="city" environmentIntensity={0.8} />

      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" />

      <group ref={offsetGroupRef} position={[-4, 0, -3]}>
        <group
          ref={groupRef}
          scale={[0, 0, 0]}
          rotation={BASE_ROTATION}
        >
          <Float floatIntensity={2} rotationIntensity={0.8} speed={1.25}>
            <primitive object={activeClone} key={displayedIndex} />
          </Float>
        </group>
      </group>
    </>
  );
};

useGLTF.preload("/three/slider_model.glb");
useGLTF.preload("/three/slider_camera.glb");
