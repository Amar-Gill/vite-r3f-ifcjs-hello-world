import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react';

function App() {
  return (
    <Canvas>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <gridHelper />
    </Canvas>
  );
}

export default App;
