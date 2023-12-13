import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

//we will need one Mesh Object for each letter
//export the whole thing to a glb file so we can forget about the font
//and just treat them as regular vertex objects

export function loadFont(filename) {
  const loader = new FontLoader();

  return new Promise((resolve, reject) => {

    loader.load(
      filename,
      //load() calls this function if everything works out
      //so the Promise resolve() goes in here
      (font) => resolve(font),
      null,  //progress function
      (error) => reject(new Error(error))  //error function
    );
  });
}
