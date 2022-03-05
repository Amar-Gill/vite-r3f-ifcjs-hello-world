import { useBVH } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Intersection, Material, MeshLambertMaterial } from 'three';
import { IFCManager } from 'web-ifc-three/IFC/components/IFCManager';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import { IFCLoader } from 'web-ifc-three/IFCLoader';

let manager: IFCManager;

const highlightMaterial = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff00ff,
  depthTest: false,
});

type IFCContainerProps = {
  filePath: string;
};

export default function IFCContainer({ filePath }: IFCContainerProps) {
  const highlightedModelId = useRef(-1);

  const ifc = useLoader(IFCLoader, filePath, (loader) => {
    manager && manager.removeSubset(highlightedModelId.current, highlightMaterial);
    const { ifcManager } = loader as IFCLoader;
    ifcManager.setWasmPath('resources/');
    manager = ifcManager;
  });

  const mesh = useRef(null!);
  useBVH(mesh);

  const scene = useThree((state) => state.scene);

  function handleDblClick(event: Intersection<IFCModel>) {
    manager.removeSubset(highlightedModelId.current, highlightMaterial);
    highlight(event, highlightMaterial);
  }

  function highlight(intersection: Intersection<IFCModel>, material: Material) {
    const { faceIndex } = intersection;
    const { modelID, geometry } = intersection.object;
    const id = manager.getExpressId(geometry, faceIndex);

    highlightedModelId.current = modelID;

    manager.createSubset({
      modelID,
      ids: [id],
      material,
      scene,
      removePrevious: true,
    });
  }

  return <primitive ref={mesh} object={ifc} onDoubleClick={handleDblClick} />;
}
