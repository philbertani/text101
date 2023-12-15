import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GraphicsPipeline } from "./GraphicsPipeline";
import { SelectiveBloom } from "./SelectiveBloom";

//all threejs renderer initialization and lighting setup go in here

class GPU {

    renderer;  scene; camera; controls;
    mainLight; cameraLight;
    canvas = null;
    resized = false;
    controls = {};
  
    constructor(canvas) {

      this.canvas = canvas
      window.addEventListener("resize",this.handleResize.bind(this),false )

      const canvasDim = canvas.getBoundingClientRect();
      const [width, height] = [canvasDim.width, canvasDim.height];
      this.width = width; this.height = height;

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      const renderer = this.renderer;

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height, true);
      renderer.setClearColor("rgb(0,0,0)", 0);

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.needsUpdate = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.VSMShadowMap; //THREE.PCFShadowMap; //THREE.VSMShadowMap;  //THREE.PCFSoftShadowMap //

      canvas.appendChild(renderer.domElement);
      this.canvas = canvas;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 3000);
      this.camera.position.set(0,0,500);
      
  
      //this.controls = new THREE.
      this.controls = new OrbitControls(this.camera, renderer.domElement);
      this.controls.minDistance = -10000;
      this.controls.maxDistance = 10000;
      this.controls.zoomSpeed = 1;


      //this light is set at an offset from the camera position in render()
      this.pointLight01 = new THREE.PointLight(0xFFFFFF,.8);
      this.setShadow(this.pointLight01);
      this.scene.add(this.pointLight01);
   
      this.ambientLight =  new THREE.AmbientLight(0xFFFFF0,.4);
      this.scene.add(this.ambientLight);

      this.scene.add(this.camera)

      //this.scene.add( new THREE.CameraHelper( this.cameraLight.shadow.camera ) );

      return this;

    }
  
    handleResize() {
      console.log("resized")
      const canvasDim = canvas.getBoundingClientRect();
      const [width, height] = [canvasDim.width, canvasDim.height];
      this.width = width; this.height = height;

      //console.log(this)  don't forget to bind the GPU this context to callback functions
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize( width, height)
    }

    setShadow(light) {
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 1024;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 5000;
      light.shadow.bias = 1e-4;
      //have to set the range of the orthographic shadow camera
      //to cover the whole plane we are casting shadows onto
      //the shadows get fuzzier if these limits are much greater than the scene
      light.shadow.camera.left = -5000;
      light.shadow.camera.bottom = -5000;
      light.shadow.camera.right = 5000;
      light.shadow.camera.top = 5000;
    }

    wpos = new THREE.Vector3();

    adjustCamLight() {
      
      //negate x and y of camera pos so we always see point light shadow in the main view
      this.camera.getWorldPosition(this.wpos);
      this.wpos.x *= 1;
      this.wpos.y *= 1;
      this.wpos.z *= .8;
      this.pointLight01.position.copy(this.wpos);
    }

    render(groups) {
  
      //groups is an array of threejs groups or objects
      //whose parameters we will animate

      //console.log("render",this.scene);


      //get the THREE js object that will be the rendering master in the animation loop
      //instead of just this.renderer.render() we will have this.composer.render()
      //which will do multiple buffer passes and postprocessing

      //GraphicsPipeline needs access to the final this.scene in order
      //to set mesh.layers information

      /*
      this.composer = GraphicsPipeline(this);

      let prevRenderTime = Date.now();
      const fps = 30;
      const fpsInterval = 1000 / fps;
      requestAnimationFrame(renderLoop.bind(this));
      */

      SelectiveBloom(this, groups);
      

      function renderLoop(time) {
        requestAnimationFrame(renderLoop.bind(this));
  
        //console.log(time);
        //throttle the fps because without it just maxes
        //out the GPU for no good reason, for example it will
        //redisplay the same scene at 240 fps on this computer
        const currentRenderTime = Date.now();
        const elapsed = currentRenderTime - prevRenderTime;
        if (elapsed < fpsInterval) return;
        prevRenderTime = currentRenderTime - (elapsed % fpsInterval);
        time *= 0.001; //convert from milliseconds to seconds
  
        
        for (const group of groups) {
          //console.log(group);
          //group.traverse(x=>{ if (x.userData.type==="letter") x.rotation.x += .04 });
        }
        
        this.adjustCamLight();

        //console.log(this.scene);
        //this.renderer.render(this.scene, this.camera);
        this.composer.render();

      }

      return this;
    }
  }

  export default GPU