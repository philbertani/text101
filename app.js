import * as THREE from "three";
import GPU from "./GPU";
import { d12 } from "./d12.js";
import { d6 } from "./d6.js";
import { loadFont } from "./loadFont.js";
import { alphabetData } from "./alphabetData.js";
import { createAlphabet3d } from "./createAlphabet3d.js";
import { letterDie} from "./letterDie.js";
import { loadTextures } from "./loadTextures.js";
import { loadCubeMap} from "./loadCubeMap.js";

class App {

  letters;

  constructor() {
    console.log("apparently the document is loaded");
    this.canvas = document.getElementById("canvas");
    this.gpu = new GPU(this.canvas);

    //this.typeFace = "helvetiker_regular.typeface.json";
    //this.typeFace = "optimer_regular.typeface.json";
    this.typeFace = "gentilis_regular.typeface.json";
    this.alphabetData = new alphabetData();
    this.letters = this.alphabetData.get("ENGLISH");

    //async func to load/construct scene objects
    //then kick off the render() 
    this.sceneGraph();

  }

  async sceneGraph() {

    const {scene} = this.gpu;

    //use promises if a func is loading stuff from urls/filesytem
    this.font = await loadFont(this.typeFace);

    this.envMap = {};
    this.envMap.text01 = await loadTextures( 'text01.png' );
    ///this.envMap.text01.wrapS = THREE.RepeatWrapping;
    //this.envMap.text01.wrapT = THREE.RepeatWrapping;
    this.envMap.text01.colorSpace = THREE.SRGBColorSpace;

    //this.envMap.text01.repeat.set( 12,12 );
    this.envMap.text01.mapping = THREE.EquirectangularReflectionMapping;

    this.envMap.cubeMap01 = await loadCubeMap(['px.png','nx.png','py.png','ny.png','pz.png','nz.png']);
    //cube map works best, take six images 

    console.log("cubeMap",this.envMap.cubeMap01);
    scene.background = this.envMap.cubeMap01;

    this.d12 = new d12(this);
    this.d6 = new d6(this);

    this.alphabet3d = new createAlphabet3d(this);  //send the app reference 

    const letterDie1 = new letterDie(this,this.d12 );

    scene.add( letterDie1.group );

    const letterDie2 = new letterDie(this,this.d6);
    letterDie2.group.position.set(500,0,0);
    scene.add( letterDie2.group);

    //add shadows to everything here at once
    scene.traverse(x=>{if (x.isMesh) {x.castShadow=true;x.receiveShadow=true;} });

    this.groups = [letterDie1.group,letterDie2.group]
    //now we can be sure everything has loaded before we kick off the render
    this.gpu.render(this);
  }
}

export default App;
