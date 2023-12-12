import GPU from "./GPU";
import { textScene } from "./textScene.js";

class App {
  constructor() {
    console.log("apparently the document is loaded");
    this.canvas = document.getElementById("canvas");
    this.gpu = new GPU(this.canvas);

    //async func to load/construct scene objects
    //then kick off the render() 
    this.sceneGraph();

  }

  async sceneGraph() {
    //add calls to various functions that add scene elements
    //return a pointer and a function so they can be passed to render 
    //for animation

    //each scene function should return:
    //{object:(threejs object), animateFN:(animation function)}
    //wrap in promise if it is loading stuff from urls/filesytem
    const group1 = await textScene(this.gpu.scene);

    this.gpu.render(group1);
  }
}

export default App;
