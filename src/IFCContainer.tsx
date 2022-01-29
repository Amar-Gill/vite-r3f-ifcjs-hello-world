import { useBVH } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { Intersection, Material, MeshLambertMaterial } from 'three';
import { IFCManager } from 'web-ifc-three/IFC/components/IFCManager';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';

type IFCContainerProps = {
  ifc?: IFCModel;
  manager: IFCManager;
};

export default function IFCContainer({ ifc, manager }: IFCContainerProps) {
  const [highlightedModel, setHighlightedModel] = useState({ id: -1 });

  const mesh = useRef(null!);
  useBVH(mesh);

  const scene = useThree((state) => state.scene);

  const highlightMaterial = new MeshLambertMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0xff00ff,
    depthTest: false,
  });

  function handleDblClick(event: Intersection<IFCModel<Event>>) {
    if (Object.keys(manager.state.models).length) {
      manager.removeSubset(highlightedModel.id, highlightMaterial);
    }
    highlight(event, highlightMaterial);
  }

  function highlight(intersection: Intersection<IFCModel<Event>>, material: Material) {
    const { faceIndex } = intersection;
    const { modelID, geometry } = intersection.object;
    const id = manager.getExpressId(geometry, faceIndex);

    setHighlightedModel({ id: modelID });

    manager.state.models[modelID] = ifc;

    manager.createSubset({
      modelID,
      ids: [id],
      material,
      scene,
      removePrevious: true,
    });
  }

  return ifc ? (
    <primitive ref={mesh} object={ifc} onDoubleClick={handleDblClick} />
  ) : null;
}
