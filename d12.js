import { GeometryStuff } from "./GeometryStuff";
import * as THREE from "three";

//an amazing reference for computing stuff for d12 is:
//https://math.stackexchange.com/questions/2538897/equations-of-facelets-of-dodecahedron
//the person wrote a FORTRAN program to solve the 5 cycles of the adjaceny graph!!

export class d12 extends GeometryStuff {

  name = "d12";

  //20 vertices
  vertices = [
    [0.618033988749895, 0, 1.6180339887499],
    [1.6180339887499, 0.618033988749895, 0],
    [0, 1.6180339887499, 0.618033988749895],
    [-0.618033988749895, 0, -1.6180339887499],
    [-1.6180339887499, 0.618033988749895, 0],
    [0, 1.6180339887499, -0.618033988749895],
    [0.618033988749895, 0, -1.6180339887499],
    [1.6180339887499, -0.618033988749895, 0],
    [0, -1.6180339887499, -0.618033988749895],
    [-0.618033988749895, 0, 1.6180339887499],
    [-1.6180339887499, -0.618033988749895, 0],
    [0, -1.6180339887499, 0.618033988749895],
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, 1, 1],
    [1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
    [-1, -1, -1],
  ];

  //12 faces - shit the indices start at 1!
  faces = [
    [1, 10, 16, 3, 13],
    [1, 10, 19, 12, 18],
    [1, 13, 2, 8, 18],
    [2, 8, 17, 7, 14],
    [2, 13, 3, 6, 14],
    [3, 6, 15, 5, 16],
    [4, 7, 14, 6, 15],
    [4, 7, 17, 9, 20],
    [4, 15, 5, 11, 20],
    [5, 11, 19, 10, 16],
    [8, 17, 9, 12, 18],
    [9, 12, 19, 11, 20],
  ];

  N = 5;  //number of vertices in one face
  D = 3;  //number of dimensions
  constructor(app) {

    super();

    this.app = app;
    this.computeFaceCenters();  

    this.baseModel = new THREE.Mesh(
      //new THREE.SphereGeometry(1),
      new THREE.DodecahedronGeometry(1),
      new THREE.MeshPhongMaterial({
        color: "rgb(150,150,250)",  //white makes texture show up with its original colors
        shininess: 200,
        //map: this.app.envMap.text01
        envMap: this.app.envMap.cubeMap01,
        emissive: "rgb(0,0,100)"
        
      })
    );

    /*
    this.outerShell = new THREE.Mesh(
      //new THREE.SphereGeometry(1),
      new THREE.DodecahedronGeometry(1),
      new THREE.MeshPhongMaterial({
        color: "rgb(0,50,200)",
        transparent: true,
        opacity: 0.2,
        emissive: "rgba(0,0,200,1)"
      })
    );
    */

    const sf = 1.3;
    this.baseModel.geometry.scale(sf,sf,sf);
    this.baseModel.rotation.x = Math.PI/2;

    //const sf2 = 1.3;
    //this.outerShell.rotation.x = Math.PI/2;
    //this.outerShell.geometry.scale(sf2,sf2,sf2);

  }

}