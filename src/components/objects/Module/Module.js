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
        // type: type of module (Ramp, Wave, LFO, Color LFO, Vignette, Output)
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


        // Functions
        // (used to update their corresponding module types during each time step)
        this.Ramp_function = function(x, y, input_list, knob_list, output_list, timestep) {
            /* if (this.name != "Ramp") {
                alert("ERROR: Ramp_function() should only be called for the Ramp module");
            } */ // DOES IT STILL RECOGNIZE "this"??
            //console.log("ramp!");
    
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
                        inputs.push(source.data[x][y]);  // DO WE NEED THIS??
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
            
            // Interpolating between black and the input color, depending on x
            let h = inputs[0] * 360; // Multiply to rescale to [0, 360]
            let s = inputs[1];
            let v = inputs[2];

            output_list[0].data[x][y] = h * (x / SCREEN_WIDTH) / 360; // Divide to rescale to [0, 1]     
            output_list[1].data[x][y] = s * (x / SCREEN_WIDTH);   
            output_list[2].data[x][y] = v * (x / SCREEN_WIDTH);          
        };

        this.Wave_function  = function(x, y, input_list, knob_list, output_list, timestep) {
            /* if (this.name != "Wave") {
                alert("ERROR: Wave_function() should only be called for the Wave module");
            } */ // DOES IT STILL RECOGNIZE "this"??
    
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
                        inputs.push(source.data[x][y]);  // DO WE NEED THIS??
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
            
            // Interpolating between black and the input color, depending on x
            const frequency = inputs[0];
            const h = inputs[1] * 360; // Multiply to rescale to [0, 360]
            const s = inputs[2];
            const v = inputs[3];

            output_list[0].data[x][y] = ((h / 2) * Math.sin(frequency * x) + (h / 2)) / 360; // Divide to rescale to [0, 1]   
            output_list[1].data[x][y] = (s / 2) * Math.sin(frequency * x) + (s / 2);     
            output_list[2].data[x][y] = (v / 2) * Math.sin(frequency * x) + (v / 2);  
            
            let h_out = ((h / 2) * Math.sin(frequency * x) + (h / 2)) / h;
            let s_out = (s / 2) * Math.sin(frequency * x) + (s / 2);
            let v_out = (v / 2) * Math.sin(frequency * x) + (v / 2);
            
            if (h_out < 0 || h_out > 1) {
                console.log("wave h")
            }
            if (s_out < 0 || s_out > 1) {
                console.log("wave s")
            }
            if (v_out < 0 || v_out > 1) {
                console.log("wave v")
            }
        };
        this.LFO_function = function(x, y, input_list, knob_list, output_list, timestep) {
            /* if (this.name != "LFO") {
                alert("ERROR: LFO_function() should only be called for the LFO module");
            } */ // DOES IT STILL RECOGNIZE "this"??
            //console.log("LFO!");
    
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
                        inputs.push(source.data[x][y]);  // DO WE NEED THIS??
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

            output_list[0].data[x][y] = amplitude * Math.sin(frequency * timestep) + 0.5;
            //out_check = 
        };
        // FIX THIS - MORE INPUTS!!!!!!!!! DIFFERENT size!!!!!!!!!
        this.LFO_Color_function = function(x, y, input_list, knob_list, output_list, timestep) {
            /* if (this.name != "LFO_Color") {
                alert("ERROR: LFO_Color_function() should only be called for the Color LFO module");
            } */ // DOES IT STILL RECOGNIZE "this"??
    
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
                        inputs.push(source.data[x][y]);  // DO WE NEED THIS??
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
            const h1 = inputs[1] * 360; // Multiply to rescale to [0, 360]
            const s1 = inputs[2];
            const v1 = inputs[3];
            const h2 = inputs[1]; // Multiply to rescale to [0, 360]
            const s2 = inputs[2];
            const v2 = inputs[3];

            // Determining amplitude and center of oscillation
            let h_amplitude = Math.abs(h2 - h1) / 2;
            let s_amplitude = Math.abs(s2 - s1) / 2;
            let v_amplitude = Math.abs(v2 - v1) / 2;
            
            let h_center = (h1 + h2) / 2;
            let s_center = (s1 + s2) / 2;
            let v_center = (v1 + v2) / 2;

            output_list[0].data[x][y] = (h_amplitude * Math.sin(frequency * timestep) + h_center) / 360;  // Divide to rescale to [0, 1]
            output_list[1].data[x][y] = s_amplitude * Math.sin(frequency * timestep) + s_center;
            output_list[2].data[x][y] = v_amplitude * Math.sin(frequency * timestep) + v_center;
        };

        this.Vignette_function = function(x, y, input_list, knob_list, output_list, timestep) {
            /* if (this.name != "Vignette") {
                alert("ERROR: Vignette_function() should only be called for the Vignette module");
            } */ // DOES IT STILL RECOGNIZE "this"??
    
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
            let diffX = Math.pow((center_x - 1 - x), 2);
            let diffY = Math.pow((center_y - 1 - y), 2);
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
            // If the point is in outside the circles, set value for channel 1 to 0
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
            /* if (this.name != "Output") {
                alert("ERROR: Output_function() should only be called for the Output module");
            } */ // DOES IT STILL RECOGNIZE "this"??
            //console.log("output!");
    
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
            
            // Weighted sum
            let sum = new THREE.Vector3(0, 0, 0);
            let wsum = 0;

            for (let i = 0; i < 3; i++) {
                let h = inputs[3 +  (3 * i)] /* * 360*/; // Multiply to rescale to [0, 360]
                let s = inputs[3 +  (3 * i) + 1];
                let v = inputs[3 +  (3 * i) + 2];
                let w = inputs[i];

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
    
                /* // convert to rgb Vector3, named color
                // (code from https://gist.github.com/mjackson/5311256)
                var r, g, b;
    
                var j = Math.floor(h * 6);
                var f = h * 6 - j;
                var p = v * (1 - s);
                var q = v * (1 - f * s);
                var t = v * (1 - (1 - f) * s);
    
                switch (i % 6) {
                    case 0: r = v, g = t, b = p; break;
                    case 1: r = q, g = v, b = p; break;
                    case 2: r = p, g = v, b = t; break;
                    case 3: r = p, g = q, b = v; break;
                    case 4: r = t, g = p, b = v; break;
                    case 5: r = v, g = p, b = q; break;
                } */
    
                /*if (r != 0) {
                    console.log(r * 255 * 4);
                } */
                var color = new THREE.Vector3(r * 255, g * 255, b * 255);
    
                sum.add(color.multiplyScalar(w));
                //console.log(w);
                wsum += w;
            }

            // Normalizing
            //console.log(wsum);
            if (wsum != 0) {
                sum.divideScalar(wsum);
                output_reference[x][y] = sum;
            }
            else {
                // IS THIS BLACK???
                output_reference[x][y] = new THREE.Vector3(200, 200, 200); // returning black if all weights are 0
            }
        };

        // Module dimensions
        var MODULE_WIDTH = parent.MODULE_WIDTH; // CAN WE MAKE MODULE_WIDTH & etc. GLOBAL VARIABLES IN app.js???
        var MODULE_HEIGHT = parent.MODULE_HEIGHT;
        // LFOs are shorter than other modules
        if (type === "LFO" || type === "LFO_Color") {
            MODULE_HEIGHT = parent.LFO_HEIGHT;
        }

        // Load in panel assets
        // const map = new THREE.TextureLoader().load(`src/assets/modules/${this.name}_panel.png`);
        const map = new THREE.TextureLoader().load(`src/assets/modules/default_panel.png`);
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

        // Creating and adding ports (buttons) and knobs
        switch (type) {
            case "Ramp":
                num_inputs = 3; // Hue, Saturation, Value
                num_outputs = 3; // Hue, Saturation, Value - color at pixel (x, y)
                num_knobs = 3; // Hue, Saturation, Value
                break;
            case "LFO":
                num_inputs = 2; // Frequency, amplitude
                num_outputs = 1; // Value at time t
                num_knobs = 2; // Frequency, amplitude
                break;
            case "LFO_Color":
                num_inputs = 7; // Frequency, hue, saturation, and value for both colors
                num_outputs = 3; // Hue, saturation, value - color at time t
                num_knobs = 7; // Frequency
                break;
            case "Output":
                num_inputs = 12; // weights of channels 1-3, Hue, saturation, and value for channels 1-3
                num_outputs = 0; // No output: maps direcctly to display screen
                num_knobs = 3; // Weights of channels 1-3
                break;
            case "Wave":
                num_inputs = 4; // Frequency, hue, saturation, value
                num_outputs = 3; // Hue, saturation, value - color at pixel (x, y)
                num_knobs = 4; // Frequency, hue, saturation, value
                break;
            case "Vignette":
                num_inputs = 10; // Center x, center y, inner radius, outer radius, hue, saturation, value for input channels 1 & 2
                num_outputs = 6; // Hue, saturation, and value for channels 1 & 2
                num_knobs = 4; // Center x, center y, inner radius, outer radius
                this.input_btns_per_row = 2;
                break;
        }

        // Creating input ports
        let num_rows_needed = num_inputs / this.input_btns_per_row;
        let center_this_block = 1 * MODULE_HEIGHT / 4;
        let inter_row_spacing = ((MODULE_HEIGHT / 3) - 2 * this.min_padding_vert) / (num_rows_needed+1);
        let start_y = center_this_block + num_rows_needed / 2 * inter_row_spacing;
        let inter_col_spacing = (MODULE_WIDTH - 2 * this.min_padding_horiz) / (this.input_btns_per_row+1);
        let start_x = this.min_padding_horiz + inter_col_spacing - MODULE_WIDTH / 2;
        for(var i = 0; i < num_rows_needed; i++){
            for(var j = 0; j < this.input_btns_per_row; j++){
                if(i * this.input_btns_per_row + j == num_inputs) {break;}
                var btn = new Button(this, "input", start_x + j * inter_col_spacing, start_y - i * inter_row_spacing, 0xccffcc);
                this.input_list.push(btn);//5 + (i + 1) * (WIDTH - 10) / (num_inputs + 1), 50, 0xffffff));
                this.add(btn);
                parent.addToUpdateList(btn);``
            }
        }

        // Creating output ports
        num_rows_needed = num_outputs / this.output_btns_per_row;
        inter_row_spacing = ((MODULE_HEIGHT / 4)) / (num_rows_needed+1);
        start_y = - 3 * MODULE_HEIGHT / 8 + (num_rows_needed / 2) * inter_row_spacing;
        inter_col_spacing = (MODULE_WIDTH - 2 * this.min_padding_horiz) / (this.output_btns_per_row+1);
        start_x = this.min_padding_horiz + inter_col_spacing - MODULE_WIDTH / 2;
        for(var i = 0; i < num_rows_needed; i++){
            for(var j = 0; j < this.output_btns_per_row; j++){
                console.log("created at ",start_x + j * inter_col_spacing, start_y - i * inter_row_spacing);
                if(i * this.output_btns_per_row + j == num_outputs) {break;}
                var btn = new Button(this, "output", start_x + j * inter_col_spacing, start_y - i * inter_row_spacing, 0xccccff);
                this.output_list.push(btn);
                this.add(btn);
                parent.addToUpdateList(btn);
            }
        }

        // Creating knobs
        inter_row_spacing = (MODULE_HEIGHT / 3 - 2 * this.min_padding_vert) / (num_knobs + 1);
        start_y = (num_knobs / 2 - 1) * inter_row_spacing;
        for (var i = 0; i < num_knobs; i++) {
            var knob = new Knob(this, 0, start_y - i * inter_row_spacing);
            this.knob_list.push(knob);
            this.add(knob);
            parent.addToUpdateList(knob);
            console.log("created knob: ", knob);
        }

        // Add self to parent's update and invalidate lists
        parent.addToUpdateList(this);
        parent.addToInvalidateList(this);

        //console.log("module created: ", this);

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
            case "LFO_Color":
                this.update_data(this.LFO_Color_function, this.output_list, timestep);
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
        this.updated = true;
    }

    //need to call at the beginning of a frame on each module
    invalidate() {
        //console.log(this.name, " invalidated");
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