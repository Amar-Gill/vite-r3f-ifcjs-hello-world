import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useState } from 'react';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import { IFCLoader } from 'web-ifc-three/IFCLoader';

import IFCContainer from './IFCContainer';

function App() {
  const [ifc, setIfc] = useState<IFCModel>();

  const ifcLoader = new IFCLoader();
  const manager = ifcLoader.ifcManager;
  manager.setWasmPath('resources/');

  function handleFileUpload(event: Event) {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    ifcLoader.load(fileUrl, (ifc) => setIfc(ifc));
  }

  return (
    <>
      <input
        style={{
          position: 'absolute',
          zIndex: 1,
        }}
        type="file"
        onChange={handleFileUpload}
      />
      <Canvas
        camera={{
          far: 500,
          near: 1,
          zoom: 1,
          position: [1, 8, 20],
          rotation: [-0.4, 0.55, 0.2],
        }}
      >
        <ambientLight intensity={0.1} color="white" />
        <directionalLight color="white" position={[40, 40, 100]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <IFCContainer ifc={ifc} manager={manager} />
        <gridHelper args={[100, 100]} />
        <axesHelper args={[25]} />
      </Canvas>
    </>
  );
}

export default App;
