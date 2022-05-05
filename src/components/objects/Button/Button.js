import * as THREE from 'three';
import { Group } from 'three';

class Button extends Group {
    constructor(parent, type, x, y, color) {
        // parent: parent in the scene graph of this module
        // type: what does this oscillator control? (color, xPos, yPos, ????)
        // x: x position of button (offset)
        // y: y position of button (offset)
        // color: hex color of button

        // Call parent Group() constructor
        super();

        // Variables
        this.name = "Button";
        this.type = type;
        this.parent = parent;
        this.link_color = undefined;
        this.orig_color = color;
        this.data = parent.createDataArray();
        this.linked = undefined; 
        

        // Load in Button assets for input button
        let button_map = new THREE.TextureLoader().load( 'https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/buttons/port2.png' );
        //src/assets/buttons/port2.png
        // button_map.minFilter = THREE.LinearFilter;
        const material = new THREE.SpriteMaterial( { map: button_map, color: color } );
        const sprite = new THREE.Sprite( material );
        sprite.scale.set(parent.parent.BTN_SCALING, parent.parent.BTN_SCALING, 1 ); // change?
        this.position.x = x;// + parent.children[0].position.x;
        this.position.y = y;// + parent.children[0].position.y;
        this.position.z = 0.1;// + + parent.children[0].position.z;
        this.add( sprite ); // this.children[0]
        return this;
    }

    prepareForLink(colors){
        let wire_idx = Math.floor(Math.random() * colors.length);
        let wire_color = colors[wire_idx];
        this.setColor(wire_color);
    }

    setColor(color){
        this.link_color = color;
        this.children[0].material.color.set(color);
    }

    decolor(){
        this.link_color = undefined;
        this.children[0].material.color.set(this.orig_color);
    }

    link(other) {
        if (this.type === other.type) {
            alert("Error"); //shouldn't get here
            return;
        }
        this.linked = other;
        other.linked = this;
        let wire_color; //rationale: the color is picked when the first button is clicked on. Button then lights up in that color.
        //when the link is completed, the wire sprite and other button will also be the same color
        if(this.link_color !== undefined) {
            wire_color = this.link_color;
            other.setColor(wire_color);
        }
        else{
            wire_color = other.link_color;
            this.setColor(wire_color);
        }
        if(this.type==="input"){
            this.attach_wire(wire_color);
        }
        else {
            other.attach_wire(wire_color);
        }
        console.log("linked ",this.name, " and ", other.name);
    }

    unlink() {
        console.log("unlinking ", this.name);
        if(this.type==="input"){
            // wires will be associated with the input-side button in a link
            this.detach_wire();
        }
        else{
            this.linked.detach_wire();
        }
        this.linked.linked=undefined;
        this.linked.decolor();
        this.linked=undefined;
        this.decolor();
    }

    attach_wire(wire_color){
        let wire_map = new THREE.TextureLoader().load( 'https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/Cables/cable6.png' );
        //arc/assets/Cables/cable6.png
        wire_map.minFilter = THREE.LinearFilter;
        const material = new THREE.SpriteMaterial( { map: wire_map, color: wire_color } );
        let wire = new THREE.Sprite( material );

        let start = this.getWorldPosition();
        let end = this.linked.getWorldPosition();

        let dist = start.distanceTo(end);

        wire.scale.set(dist * 1.01, Math.pow(dist, 0.1)*this.parent.parent.BTN_SCALING/2, 1 ); // change?
        console.log(wire.scale);
        
        let vecBetween = new THREE.Vector3().subVectors(end, start).normalize();
        wire.position.addScaledVector(vecBetween, dist/2 * 1.00);



        //put it in front of stuff
        wire.position.z += 0.3;

        //move slightly down or up
        let v2 = new THREE.Vector3().copy(vecBetween);
        v2.applyAxisAngle(new THREE.Vector3(0,0,1), -3.1415/2);
        wire.position.addScaledVector(v2, Math.pow(dist, 0.1)*this.parent.parent.BTN_SCALING/5);
        
        let wire_starting = new THREE.Vector3(1, 0, 0);
        let angle = wire_starting.angleTo(vecBetween);
        if(start.y > end.y) {
            wire.material.rotation = (wire.material.rotation - angle);
        }
        else {
            wire.material.rotation = (wire.material.rotation + angle);
        }
        this.add( wire );
    }

    detach_wire(){
        if(this.children.length > 1){
            this.remove(this.children[1]); //dispose of object?
        }
        else {
            console.log("no wire to remove?");
        }
        
    }
}

export default Button;