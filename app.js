import GPU from "./GPU";
import { textScene } from "./textScene.js";
import { d12 } from "./d12.js";
import { loadFont } from "./loadFont.js";
import { alphabetData } from "./alphabetData.js";
import { createAlphabet3d } from "./createAlphabet3d.js";

class App {
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

    //use promises if a func is loading stuff from urls/filesytem
    this.font = await loadFont(this.typeFace);

    const alphabet3d = new createAlphabet3d(this);  //send the app reference 

    //const group1 = textScene(this.gpu.scene,this.font3d);

    this.gpu.scene.add( alphabet3d['A'] );

    //now we can be sure everything has loaded before we kick off the render
    this.gpu.render();
  }
}

export default App;
