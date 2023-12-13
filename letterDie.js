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
      //console.log('xxxxxxxx',letter, alphabet3d[letter]);
      const letter3d = alphabet3d[letter].clone(); //make sure to make a copy
      letter3d.geometry.computeBoundingBox();
      const bb = letter3d.geometry.boundingBox;
      const [dx,dy,dz] = [-.5*(bb.max.x-bb.min.x), -.5*(bb.max.y-bb.min.y),  -.5*(bb.max.z-bb.min.z)];
      
      const sc=120;
      letter3d.position.set( sc*faceCenter[0]+dx,sc*faceCenter[1]+dy,sc*faceCenter[2]+dz);

      letter3d.castShadow = true;
      letter3d.receiveShadow = true;
      
      const dir = new THREE.Vector3( faceCenter[0], faceCenter[1], faceCenter[2]).normalize();
      //letter3d.lookAt( dir );

      group.add(letter3d);
    }

    return group;
  }

}