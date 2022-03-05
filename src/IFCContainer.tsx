import { useBVH } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { Intersection, Material, MeshLambertMaterial } from 'three';
import { IFCManager } from 'web-ifc-three/IFC/components/IFCManager';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import { IFCLoader } from 'web-ifc-three/IFCLoader';

let manager: IFCManager;

type IFCContainerProps = {
  filePath: string;
};

export default function IFCContainer({ filePath }: IFCContainerProps) {
  const [highlightedModel, setHighlightedModel] = useState({ id: -1 });

  const ifc = useLoader(IFCLoader, filePath, (loader) => {
    const { ifcManager } = loader as IFCLoader;
    ifcManager.setWasmPath('resources/');
    manager = ifcManager;
  });

  const mesh = useRef(null!);
  useBVH(mesh);

  const scene = useThree((state) => state.scene);

  const highlightMaterial = new MeshLambertMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0xff00ff,
    depthTest: false,
  });

  function handleDblClick(event: Intersection<IFCModel>) {
    manager.removeSubset(highlightedModel.id, highlightMaterial);
    highlight(event, highlightMaterial);
  }

  function highlight(intersection: Intersection<IFCModel>, material: Material) {
    const { faceIndex } = intersection;
    const { modelID, geometry } = intersection.object;
    const id = manager.getExpressId(geometry, faceIndex);

    setHighlightedModel({ id: modelID });

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
