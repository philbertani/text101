import GPU from "./GPU";
import { textScene } from "./textScene.js";
import { d12 } from "./d12.js";
import { loadFont } from "./loadFont.js";
import { alphabetData } from "./alphabetData.js";
import { createAlphabet3d } from "./createAlphabet3d.js";
import { letterDie} from "./letterDie.js";

class App {

  letters;

  constructor() {
    console.log("apparently the document is loaded");
    this.canvas = document.getElementById("canvas");
    this.gpu = new GPU(this.canvas);

    this.d12 = new d12();
    this.typeFace = "helvetiker_regular.typeface.json";
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

    this.alphabet3d = new createAlphabet3d(this);  //send the app reference 

    //const group1 = textScene(this.gpu.scene,this.font3d);
    const letterDie1 = new letterDie(this);

    scene.add( letterDie1 );

    //now we can be sure everything has loaded before we kick off the render
    this.gpu.render();
  }
}

export default App;
