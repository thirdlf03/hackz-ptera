import type { Position } from "@repo/schema";

import { Vector3 } from "three";

const TestPiece = () => {
  const position: Position = { x: -2.1, y: -2.1, z: 0.4 };
  const vectorPosition = new Vector3(position.x, position.y, position.z);

  return (
    <>
      <mesh position={vectorPosition}>
        <boxGeometry args={[0.3, 0.3, 0.7]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </>
  );
};

export default TestPiece;
