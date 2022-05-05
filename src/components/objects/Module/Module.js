import * as THREE from 'three';
import { Group } from 'three';
import { Knob } from '../Knob';
import { Button } from '../Button';

// Screen parameters
let SCREEN_WIDTH = 100; //width of output screen
let SCREEN_HEIGHT = 100; //height of output screen

class Module extends Group {
    constructor(parent, type, x, y) {
        // parent: parent in the scene graph of this module (always the ControlPanel)
        // type: type of module (Ramp, Wave, LFO, Vignette, Output)
        // x: horizontal position of module
        // y: vertical position of module

        // Call parent Group() constructor
        super();

        // Variables
        this.parent = parent; // ControlPanel object
        this.name = type; // type of module
        this.input_list = []; // List of all input ports
        this.output_list = []; // List of all output ports
        this.knob_list = []; // List of all knobs
        this.updated = false; // Have the module's outputs been updated during a given time step?

        //layout
        this.knobs_per_row = 2;
        this.input_btns_per_row = 3;
        this.output_btns_per_row = 3;
        this.min_padding_vert = 2;
        this.min_padding_horiz = 2;

        this.between_inputrow_spacing_pct = 11;
        this.between_outputrow_spacing_pct = 11;
        this.between_knobrow_spacing_pct = 17;


        // Functions
        // (used to update their corresponding module types during each time step)
        this.Ramp_function = function(x, y, input_list, knob_list, output_list, timestep) {
    
            let inputs = [];

            // Extracting function inputs
            for (let i = 0; i < input_list.length; i++) {
                const input = input_list[i];
                const source = input.linked;
                const knob = knob_list[i];
    
                if (source === undefined) {
                    inputs.push(knob.data);
                }
                else {
                    if (!source.parent.updated) {
                        source.parent.update(timestep);
                        inputs.push(source.data[x][y]);
                    }
                    else if (source.data === undefined) {

                        //the module it's linked to is broken / invalid inputs
                        inputs.push(knob.data);
                    }
                    else {
                        inputs.push(source.data[x][y]);
                    }
                }
            }
            
            // Interpolating between 0 and max value, depending on x
            let in1 = inputs[0];
            let in2 = inputs[1];
            let in3 = inputs[2];

            // Ramp along x-axis
            output_list[0].data[x][y] = in1 * (y / SCREEN_HEIGHT);  
            output_list[1].data[x][y] = in2 * (y / SCREEN_HEIGHT);   
            output_list[2].data[x][y] = in3 * (y / SCREEN_HEIGHT);

            // Ramp along y-axis
            output_list[3].data[x][y] = in1 * (x / SCREEN_WIDTH);  
            output_list[4].data[x][y] = in2 * (x / SCREEN_WIDTH);   
            output_list[5].data[x][y] = in3 * (x / SCREEN_WIDTH);          
        };

        this.Wave_function  = function(x, y, input_list, knob_list, output_list, timestep) {
    
            let inputs = [];

            // Extracting function inputs
            for (let i = 0; i < input_list.length; i++) {
                const input = input_list[i];
                const source = input.linked;
                const knob = knob_list[i];
    
                if (source === undefined) {
                    inputs.push(knob.data);
                }
                else {
                    if (!source.parent.updated) {
                        source.parent.update(timestep);
                        inputs.push(source.data[x][y]);
                    }
                    else if (source.data === undefined) {

                        //the module it's linked to is broken / invalid inputs
                        inputs.push(knob.data);
                    }
                    else {
                        inputs.push(source.data[x][y]);
                    }
                }
            }
            
            // Interpolating between black and the maximum value, depending on x
            const in1 = inputs[0];
            const in2 = inputs[1];
            const in3 = inputs[2];
            const frequency = inputs[3];

            // Wave along x-axis
            output_list[0].data[x][y] = (in1 / 2) * Math.sin(frequency * y) + (in1 / 2);
            output_list[1].data[x][y] = (in2 / 2) * Math.sin(frequency * y) + (in2 / 2);     
            output_list[2].data[x][y] = (in3 / 2) * Math.sin(frequency * y) + (in3 / 2); 
             
            // Wave along y-axis
            output_list[3].data[x][y] = (in1 / 2) * Math.sin(frequency * x) + (in1 / 2);
            output_list[4].data[x][y] = (in2 / 2) * Math.sin(frequency * x) + (in2 / 2);     
            output_list[5].data[x][y] = (in3 / 2) * Math.sin(frequency * x) + (in3 / 2);  
        };
        
        this.LFO_function = function(x, y, input_list, knob_list, output_list, timestep) {
    
            let inputs = [];

            // Extracting function inputs
            for (let i = 0; i < input_list.length; i++) {
                const input = input_list[i];
                const source = input.linked;
                const knob = knob_list[i];
    
                if (source === undefined) {
                    inputs.push(knob.data);
                }
                else {
                    if (!source.parent.updated) {
                        source.parent.update(timestep);
                        inputs.push(source.data[x][y]);
                    }
                    else if (source.data === undefined) {

                        //the module it's linked to is broken / invalid inputs
                        inputs.push(knob.data);
                    }
                    else {
                        inputs.push(source.data[x][y]);
                    }
                }
            }

            // Sine function
            const frequency = inputs[0] / 60; // Divide to account for framerate
            const amplitude = inputs[1] / 2; // Divide to rescale to [0, 0.5] 
            const center = inputs[2];

            let value = amplitude * Math.sin(frequency * timestep) + center;
            if (value > 1) {
                value = 1;
            }
            if (value < 0) {
                value = 0;
            }

            output_list[0].data[x][y] = value;
            output_list[1].data[x][y] = value;
            output_list[2].data[x][y] = value;
        };
        
        this.Vignette_function = function(x, y, input_list, knob_list, output_list, timestep) {
    
            let inputs = [];

            // Extracting function inputs
            for (let i = 0; i < input_list.length; i++) {
                const input = input_list[i];
                const source = input.linked;
                var knob = undefined;
                if (i < knob_list.length) {
                    knob = knob_list[i];
                }
    
                if (source === undefined) {
                    // Setting default values to 0 for unused input channels
                    if (knob === undefined) {
                        inputs.push(0);
                    }
                    else {
                        inputs.push(knob.data);
                    }
                }
                else {
                    if (!source.parent.updated) {
                        source.parent.update(timestep);
                        inputs.push(source.data[x][y]);  // DO WE NEED THIS??
                    }
                    else if (source.data === undefined) {

                        //the module it's linked to is broken / invalid inputs
                        if (knob === undefined) {
                            inputs.push(0);
                        }
                        else {
                            inputs.push(knob.data);
                        }
                    }
                    else {
                        inputs.push(source.data[x][y]);
                    }
                }
            }
            
            // Filtering out edges for channel 1 and edges for channel 2
            // (code adapted and/or sourced from David Borts' Assignment 1 for COS426)
            const center_x = inputs[0] * 100; // Multiply to rescale to [0, 100]
            const center_y = inputs[1] * 100; // Multiply to rescale to [0, 100]
            let inner_radius = inputs[2] * 0.80; // Multiply to rescale to [0, 0.80]
            let outer_radius = inputs[3] * 0.80; // Multiply to rescale to [0, 0.80]
            const h1 = inputs[4];
            const s1 = inputs[5];
            const v1 = inputs[6];
            const h2 = inputs[7];
            const s2 = inputs[8];
            const v2 = inputs[9];

            // Constrain val to the range [min, max]
            function clamp(val, min, max) {
                return val < min ? min : val > max ? max : val;
            }
            
            // Ensure that inner_radius is at least 0.1 smaller than outer_radius
            inner_radius = clamp(inner_radius, 0, outer_radius - 0.1);

            // Finding the screen's diagonal
            let diagonal = Math.sqrt((100 * 100) * 2) / 2;

            // Finding the distance from the center of the image
            let diffX = Math.pow((center_y - 1 - x), 2);
            let diffY = Math.pow((center_x - 1 - y), 2);
            let distance = Math.sqrt(diffX + diffY);

            // Variables
            var new_v1, new_v2, a;

            // If the point is within the radii, calculate the value depending on the distance from center
            if (distance / diagonal >= inner_radius && distance / diagonal <= outer_radius) {
    
                // Calculating new value for channel 1
                a = 1 - parseFloat((distance / diagonal - inner_radius) / (outer_radius - inner_radius));
                new_v1 = v1 * a;
                output_list[0].data[x][y] = h1;
                output_list[1].data[x][y] = s1;
                output_list[2].data[x][y] = new_v1;

                // Calculating new value for channel 2
                new_v2 = v2 * (1 - a);
                output_list[3].data[x][y] = h2;
                output_list[4].data[x][y] = s2;
                output_list[5].data[x][y] = new_v2;
            } 
            // If the point is outside the circles, set value for channel 1 to 0
            else if (distance / diagonal > outer_radius) {
                
                new_v1 = 0;
                output_list[0].data[x][y] = h1;
                output_list[1].data[x][y] = s1;
                output_list[2].data[x][y] = new_v1;

                output_list[3].data[x][y] = h2;
                output_list[4].data[x][y] = s2;
                output_list[5].data[x][y] = v2;
                
            } 
            // If the point is inside the circles, set value for channel 2 to 0
            else if (distance / diagonal < inner_radius) {
                
                output_list[0].data[x][y] = h1;
                output_list[1].data[x][y] = s1;
                output_list[2].data[x][y] = v1;

                new_v2 = 0;
                output_list[3].data[x][y] = h2;
                output_list[4].data[x][y] = s2;
                output_list[5].data[x][y] = new_v2;
            }
            
        };

        this.Output_function = function(x, y, input_list, knob_list, output_reference, timestep) {
    
            let inputs = [];
    
            // Extracting function inputs
            for (let i = 0; i < input_list.length; i++) {
                const input = input_list[i];
                const source = input.linked;
                var knob = undefined;
                if (i >= input_list.length - knob_list.length) {
                    knob = knob_list[i - (input_list.length - knob_list.length)];
                }
    
                if (source === undefined) {
                    // Setting default values to 0 for unused input channels
                    if (knob === undefined) {
                        inputs.push(0);
                    }
                    else {
                        inputs.push(knob.data);
                    }
                }
                else {
                    if (!source.parent.updated) {
                        source.parent.update(timestep);
                        inputs.push(source.data[x][y]);
                    }
                    else if (source.data === undefined) {

                        //the module it's linked to is broken / invalid inputs
                        if (knob === undefined) {
                            inputs.push(0);
                        }
                        else {
                            inputs.push(knob.data);
                        }
                    }
                    else {
                        inputs.push(source.data[x][y]);
                    }
                }
            }
            
            // Weighted sum
            let sum = new THREE.Vector3(0, 0, 0);
            let wsum = 0;

            for (let i = 0; i < 3; i++) {
                let h = inputs[i];
                let s = inputs[3  + i];
                let v = inputs[6 + i];
                let w = inputs[9 + i];

                // convert from hsv to hsl
                // (code from https://stackoverflow.com/a/31851617)
                // both hsv and hsl values are in [0, 1]
                let l = (2 - s) * v / 2;

                if (l != 0) {
                    if (l == 1) {
                        s = 0;
                    } else if (l < 0.5) {
                        s = s * v / (l * 2);
                    } else {
                        s = s * v / (2 - l * 2);
                    }
                }

                // convert to rgb Vector3, named color
                // (code from COS426: image.js)
                var m1, m2;
                m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
                m1 = l * 2 - m2;
                
                var hueToRGB = function(m1, m2, h) {
                    h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
                    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
                    if (h * 2 < 1) return m2;
                    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
                    return m1;
                };

                let r = hueToRGB(m1, m2, h + 1 / 3);
                let g = hueToRGB(m1, m2, h);
                let b = hueToRGB(m1, m2, h - 1 / 3);
                var color = new THREE.Vector3(r * 255, g * 255, b * 255);
    
                sum.add(color.multiplyScalar(w));
                wsum += w;
            }

            // Normalizing
            if (wsum != 0) {
                sum.divideScalar(wsum);
                output_reference[x][y] = sum;
            }
            else {
                // Returning black if all weights are 0
                output_reference[x][y] = new THREE.Vector3(0, 0, 0);
            }
        };

        // Module dimensions
        var MODULE_WIDTH = parent.MODULE_WIDTH;
        var MODULE_HEIGHT = parent.MODULE_HEIGHT;
        // LFOs are shorter than other modules
        if (type === "LFO") {
            MODULE_HEIGHT = parent.LFO_HEIGHT;
        }

        // Load in panel assets
        // const map = new THREE.TextureLoader().load(`src/assets/modules/${this.name}_panel.png`);
        
        let map;

        switch (type) {
            case "LFO":
                map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/LFO.png`);
                map.minFilter = THREE.LinearFilter;
                break;
            case "Ramp":
                map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/Ramp.png`);
                map.minFilter = THREE.LinearFilter;
                break;
            case "Wave":
                map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/Wave.png`);
                map.minFilter = THREE.LinearFilter;
                break;
            case "Vignette":
                map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/Vignette.png`);
                map.minFilter = THREE.LinearFilter;
                //https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/Vignette.png
                //src/assets/modules/Vignette.png
                break;
            case "Output":
                map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/Output.png`);
                map.minFilter = THREE.LinearFilter;
                //
                //https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/modules/Output.png
                break;
        }
        const material = new THREE.SpriteMaterial({ map: map, sizeAttenuation: false });
        const sprite = new THREE.Sprite(material);
        //sprite.width = parent.MODULE_WIDTH;
        //sprite.height = parent.MODULE_HEIGHT * (HEIGHT / parent.MODULE_HEIGHT);
        // sprite.center = new THREE.Vector2(0, 0);
        sprite.scale.set(MODULE_WIDTH, MODULE_HEIGHT /* * HEIGHT / parent.MODULE_HEIGHT*/, 1);
        this.add(sprite); // this.children[0]

        // Setting the module position
        this.position.z = 0;
        this.position.x = x;
        this.position.y = y;

        // Module features (set in switch statement)
        var num_inputs;
        var num_outputs;
        var num_knobs;
        var module_map = parent.ModMap.get_map(type);

        // Creating and adding ports (buttons) and knobs
        switch (type) {
            case "LFO":
                num_inputs = 3; // Frequency, amplitude, center
                num_outputs = 3; // Value at time t for 3 output channels
                num_knobs = 3; // Frequency, amplitude, center
                break;
            case "Ramp":
                num_inputs = 3; // Maximum value for channels 1-3
                num_outputs = 6; // 2 sets of 3 output channels (horizontal and vertical ramps)
                num_knobs = 3; // Maximum value for channels 1-3
                break;
            case "Wave":
                num_inputs = 4; // Maximum value for channels 1-3, frequency
                num_outputs = 6; // 2 sets of 3 output channels (horizontal and vertical waves)
                num_knobs = 4; // Maximum value for channels 1-3, frequency
                break;
            case "Vignette":
                num_inputs = 10; // Center x, center y, inner radius, outer radius, hue, saturation, value for input channels 1 & 2
                num_outputs = 6; // Hue, saturation, and value for channels 1 & 2
                num_knobs = 4; // Center x, center y, inner radius, outer radius
                this.input_btns_per_row = 2;
                break;
            case "Output":
                num_inputs = 12; // Weights of channels 1-3, Hue, saturation, and value for channels 1-3
                num_outputs = 0; // No output: maps directly to display screen
                num_knobs = 3; // Weights of channels 1-3
                break;
        }

        // NEW GUI SPACING ALGORITHM
         for(var i = 0; i < module_map.length; i++) {
            let start_y = MODULE_HEIGHT / 2 - module_map[i][0] * MODULE_HEIGHT / 100;
            let inter_row_spacing = MODULE_HEIGHT / 100;
            switch(module_map[i][1]){
                case "in":
                    inter_row_spacing *= this.between_inputrow_spacing_pct;
                    break;
                case "knob":
                    inter_row_spacing *= this.between_knobrow_spacing_pct;
                    break;
                case "out":
                    inter_row_spacing *= this.between_outputrow_spacing_pct;
                    break;
            }
            start_y -= inter_row_spacing;
            let positions = module_map[i][2];
            for(var x = 0; x < positions.length; x++){
                let inter_col_spacing = MODULE_WIDTH / (positions[x].length+1);
                let start_x = - MODULE_WIDTH / 2 + inter_col_spacing;
                for(var y = 0; y < positions[x].length; y++) {
                    let newItem;
                    if(positions[x][y] ==1){
                    switch(module_map[i][1]){
                        case "in":
                            newItem = new Button(this, "input", start_x + y * inter_col_spacing, start_y - x * inter_row_spacing, 0xccffcc);
                            this.input_list.push(newItem);
                            
                            break;
                        case "knob":
                            newItem = new Knob(this, start_x + y * inter_col_spacing, start_y - x * inter_row_spacing);
                            this.knob_list.push(newItem);
                            break;
                        case "out":
                            newItem = new Button(this, "output", start_x + y * inter_col_spacing, start_y - x * inter_row_spacing, 0xccccff);
                            this.output_list.push(newItem);
                            
                            break;
                    }
                    this.add(newItem);
                    parent.addToUpdateList(newItem);}
                }
            }
            
            
        }  

        // Add self to parent's update and invalidate lists
        parent.addToUpdateList(this);
        parent.addToInvalidateList(this);

        return this;
    }

    update(timestep) {

        // Updating according to module type
        switch (this.name) {
            case "Ramp":  
                this.update_data(this.Ramp_function, this.output_list, timestep);                          
                break;
            case "LFO":
                this.update_data(this.LFO_function, this.output_list, timestep);
                break;
            case "Wave":
                this.update_data(this.Wave_function, this.output_list, timestep);
                break;
            case "Vignette":
                this.update_data(this.Vignette_function, this.output_list, timestep);
                break;
            case "Output":
                this.update_data(this.Output_function, this.parent.Screen.data, timestep);
                break;
        }

        // Flagging module as updated for this frame
        this.updated = true;
    }

    // Called on each module at the end of a frame
    invalidate() {
        this.updated = false;
    }

    createDataArray() {
        let dataArray = [];

        for (let x = 0; x < SCREEN_WIDTH; x++) {
            let innerArray = [];
            for (let y = 0; y < SCREEN_HEIGHT; y++) {
                innerArray.push(0);
            }

            dataArray.push(innerArray);
        }

        return dataArray
    }

    // DO WE EVEN NEED THIS FUNCTION?
    //the value of this function is so that the double for-loop code doesn't need to be repeated in every module function 
    //but not necessarily needed 
    update_data(module_function, output_reference, timestep) {

        for (let x = 0; x < SCREEN_WIDTH; x++) {
            for (let y = 0; y < SCREEN_HEIGHT; y++) {
                module_function(x, y, this.input_list, this.knob_list, output_reference, timestep);
            }
        }
    }
}

export default Module;