import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCircuitStore, circuitStore } from '../../store/circuitStore';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { BB_GEOM, getColX, getHoleCoordinates, getRowY } from '../../utils/coordinates';
import { WireColor } from '../../types/circuit';
import { RotateCcw, Eye, Compass, Camera } from 'lucide-react';

const WIRE_3D_COLORS: Record<WireColor, number> = {
  red: 0xdc2626,
  black: 0x1e293b,
  blue: 0x2563eb,
  green: 0x16a34a,
  yellow: 0xca8a04,
  orange: 0xea580c,
  purple: 0x9333ea,
  white: 0xf8fafc,
};

export const Breadboard3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { placedICs, wires, simulationResult, ioSettings, selectedICInstanceId, selectedWireId } = useCircuitStore();

  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front'>('iso');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Dynamic mesh references for simulation updates
  const ledMeshesRef = useRef<THREE.Mesh[]>([]);
  const ledLightsRef = useRef<THREE.PointLight[]>([]);
  const dynamicWiresGroupRef = useRef<THREE.Group | null>(null);
  const dynamicICsGroupRef = useRef<THREE.Group | null>(null);

  // Mouse orbit interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 450, theta: 0.85, phi: 0.95 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    cameraRef.current.position.x = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = cameraTargetRef.current.y + radius * Math.cos(phi);
    cameraRef.current.position.z = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(cameraTargetRef.current);
  };

  const setPreset = (preset: 'iso' | 'top' | 'front') => {
    setCameraPreset(preset);
    if (preset === 'top') {
      cameraSphericalRef.current = { radius: 480, theta: 0.01, phi: 0.05 };
    } else if (preset === 'front') {
      cameraSphericalRef.current = { radius: 440, theta: 0.01, phi: 1.45 };
    } else {
      // Isometric view
      cameraSphericalRef.current = { radius: 460, theta: 0.75, phi: 0.95 };
    }
    updateCameraPosition();
  };

  // Convert SVG 2D layout coordinates (boardWidth 1160, boardHeight 520) to 3D World (centered at 0,0,0)
  const to3D = (x: number, y: number, z: number = 0): THREE.Vector3 => {
    const scale = 0.5;
    const wx = (x - BB_GEOM.boardWidth / 2) * scale;
    const wz = (y - BB_GEOM.boardHeight / 2) * scale;
    return new THREE.Vector3(wx, z, wz);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061121);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(150, 400, 200);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.4);
    dirLight2.position.set(-200, 200, -150);
    scene.add(dirLight2);

    // 5. Trainer PCB Base Board (Deep Navy Blue)
    const boardScale = 0.5;
    const pcbWidth = (BB_GEOM.boardWidth - 20) * boardScale;
    const pcbDepth = (BB_GEOM.boardHeight - 20) * boardScale;
    const pcbGeom = new THREE.BoxGeometry(pcbWidth, 8, pcbDepth);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0a1f3d,
      roughness: 0.35,
      metalness: 0.1,
    });
    const pcbMesh = new THREE.Mesh(pcbGeom, pcbMat);
    pcbMesh.position.y = -4;
    pcbMesh.receiveShadow = true;
    scene.add(pcbMesh);

    // PCB Border Bevel Rim
    const rimGeom = new THREE.BoxGeometry(pcbWidth + 4, 2, pcbDepth + 4);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.position.y = -8;
    scene.add(rimMesh);

    // Rubber Feet (4 corners)
    const footGeom = new THREE.CylinderGeometry(6, 6, 4, 16);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const footOffsets = [
      { x: pcbWidth / 2 - 15, z: pcbDepth / 2 - 15 },
      { x: -pcbWidth / 2 + 15, z: pcbDepth / 2 - 15 },
      { x: pcbWidth / 2 - 15, z: -pcbDepth / 2 + 15 },
      { x: -pcbWidth / 2 + 15, z: -pcbDepth / 2 + 15 },
    ];
    footOffsets.forEach(({ x, z }) => {
      const foot = new THREE.Mesh(footGeom, footMat);
      foot.position.set(x, -10, z);
      scene.add(foot);
    });

    // 6. Breadboard Body (Off-white / cream plastic with center divider trench)
    const bbCenterPos = to3D((getColX(1) + getColX(30)) / 2, BB_GEOM.troughCenterY, 4);
    const bbWidth = (30 * BB_GEOM.colPitch + 30) * boardScale;
    const bbDepth = (BB_GEOM.botPowerMinusY - BB_GEOM.topPowerPlusY + 40) * boardScale;

    // Breadboard top plastic block
    const bbGeom = new THREE.BoxGeometry(bbWidth, 8, bbDepth);
    const bbMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.25,
      metalness: 0.05,
    });
    const bbMesh = new THREE.Mesh(bbGeom, bbMat);
    bbMesh.position.set(bbCenterPos.x, 4, bbCenterPos.z);
    bbMesh.castShadow = true;
    bbMesh.receiveShadow = true;
    scene.add(bbMesh);

    // Center divider trench (recessed groove)
    const trenchGeom = new THREE.BoxGeometry(bbWidth - 10, 2, 8 * boardScale);
    const trenchMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.6 });
    const trenchMesh = new THREE.Mesh(trenchGeom, trenchMat);
    trenchMesh.position.set(bbCenterPos.x, 7.5, bbCenterPos.z);
    scene.add(trenchMesh);

    // Colored bus lines on breadboard (Red for +, Blue for -)
    const stripeMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const stripeMatBlue = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const stripeGeom = new THREE.BoxGeometry(bbWidth - 16, 0.2, 1.2);

    // Top + and - stripes
    const topPlusStripe = new THREE.Mesh(stripeGeom, stripeMatRed);
    const topPlusPos = to3D((getColX(1) + getColX(30)) / 2, BB_GEOM.topPowerPlusY - 8, 8.1);
    topPlusStripe.position.set(topPlusPos.x, 8.1, topPlusPos.z);
    scene.add(topPlusStripe);

    const topMinusStripe = new THREE.Mesh(stripeGeom, stripeMatBlue);
    const topMinusPos = to3D((getColX(1) + getColX(30)) / 2, BB_GEOM.topPowerMinusY + 8, 8.1);
    topMinusStripe.position.set(topMinusPos.x, 8.1, topMinusPos.z);
    scene.add(topMinusStripe);

    // Bottom + and - stripes
    const botPlusStripe = new THREE.Mesh(stripeGeom, stripeMatRed);
    const botPlusPos = to3D((getColX(1) + getColX(30)) / 2, BB_GEOM.botPowerPlusY - 8, 8.1);
    botPlusStripe.position.set(botPlusPos.x, 8.1, botPlusPos.z);
    scene.add(botPlusStripe);

    const botMinusStripe = new THREE.Mesh(stripeGeom, stripeMatBlue);
    const botMinusPos = to3D((getColX(1) + getColX(30)) / 2, BB_GEOM.botPowerMinusY + 8, 8.1);
    botMinusStripe.position.set(botMinusPos.x, 8.1, botMinusPos.z);
    scene.add(botMinusStripe);

    // 7. Sockets (Breadboard holes represented as metallic spring contacts)
    const holeGeom = new THREE.CylinderGeometry(1.0, 0.8, 1.5, 8);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.8,
      roughness: 0.3,
    });
    const holeInstanced = new THREE.InstancedMesh(holeGeom, holeMat, 30 * 14 + 60);
    const dummy = new THREE.Object3D();
    let holeIdx = 0;

    // Place breadboard holes
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const;
    for (let col = 1; col <= 30; col++) {
      const cx = getColX(col);
      // Top power rails
      const tpPos = to3D(cx, BB_GEOM.topPowerPlusY, 8.2);
      dummy.position.set(tpPos.x, tpPos.y, tpPos.z);
      dummy.updateMatrix();
      holeInstanced.setMatrixAt(holeIdx++, dummy.matrix);

      const tmPos = to3D(cx, BB_GEOM.topPowerMinusY, 8.2);
      dummy.position.set(tmPos.x, tmPos.y, tmPos.z);
      dummy.updateMatrix();
      holeInstanced.setMatrixAt(holeIdx++, dummy.matrix);

      // Rows A-J
      rows.forEach((r) => {
        const ry = getRowY(r);
        const hp = to3D(cx, ry, 8.2);
        dummy.position.set(hp.x, hp.y, hp.z);
        dummy.updateMatrix();
        holeInstanced.setMatrixAt(holeIdx++, dummy.matrix);
      });

      // Bottom power rails
      const bpPos = to3D(cx, BB_GEOM.botPowerPlusY, 8.2);
      dummy.position.set(bpPos.x, bpPos.y, bpPos.z);
      dummy.updateMatrix();
      holeInstanced.setMatrixAt(holeIdx++, dummy.matrix);

      const bmPos = to3D(cx, BB_GEOM.botPowerMinusY, 8.2);
      dummy.position.set(bmPos.x, bmPos.y, bmPos.z);
      dummy.updateMatrix();
      holeInstanced.setMatrixAt(holeIdx++, dummy.matrix);
    }
    holeInstanced.instanceMatrix.needsUpdate = true;
    scene.add(holeInstanced);

    // 8. DC Power Supply Stations (+5V Red Binding Post, 0V Ground Black Binding Post)
    const postGeom = new THREE.CylinderGeometry(4.5, 4.5, 12, 16);
    const vccMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.2 });
    const gndMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });

    const vccPos = to3D(BB_GEOM.vccX, BB_GEOM.vccY, 6);
    const vccMesh = new THREE.Mesh(postGeom, vccMat);
    vccMesh.position.set(vccPos.x, 6, vccPos.z);
    vccMesh.castShadow = true;
    scene.add(vccMesh);

    const gndPos = to3D(BB_GEOM.gndX, BB_GEOM.gndY, 6);
    const gndMesh = new THREE.Mesh(postGeom, gndMat);
    gndMesh.position.set(gndPos.x, 6, gndPos.z);
    gndMesh.castShadow = true;
    scene.add(gndMesh);

    // 9. Digital I/O Panel Platform on the Right
    const dioCenter = to3D(825 + 315 / 2, 42 + 400 / 2, 3);
    const dioWidth = 315 * boardScale;
    const dioDepth = 400 * boardScale;
    const dioBaseGeom = new THREE.BoxGeometry(dioWidth, 6, dioDepth);
    const dioBaseMat = new THREE.MeshStandardMaterial({ color: 0x091428, roughness: 0.4 });
    const dioBaseMesh = new THREE.Mesh(dioBaseGeom, dioBaseMat);
    dioBaseMesh.position.set(dioCenter.x, 3, dioCenter.z);
    dioBaseMesh.receiveShadow = true;
    scene.add(dioBaseMesh);

    // 10. Output LEDs D8-D15 (SMT 3D LEDs with dynamic glow)
    const ledGeom = new THREE.SphereGeometry(3.2, 16, 12);
    const ledMeshes: THREE.Mesh[] = [];
    const ledLights: THREE.PointLight[] = [];

    for (let i = 0; i < 8; i++) {
      const ledPos = to3D(BB_GEOM.dioOutputsX, BB_GEOM.dioOutputsStartY + i * BB_GEOM.dioOutputsPitchY, 7);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0x166534,
        emissive: 0x052e16,
        roughness: 0.2,
      });
      const ledMesh = new THREE.Mesh(ledGeom, ledMat);
      ledMesh.position.set(ledPos.x + 20, 7, ledPos.z);
      scene.add(ledMesh);
      ledMeshes.push(ledMesh);

      const pointLight = new THREE.PointLight(0x22c55e, 0, 40);
      pointLight.position.set(ledPos.x + 20, 11, ledPos.z);
      scene.add(pointLight);
      ledLights.push(pointLight);
    }
    ledMeshesRef.current = ledMeshes;
    ledLightsRef.current = ledLights;

    // Groups for dynamic items (ICs and Wires)
    const icGroup = new THREE.Group();
    scene.add(icGroup);
    dynamicICsGroupRef.current = icGroup;

    const wireGroup = new THREE.Group();
    scene.add(wireGroup);
    dynamicWiresGroupRef.current = wireGroup;

    // Render loop
    let pulseTime = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      pulseTime += 0.03;

      // Pulse high wires
      if (wireGroup) {
        wireGroup.children.forEach((child) => {
          if ((child as any).isSignalPulse) {
            const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
            if (mat) {
              mat.opacity = 0.5 + 0.5 * Math.sin(pulseTime * 4);
            }
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update dynamic Output LEDs based on simulation result
  useEffect(() => {
    ledMeshesRef.current.forEach((mesh, idx) => {
      const outState = simulationResult.outputStates[idx];
      const isHigh = outState === 'HIGH' && ioSettings.powerOn;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const light = ledLightsRef.current[idx];

      if (isHigh) {
        mat.color.setHex(0x22c55e);
        mat.emissive.setHex(0x15803d);
        if (light) light.intensity = 1.8;
      } else if (outState === 'LOW') {
        mat.color.setHex(0x14532d);
        mat.emissive.setHex(0x052e16);
        if (light) light.intensity = 0.1;
      } else {
        mat.color.setHex(0x334155);
        mat.emissive.setHex(0x0f172a);
        if (light) light.intensity = 0;
      }
    });
  }, [simulationResult, ioSettings.powerOn]);

  // Update 3D Placed ICs
  useEffect(() => {
    const group = dynamicICsGroupRef.current;
    if (!group) return;

    // Clear old IC meshes
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    placedICs.forEach((ic) => {
      const def = IC_DEFINITIONS[ic.icDefId];
      if (!def) return;

      const numCols = Math.floor(def.pinCount / 2);
      const startX = getColX(ic.startCol);
      const endX = getColX(ic.startCol + numCols - 1);
      const centerX = (startX + endX) / 2;
      const centerY = BB_GEOM.troughCenterY;
      const pos3D = to3D(centerX, centerY, 8);

      const icSubGroup = new THREE.Group();
      icSubGroup.position.set(pos3D.x, pos3D.y, pos3D.z);

      const isSelected = selectedICInstanceId === ic.instanceId;

      // DIP IC Body
      const chipWidth = (numCols * BB_GEOM.colPitch - 4) * 0.5;
      const chipDepth = 30 * 0.5; // spans between row E and row F
      const chipHeight = 5;

      const bodyGeom = new THREE.BoxGeometry(chipWidth, chipHeight, chipDepth);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x1e293b : 0x18181b,
        roughness: 0.4,
        metalness: 0.1,
      });
      const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
      bodyMesh.position.y = chipHeight / 2 + 2;
      bodyMesh.castShadow = true;
      icSubGroup.add(bodyMesh);

      // Selection glow ring
      if (isSelected) {
        const selGeom = new THREE.BoxGeometry(chipWidth + 2, chipHeight + 1, chipDepth + 2);
        const selMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
        const selMesh = new THREE.Mesh(selGeom, selMat);
        selMesh.position.y = chipHeight / 2 + 2;
        icSubGroup.add(selMesh);
      }

      // Pin 1 Notch (semi-circle cutout)
      const notchGeom = new THREE.CylinderGeometry(1.8, 1.8, chipHeight + 0.2, 16);
      const notchMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
      const notchMesh = new THREE.Mesh(notchGeom, notchMat);
      notchMesh.position.set(-chipWidth / 2, chipHeight / 2 + 2, 0);
      icSubGroup.add(notchMesh);

      // White Pin 1 Dot
      const dotGeom = new THREE.CircleGeometry(0.8, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const dotMesh = new THREE.Mesh(dotGeom, dotMat);
      dotMesh.rotation.x = -Math.PI / 2;
      dotMesh.position.set(-chipWidth / 2 + 3, chipHeight + 2.1, chipDepth / 2 - 2);
      icSubGroup.add(dotMesh);

      // Metallic IC Pins bent down into breadboard
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
      for (let p = 0; p < numCols; p++) {
        const px = (-chipWidth / 2 + (p + 0.5) * BB_GEOM.colPitch * 0.5);

        // Top Pin (Row E)
        const topPinGeom = new THREE.BoxGeometry(1.2, 4, 3);
        const topPin = new THREE.Mesh(topPinGeom, pinMat);
        topPin.position.set(px, 1.5, -chipDepth / 2 - 1.2);
        icSubGroup.add(topPin);

        // Bottom Pin (Row F)
        const botPinGeom = new THREE.BoxGeometry(1.2, 4, 3);
        const botPin = new THREE.Mesh(botPinGeom, pinMat);
        botPin.position.set(px, 1.5, chipDepth / 2 + 1.2);
        icSubGroup.add(botPin);
      }

      group.add(icSubGroup);
    });
  }, [placedICs, selectedICInstanceId]);

  // Update 3D Wires
  useEffect(() => {
    const group = dynamicWiresGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    wires.forEach((wire) => {
      const c1 = getHoleCoordinates(wire.fromHoleId);
      const c2 = getHoleCoordinates(wire.toHoleId);
      if (!c1 || !c2) return;

      const p1 = to3D(c1.x, c1.y, 8.5);
      const p2 = to3D(c2.x, c2.y, 8.5);

      const isSelected = selectedWireId === wire.id;
      const wireHex = WIRE_3D_COLORS[wire.color] || 0x2563eb;

      // Compute 3D Arch Curve
      const midX = (p1.x + p2.x) / 2;
      const midZ = (p1.z + p2.z) / 2;
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.z - p1.z) ** 2);
      const archHeight = Math.max(12, Math.min(65, dist * 0.45));
      const pMid = new THREE.Vector3(midX, 8.5 + archHeight, midZ);

      const curve = new THREE.CatmullRomCurve3([p1, pMid, p2]);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, isSelected ? 1.8 : 1.2, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xfacc15 : wireHex,
        roughness: 0.3,
        metalness: 0.1,
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      tubeMesh.castShadow = true;
      group.add(tubeMesh);

      // Terminal Pins (metallic ends entering the sockets)
      const pinGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 8);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
      const pin1 = new THREE.Mesh(pinGeom, pinMat);
      pin1.position.set(p1.x, 8, p1.z);
      group.add(pin1);

      const pin2 = new THREE.Mesh(pinGeom, pinMat);
      pin2.position.set(p2.x, 8, p2.z);
      group.add(pin2);

      // Signal energy pulse along wire if carrying HIGH logic level
      const wireNetState = simulationResult.nodeStates[wire.fromHoleId];
      if (wireNetState === 'HIGH' && ioSettings.powerOn) {
        const pulseGeom = new THREE.TubeGeometry(curve, 16, 1.8, 6, false);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0x86efac,
          transparent: true,
          opacity: 0.6,
        });
        const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        (pulseMesh as any).isSignalPulse = true;
        group.add(pulseMesh);
      }
    });
  }, [wires, selectedWireId, simulationResult, ioSettings.powerOn]);

  // Orbit camera drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    cameraSphericalRef.current.theta -= dx * 0.008;
    cameraSphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi + dy * 0.008));
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.3;
    cameraSphericalRef.current.radius = Math.max(180, Math.min(850, cameraSphericalRef.current.radius + delta));
    updateCameraPosition();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] bg-[#061121] rounded-xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 3D Camera Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-lg shadow-md backdrop-blur-xs">
        <button
          onClick={() => setPreset('iso')}
          className={`px-2.5 py-1 text-xs font-semibold rounded transition flex items-center gap-1 cursor-pointer ${
            cameraPreset === 'iso' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Isometric Angled 3D View"
        >
          <Compass className="w-3.5 h-3.5" /> Isometric
        </button>
        <button
          onClick={() => setPreset('top')}
          className={`px-2.5 py-1 text-xs font-semibold rounded transition flex items-center gap-1 cursor-pointer ${
            cameraPreset === 'top' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Top-Down Breadboard View"
        >
          <Eye className="w-3.5 h-3.5" /> Top-Down
        </button>
        <button
          onClick={() => setPreset('front')}
          className={`px-2.5 py-1 text-xs font-semibold rounded transition flex items-center gap-1 cursor-pointer ${
            cameraPreset === 'front' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Front Profile View"
        >
          <Camera className="w-3.5 h-3.5" /> Front
        </button>
      </div>

      {/* 3D Visual Feedback Badge */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-900/85 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-slate-400">3D REALISTIC ENGINE</span>
        <span className="text-slate-500">• Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};
