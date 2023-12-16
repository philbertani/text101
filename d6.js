import { GeometryStuff } from "./GeometryStuff";
import * as THREE from "three";

export class d6 extends GeometryStuff {

  name = "d6";
  
  vertices = [
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, 1, 1],
    [1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
    [-1, -1, -1],
  ];

  faces = [
    [1,2,3,4],
    [1,2,5,6],
    [1,6,7,4],
    [2,5,8,3],
    [3,4,7,8],
    [7,6,5,8]

  ]

  N = 4;  //number of vertices in one face
  D = 3;  //number of dimensions
  constructor() {
    super();
    this.computeFaceCenters(); 
    this.baseModel = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({
        color: "rgb(50,50,200)",
        shininess: 200
      })
    );

    const sf = 1.5;
    this.baseModel.geometry.scale(sf,sf,sf);
     
  }
}
