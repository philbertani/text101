import * as THREE from "three";

//we will need one Mesh Object for each letter
//export the whole thing to a glb file so we can forget about the font
//and just treat them as regular vertex objects

export function loadCubeMap(filenamesArray) {
  const loader = new  THREE.CubeTextureLoader();  //.setPath("")

  return new Promise((resolve, reject) => {

    loader.load(
      filenamesArray,
      //load() calls this function if everything works out
      //so the Promise resolve() goes in here
      (cubeMap) => resolve(cubeMap),
      null,  //progress function
      (error) => reject(new Error(error))  //error function
    );
  });
}
