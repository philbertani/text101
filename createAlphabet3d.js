import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

//we will need one Mesh Object for each letter
//export the whole thing to a glb file so we can forget about the font
//and just treat them as regular vertex objects

export class createAlphabet3d {

  letters3d = {};

  constructor(app) {

    this.app = app;  //app has letters and font properties where font is now the 3d typeface read in
    console.log('xxxxxxxxxx',this.app);

    return this.constructVertexModels();

  }

  constructVertexModels() {
    const {letters} = this.app;  //app controls the alphabet
    
    for (let i=0; i< letters.length; i++) {
      const letter = letters[i];
      this.letters3d[letter] = this.create3dLetter(letter);
    }

    return this.letters3d;
  }

  create3dLetter(letter) {

    console.log('createing 3d model for:',letter);

    const {font} = this.app;
    const textGeo = new TextGeometry(letter, {
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


    const material = new THREE.MeshPhongMaterial({
      color: "rgb(255,200,0)",
      shininess: 100,
    });
  
    const textMesh = new THREE.Mesh(textGeo, material);

    //a bunch of boxes is centered - the letters are not
    //const textMesh = new THREE.Mesh( new THREE.BoxGeometry(100,100,100), material);

    textMesh.receiveShadow = true;
    textMesh.cashShadow = true;

    return textMesh;
     
  }
}
