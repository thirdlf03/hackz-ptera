import Board from "./features/chess/compomemt/Board";
import { Canvas } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

import "@/App.css";

function App() {
  return (
    <>
      <div className="app-container">
        <Canvas>
          {/* ライトをCanvas直下に配置 */}
          <directionalLight position={[0, 0, 15]} />
          <ambientLight intensity={0.2} />

          <Center position={[0, 3.1, 0.3]}>
            <Text3D
              font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
              size={0.5}
              height={0.1}
              bevelEnabled={true} // ベベルを有効化
              bevelThickness={0.1}
              rotation={[Math.PI / 7, 0, 0]}
            >
              AI Chess
              {/* マテリアルを追加 */}
              <meshStandardMaterial color={new THREE.Color("rgba(249, 209, 8, 1)")} />
            </Text3D>
          </Center>

          <Board className="container-3d" />
        </Canvas>
      </div>
    </>
  );
}

export default App;
