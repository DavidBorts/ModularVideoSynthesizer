import * as THREE from 'three';
import { Group } from 'three';

class Knob extends Group {
    //var rotation = 0;
    constructor(parent, x, y) {
        // parent: parent in the scene graph of this module
        // type: what does this oscillator control? (color, xPos, yPos, ????)
        // x: x position of button (offset)
        // y: y position of button (offset)
        // color: hex color of button

        // Call parent Group() constructor
        super();

        // Variables
        this.name = "Knob";
        this.data = 0.5; //ranging between 0 and 1
        var click_y = 0;
        var click_data = 0.5;

        // Load in Button assets for input button
        let knob_map = new THREE.TextureLoader().load('https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/knobs/knob2.png');
        // knob_map.minFilter = THREE.LinearFilter;
        const material = new THREE.SpriteMaterial({ map: knob_map, color: 0xdddddd });
        // material.emissive = 0xaaaaaa; DO WE NEED THIS?]
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(parent.parent.KNOB_SCALING, parent.parent.KNOB_SCALING, 1); // change?
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = 0.1;

        this.add(sprite); // this.children[0]

        sprite.material.rotation = 0;
        this.my_rotation = 0;

        return this;
    }

    knobMove(knob, eventY) {
        // limits
        let y = eventY - this.click_y;
        let d = this.y_to_data(y);
        let d_c = this.clamp_data(d + this.click_data);
        this.data = d_c;
        let r = this.clamped_data_to_rotation(d_c);
        this.set_rotation(knob, r);
        //console.log("y",y,"d",d,"d_c",d_c,"r",r);
    }


    knobClicked(knob, eventY) {
        //console.log("MOUSEDOWN ON KNOB with y", eventY);
        knob.click_y = eventY;
        knob.click_data = knob.data;
        knob.children[0].material.color.set(0xffffff);
        console.log("knob selected; before, it had data", knob.data);
    }

    knobDeselected(knob) {
        knob.click_y = 0;
        knob.children[0].material.color.set(0xdddddd);
        console.log("knob released with data", knob.data);
    }

    set_rotation(knob, r) {
        knob.children[0].material.rotation = r;
        knob.my_rotation = r;
    }

    clamp_data(d){
        return Math.min(1, Math.max(0, d));
    }

    y_to_data(y){
        return -(y / 200);

    }

    clamped_data_to_rotation(d_c){
        return -4 * (d_c - 0.5);

    }
}
export default Knob;