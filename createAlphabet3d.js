import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

//we will need one Mesh Object for each letter
//export the whole thing to a glb file so we can forget about the font
//and just treat them as regular vertex objects

export class createAlphabet3d {

  letters3d = {};

  constructor(app) {

    this.app = app;  //app has letters and font properties where font is now the 3d typeface read in
    //console.log('xxxxxxxxxx',this.app);

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

  centerObject(geo) {

    //center a bunch of vertices by subtracting off the barycenter  
    //so we can rotate them properly later on

    geo.computeBoundingBox();

    const bb = geo.boundingBox;
    const [dx, dy, dz] = 
      [
        .5 * (bb.max.x - bb.min.x),
        .5 * (bb.max.y - bb.min.y),
        .5 * (bb.max.z - bb.min.z)
      ];
    
    const pos= geo.getAttribute("position");
    let coords = pos.array;
    let sum=[0,0,0]; //x,y,z ok?
    for (let i=0; i< coords.length-pos.itemSize ; i+=pos.itemSize) {
      const [x,y,z] = [coords[i],coords[i+1],coords[i+2]];    
      sum[0]+=x; sum[1]+=y; sum[2]+=z;
    }

    sum[0]/=pos.count;sum[1]/=pos.count;sum[2]/=pos.count;
    for (let i=0; i< coords.length-2; i+=pos.itemSize) {
      coords[i] -= dx; //sum[0];
      coords[i+1] -= dy; //sum[1];
      coords[i+2] -= dz; //sum[2];
    }
    const posAttrib = new THREE.BufferAttribute(coords,3);
    geo.setAttribute("position", posAttrib);

  }

  create3dLetter(letter) {

    //console.log('createing 3d model for:',letter);

    const {font} = this.app;
    const textGeo = new TextGeometry(letter, {
      font: font,
      size: 100,
      height: 80,
      curveSegments: 10,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 10,
    });


    const material = new THREE.MeshPhongMaterial({
      color: "black", //"rgb(120,100,0)",
      shininess: 100,
      emissive: "rgba(100,100,0,1)"
    });
  
    this.centerObject(textGeo);

    const textMesh = new THREE.Mesh(textGeo, material);

    return textMesh;
     
  }
}

