/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */





import { WebGLRenderer, OrthographicCamera, Vector3, Group } from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { ControlPanel } from 'scenes';
import * as THREE from 'three';

// GLobal Variables
let panel_view = 1; // Toggles module panel (1 is on, 0 off) - DO WE WANT TO DO This??
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let patch_mode = 0;
let patch_source;
var CURRENT_KNOB = undefined;
let default_wire_colors = [0x68e8d7,0xbf69f0,0xf0628d,0xf25e5e,0xf59d5d,0xc4ed5f,0x95f059, 0x58ed82, 0x53eddd, 0x51b1e8, 0x5771f2];
//let default_wire_colors = [0xff0000,0xffa500,0xffff00,0x008000,0x0000ff,0x4b0082,0xee82ee]; //Source: https://colorswall.com/palette/102

// Initialize core ThreeJS components
const scene = new ControlPanel(WIDTH, HEIGHT);
const renderer = new WebGLRenderer({ antialias: true });
const aspectRatio = WIDTH / HEIGHT;
const cameraWidth = WIDTH;
const cameraHeight = cameraWidth / aspectRatio;
const camera = new OrthographicCamera(
    cameraWidth / -2, // left
    cameraWidth / 2, // right
    cameraHeight / 2, // top
    cameraHeight / -2, // bottom
    0, // near plane
    150 // far plane
);
camera.position.set(0, 0, 0.5);
camera.lookAt(new Vector3(0, 0, 0));

var raycaster = new THREE.Raycaster();

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);
// renderer.setViewport(911, 530);
//console.log(renderer.getSize());
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// DO WE NEED TO ADD ANY TEXT HERE? Tutorial popup?


// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    scene.update && scene.update(timeStamp); // MIGHT NEED TO SWITCH THIS WITH THE LINE BELOW
    renderer.render(scene, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
    scene.invalidate();
    //displayImage(scene.getImage, 0, -100);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// Click event handler (Patching and removing cables, turning knobs)
window.addEventListener('mousedown', onMouseDown, false);
var selected;
function onMouseDown(e) {
    //console.log("onmousedown");
    if(e.which==3){
        //right click
        return;
    }

    // Getting mouse position
    var mouse = new THREE.Vector2(e.pageX, e.pageY);
    mouse.x /= WIDTH;
    mouse.y /= HEIGHT;
    mouse.multiplyScalar(2);
    mouse.subScalar(1);
    mouse.y *= -1;

    // Casting a ray to determine which object is being clicked on
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.get_objects(), true);
    if (intersects.length==0){return;}
    selected = intersects[0];
    while(selected.object.parent.name == "Button" && selected.object !== selected.object.parent.children[0]){
        //console.log("wire collision skip");
        intersects.shift();
        if (intersects.length==0){return;}
        selected = intersects[0];
    }
    console.log("Mousedown event on ",selected.object.parent.name);

    if (selected.object.parent.name == "Button") {
        let clickedBtn = selected.object.parent;

        if(clickedBtn.linked !== undefined) {
            clickedBtn.unlink();
            return;
        }

        if (patch_mode == 1) {
            if (patch_source.type != clickedBtn.type) {
                if(clickedBtn.parent === patch_source.parent) {
                    patch_source.decolor();
                    patch_mode = 0;
                    patch_source = undefined;
                    alert("Do not link input and output from the same module."); 
                    return;
                }
                else{
                    clickedBtn.link(patch_source);
                    patch_mode = 0;
                    patch_source = undefined;
                    return;
                }
                
            }
            else if(clickedBtn === patch_source){
                //cancel patching
                clickedBtn.decolor();
                patch_mode = 0;
                patch_source = undefined;
            }
            else {
                patch_source.decolor();
                patch_mode = 0;
                patch_source = undefined;
                alert("Cannot link two ports of the same type e.g. input to input."); return;
            }
        }
        else {
            patch_mode = 1;
            patch_source = clickedBtn;
            clickedBtn.prepareForLink(default_wire_colors);
            return;
        }
    }
    // Knob turning
    else if (selected.object.parent.name === "Knob") {
        //console.log("knob code still running");
        CURRENT_KNOB = selected.object.parent;
        CURRENT_KNOB.knobClicked(CURRENT_KNOB, e.pageY);
        window.addEventListener("mousemove", onMouseMoveKnob);
        window.onmouseup = function () {
            window.removeEventListener('mousemove', onMouseMoveKnob);
            CURRENT_KNOB.knobDeselected(CURRENT_KNOB);
            CURRENT_KNOB = undefined;
            window.onmouseup = null;
        };
    }
    
}

// Handling knob turning
function onMouseMoveKnob(event) {
    //console.log("onMouseMoveKnob with event Y ", event.pageY);
    CURRENT_KNOB.knobMove(CURRENT_KNOB, event.pageY);
}
