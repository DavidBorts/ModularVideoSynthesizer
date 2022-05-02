import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Module, Screen } from 'objects';
import { BasicLights } from 'lights';

class ControlPanel extends Scene {

    constructor(width, height) {
        
        // Call parent Scene() constructor
        super(width, height);

        this.width = width;
        this.height = height;
        this.MODULE_WIDTH = this.width / 10;
        var MODULE_WIDTH = this.MODULE_WIDTH;
        this.MODULE_HEIGHT = this.height / 2;
        var MODULE_HEIGHT = this.MODULE_HEIGHT;
        this.LFO_HEIGHT = this.MODULE_HEIGHT / 3;
        var LFO_HEIGHT = this.LFO_HEIGHT;

        // Initialize state
        this.state = {
            gui: new Dat.GUI(), // Create separate GUI for global scene effects
            updateList: [],
            invalidateList: []
        };

        // Set background to black
        this.background = new Color(0x000000);

        // Scaling dimensions to screen
        let ymax = height / 2;
        let ymin = ymax * -1;
        let xmax = width / 2;
        let xmin = xmax * -1;
        //let xmin = 0;
        //let xmax = width;

        // Add meshes to scene
        let num = 0;
        let num_LFO = 0;
        // 3 LFOs
        const LFO1 = new Module(this, "LFO", xmin + (num * MODULE_WIDTH) /*+ (MODULE_WIDTH / 2)*/, ymin + (num_LFO++ * LFO_HEIGHT) + (LFO_HEIGHT / 2));
        const LFO2 = new Module(this, "LFO", xmin + (num * MODULE_WIDTH), ymin + (num_LFO++ * LFO_HEIGHT) + (LFO_HEIGHT / 2));
        const LFO3 = new Module(this, "LFO", xmin + (num++ * MODULE_WIDTH), ymin + (num_LFO * LFO_HEIGHT) + (LFO_HEIGHT / 2));
        // 3 color LFOs
        num_LFO = 0;
        const LFO_Color1 = new Module(this, "LFO_Color", xmin + (num * MODULE_WIDTH), ymin + (num_LFO++ * LFO_HEIGHT) + (LFO_HEIGHT / 2));
        const LFO_Color2 = new Module(this, "LFO_Color", xmin + (num * MODULE_WIDTH), ymin + (num_LFO++ * LFO_HEIGHT) + (LFO_HEIGHT / 2));
        const LFO_Color3 = new Module(this, "LFO_Color", xmin + (num++ * MODULE_WIDTH), ymin + (num_LFO++ * LFO_HEIGHT) + (LFO_HEIGHT / 2));
        // 3 Ramps
        const Ramp1 = new Module(this, "Ramp", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        const Ramp2 = new Module(this, "Ramp", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        const Ramp3 = new Module(this, "Ramp", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        // 3 Waves
        const Wave1 = new Module(this, "Wave", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        const Wave2 = new Module(this, "Wave", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        const Wave3 = new Module(this, "Wave", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        // 1 Vignette
        const Vignette = new Module(this, "Vignette", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        // 1 Output
        const Output = new Module(this, "Output", xmin + (num++ * MODULE_WIDTH), ymin + (MODULE_HEIGHT / 2));
        // 1 Screen
        let x_screen = 0;
        let y_screen = 100;
        this.Screen = new Screen(this, "Screen", Output, x_screen, y_screen);
        
        // Adding modules as children
        this.add(LFO1, LFO2, LFO3, LFO_Color1, LFO_Color2, LFO_Color3,
            Ramp1, Ramp2, Ramp3, Wave1, Wave2, Wave3, Vignette, Output, this.Screen);
        
        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object); // WIRES SHOULD NOT BE ADDED TO UPDATE LIST - WILL MESS UP RAYCASTING!!!
    }

    addToInvalidateList(object) {
        this.state.invalidateList.push(object);
    }

    update(timeStamp) {
        this.Screen.update(timeStamp);
    }

    invalidate() {
        for (var object of this.state.invalidateList) {
            object.invalidate();
        }
    }

    get_objects() {
        return this.state.updateList;
    }

    getImage() {
        console.log("getting image");
        var new_image = new Image(100, 100);
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                new_image.setPixel(new Pixel(0.5, 0.5, 0)); // FINISH THIS
            }
        }
        return new_image;
        // const screen =  this.children[this.children.length - 1];
        // return screen.getImage();
    }
}

export default ControlPanel;
