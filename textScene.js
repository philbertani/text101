import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export function textScene(scene,font) {
  const textGeo = new TextGeometry("Holy Shit!", {
    font: font,
    size: 80,
    height: 30,
    curveSegments: 10,
    bevelEnabled: false,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 10,
  });

  textGeo.computeBoundingBox();
  const centerOffset =
    -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  const material = new THREE.MeshPhongMaterial({
    color: "rgb(255,200,0)",
    shininess: 100,
  });

  const textMesh1 = new THREE.Mesh(textGeo, material);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = 30;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  scene.add(textMesh1);

  return textMesh1;
}
