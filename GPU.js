import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
      renderer.shadowMap.type = THREE.PCFShadowMap; //THREE.VSMShadowMap;  //THREE.PCFSoftShadowMap //

      canvas.appendChild(renderer.domElement);
      this.canvas = canvas;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 3000);
      this.camera.position.set(0,400,700);
      
  
      //this.controls = new THREE.
      this.controls = new OrbitControls(this.camera, renderer.domElement);
      this.controls.minDistance = -10000;
      this.controls.maxDistance = 10000;
      this.controls.zoomSpeed = 1;

      this.mainLight = new THREE.DirectionalLight(0xFFFFFF, .3)
      this.mainLight.position.set(0,1,1).normalize();
      this.setShadow(this.mainLight)
      this.scene.add(this.mainLight)

      this.cameraLight = new THREE.PointLight(0xFFFFFF,.6)
      this.setShadow(this.cameraLight)
      this.camera.add(this.cameraLight)
      this.scene.add(this.camera)

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
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 1000;
    
      //have to set the range of the orthographic shadow camera
      //to cover the whole plane we are casting shadows onto
      //the shadows get fuzzier if these limits are much greater than the scene
      light.shadow.camera.left = -20;
      light.shadow.camera.bottom = -20;
      light.shadow.camera.right = 20;
      light.shadow.camera.top = 20;
    }

    render(groups) {
  
      //groups is an array of threejs groups or objects
      //whose parameters we will animate

      //console.log("render",this.scene);

      let prevRenderTime = Date.now();
      const fps = 20;
      const fpsInterval = 1000 / fps;
      requestAnimationFrame(renderLoop.bind(this));
  
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
  
        //console.log(this.scene);
        this.renderer.render(this.scene, this.camera);
      }

      return this;
    }
  }

  export default GPU