import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";


//we will need one Mesh Object for each letter
//export the whole thing to a glb file so we can forget about the font
//and just treat them as regular vertex objects

export function textScene(scene) {
  const loader = new FontLoader();

  return new Promise((resolve, reject) => {

    loader.load(
      "helvetiker_regular.typeface.json",

      //load() calls this function if everything works out
      //so the Promise resolve() goes in here
      function (font) {

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
        const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

        const material = new THREE.MeshPhongMaterial( {color:"rgb(255,200,0)", shiniess:100 });

        const textMesh1 = new THREE.Mesh(textGeo, material);

				textMesh1.position.x = centerOffset;
				textMesh1.position.y = 30;
				textMesh1.position.z = 0;

				textMesh1.rotation.x = 0;
				textMesh1.rotation.y = Math.PI * 2;

        scene.add(textMesh1);

        //console.log(scene);

        resolve (textMesh1);
      },

      null,  //progress function
      (error) => reject(new Error(error))  //error function
    );
  });
}
