//all processing, postprocessing, render to textures, etc will get setup in this file

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing//ShaderPass.js';
import { bloomFragmentShader, bloomVertexShader } from './bloomShaders';
import * as THREE from "three";

const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
const params = {
  threshold: 0,
  strength: 1.3,
  radius: 2,
  exposure: 1.3
};
const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

export function SelectiveBloom(GPU, groups) {

  const {width, height, scene, camera, renderer} = GPU;

  console.log("scene", scene);

  const renderScene = new RenderPass( scene, camera );

  const bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 1.5, 0.4, 0.85 );
  bloomPass.threshold = params.threshold;
  bloomPass.strength = params.strength;
  bloomPass.radius = params.radius;

  const bloomComposer = new EffectComposer( renderer );
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass( renderScene );
  bloomComposer.addPass( bloomPass );

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial( {
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture }
      },
      vertexShader: bloomVertexShader,
      fragmentShader: bloomFragmentShader,
      defines: {}
    } ), 'baseTexture'
  );
  mixPass.needsSwap = true;

  const outputPass = new OutputPass();

  const finalComposer = new EffectComposer( renderer );
  finalComposer.addPass( renderScene );
  finalComposer.addPass( mixPass );
  finalComposer.addPass( outputPass );

  function render() {

    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );

    // render the entire scene, then render bloom scene on top
    finalComposer.render();

  }

  function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

      materials[ obj.uuid ] = obj.material;
      obj.material = darkMaterial;

    }

  }

  function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

      obj.material = materials[ obj.uuid ];
      delete materials[ obj.uuid ];

    }

  }

  function onPointerDown( event ) {

    mouse.x = ( event.clientX / width ) * 2 - 1;
    mouse.y = - ( event.clientY / height ) * 2 + 1;
  
    raycaster.setFromCamera( mouse, camera );

    //console.log(groups[0].children);

    const intersects = raycaster.intersectObjects( scene.children, true );

    //console.log(intersects);

    if ( intersects.length > 0 ) {
  
      const object = intersects[ 0 ].object;
      object.layers.toggle( BLOOM_SCENE );
      render();
  
    }
  }
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  window.addEventListener( 'pointerdown', onPointerDown );


  //this is in animation loop
  render();

}



