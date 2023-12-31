import * as THREE from "three";

export class letterDie {

  //the letters start out facing the positive z direction
  UP = new THREE.Vector3(0, 0, 1);

  constructor(app, polyhedron) {
    this.app = app;
    this.group = this.pasteLettersOnPolyhedron(polyhedron);
    return this;
  }

  chooseLetter() {
    //input is a map whose keys are the letters
    const { letters } = this.app; //maybe have option to pass in a group of letters?
    const rnd = Math.trunc(Math.random() * letters.length);
    return letters[rnd];
  }

  *nextLetter(index) {
    const letters = ["A","B", "C", "D", "E", "F","G"];
    while (index < 1e6) {
      if (index > 5) index = 0;
      yield letters[index];
      index++;
    }
  }
  pasteLettersOnPolyhedron(polyhedron) {
    //polyhedron model is passed in which needs to have: faceCenters property
    //app should provide a function: chooseLetters which determines which letters to paste
    //alphabet3d is an array of mesh objects that are the 3d vertex models of letters
    const group = new THREE.Group();

    const { faceCenters } = polyhedron;
    const { alphabet3d } = this.app;

    const sc = 120;  //scale factor
    //watch out material needs to be cloned separately
    const newLetter = this.nextLetter(0);
    for (let i = 0; i < faceCenters.length; i++) {
      const faceCenter = faceCenters[i];

      const letter = this.chooseLetter(); //newLetter.next().value;
      //const letter = i < 1 ? "A" : "X";

      const letter3d = alphabet3d[letter].clone(); //make sure to make a copy

      const [dx, dy, dz] = [0,0,0];

      letter3d.position.set(
        sc * faceCenter[0] + dx,
        sc * faceCenter[1] + dy,
        sc * faceCenter[2] + dz
      );

      const faceNormal = new THREE.Vector3(
        faceCenter[0],
        faceCenter[1],
        faceCenter[2]
      ).normalize();

      letter3d.name = letter;
      letter3d.quaternion.setFromUnitVectors(this.UP, faceNormal);
      
      letter3d.userData = {name: letter, type:"letter"};

      group.add(letter3d);

    }

    if ( polyhedron.baseModel) {
      const sc2 = sc*1.5;
      polyhedron.baseModel.geometry.scale(sc2,sc2,sc2);
      group.add(polyhedron.baseModel); //add the actual cube or d12 or whatever
    }
    
    if ( polyhedron.outerShell) {
      const sc2 = sc*1.6;
      polyhedron.outerShell.geometry.scale(sc2,sc2,sc2);
      group.add(polyhedron.outerShell); //add the actual cube or d12 or whatever
    }


    return group;
  }
}