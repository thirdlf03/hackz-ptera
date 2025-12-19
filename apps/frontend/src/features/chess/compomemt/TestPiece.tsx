const TestPiece = () => {
  return (
    <>
      <mesh position={[-2.1, -2.1, 0.4]}>
        <boxGeometry args={[0.3, 0.3, 0.7]} />
        <meshStandardMaterial color='brown' />
      </mesh>
    </>
  );
};

export default TestPiece;
