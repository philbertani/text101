import * as THREE from "three";

export class letterDie {

  constructor(app) {
    this.app = app;
    console.log('zzzzzzzzzzz',app);
    return this.pasteLettersOnPolyhedron(this.app.d12);
  }

  chooseLetter( ) {
    //input is a map whose keys are the letters
    const {letters} = this.app; //maybe have option to pass in a group of letters?
    const rnd = Math.trunc(Math.random()*letters.length);
    return letters[rnd];
  }

  pasteLettersOnPolyhedron(polyhedron) {

    //polyhedron model is passed in which needs to have: faceCenters property
    //app should provide a function: chooseLetters which determines which letters to paste
    //alphabet3d is an array of mesh objects that are the 3d vertex models of letters
    const group = new THREE.Group();

    const {faceCenters} = polyhedron;
    const {alphabet3d} = this.app;

    for (let i=0; i<faceCenters.length; i++) {
      const faceCenter = faceCenters[i];
      const letter = this.chooseLetter();
      console.log('xxxxxxxx',letter, alphabet3d[letter]);
      const letter3d = alphabet3d[letter].clone(); //make sure to make a copy

      const sc=100;
      letter3d.position.set( sc*faceCenter[0],sc*faceCenter[1],sc*faceCenter[2]);
      group.add(letter3d);
    }

    return group;
  }

}