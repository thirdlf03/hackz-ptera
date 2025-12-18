import { Canvas} from '@react-three/fiber';
import type React from 'react';

interface BoardProps {
  className?: string;
}

const Board: React.FC<BoardProps> = ({ className}) => {
  return (
    <Canvas className={className}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
      {/* 3D chess board and pieces would be rendered here */}
       <mesh rotation={[-Math.PI/6,0,0]}>
          {/* 平面ジオメトリ */}
          <planeGeometry args={[6,6]}/>
          {/* ノーマルマテリアル */}
          <meshPhongMaterial color="rgb(204, 153, 0)" />
        </mesh>
    </Canvas>
  );
};

export default Board;