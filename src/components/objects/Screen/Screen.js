import * as THREE from 'three';
import { Group } from 'three';
import {Image, Pixel} from 'objects';

class Screen extends Group {
    constructor(parent, name, Output, xPos, yPos) { // Are we gonna use xPos and yPos??

        // Call parent Group() constructor
        super();

        //SCREEN FRAME: 0.45 Screen-widths Wide; 0.5 Screen-Heights Tall
        //SIDE PANEL: 0.275 Screen-widths Wide; 0.5 Screen-Heights Tall
        //So, if you can make the side panel sprite about 61% the width of the screen w/o changing screw ratio that would be awesome


        // Variables
        this.parent = parent;
        this.name = name;
        this.hz_scale = 0.4;
        this.vt_scale = 0.4;
        this.Output = Output; // Linking output module
        this.matrixWorldNeedsUpdate;
        this.data = []; 
        // Initializing screen as yellow
        for (var x = 0; x < 100; x++) {
            let newRow = [];
            for (var y = 0; y < 100; y++) {
                newRow.push([255, 255, 0]);
            }
            this.data.push(newRow);
        }
        
        this.img = this.flattenData(this.data); // this isn't right

        // Setting screen position
        this.position.x = 0;
        this.position.y = this.parent.height / 4;
        this.position.z = 0.3;

                //frame
       let frame_map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/Screen/screen_backpanel.png`);
       //https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets
       //src/assets/Screen/screen_backpanel.png
       let frame_material = new THREE.SpriteMaterial({map: frame_map});
       //console.log(screen_material);
       this.frame = new THREE.Sprite(frame_material);
       this.frame.scale.set(this.parent.width * 0.45, this.parent.height * 0.5, 1);
       //this.frame.position.set(0, 0, 0);
       this.add(this.frame); 
       this.panel_left = new THREE.Sprite(frame_material);
       this.panel_left.scale.set(this.parent.width * 0.55/2, this.parent.height * 0.5, 1);
       this.panel_left.position.set(-(0.55/4+0.45/2)*this.parent.width, 0, 0);
       this.add(this.panel_left); 
       this.panel_right = new THREE.Sprite(frame_material);
       this.panel_right.scale.set(this.parent.width * 0.55/2, this.parent.height * 0.5, 1);
       this.panel_right.position.set((0.55/4+0.45/2)*this.parent.width,0, 0);
       this.add(this.panel_right); 

        //make a sprite with VideoTexture or DataTexture ?
        let screen_map = new THREE.DataTexture(this.img, 100, 100);
        //const screen_map = new THREE.TextureLoader().load(`src/assets/modules/default_panel.png`);
        //const screen_material = new THREE.SpriteMaterial({ map: map, sizeAttenuation: false });
        //console.log(screen_map);
        let screen_material = new THREE.SpriteMaterial({map: screen_map});
        //console.log(screen_material);
        this.sprite = new THREE.Sprite(screen_material);
        this.sprite.scale.set(this.hz_scale * this.parent.width, this.vt_scale *this.parent.height, 1);
        this.add(this.sprite);





        //this.display = new Image(); DO WE STILL NEED THIS?
        this.parent.addToUpdateList(this);

    }

    flattenData(d){
        let a = 4;
        let flat = new Uint8Array(100*100*a);
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                //rgb right?
                //what data type am i expecting? just changed it to expect vector3's
                flat[x * 100 * a + y * a] = this.data[x][y].x;
                flat[x * 100 * a + y * a + 1] = this.data[x][y].y;
                flat[x * 100 * a + y * a + 2] = this.data[x][y].z;
                flat[x * 100 * a + y * a + 3] = 255; // WHAT IS THIS??
                /*flat[x * 100 * a + y * a] = Math.floor(Math.max(0, Math.min(255,this.data[x][y].x * 255)));
                flat[x * 100 * a + y * a + 1] = Math.floor(Math.max(0, Math.min(255,this.data[x][y].y * 255)));
                flat[x * 100 * a + y * a + 2] = Math.floor(Math.max(0, Math.min(255,this.data[x][y].z * 255)));
                flat[x * 100 * a + y * a + 3] = 255; */
            }
        }
        return flat;
    }

    // DO WE STILL NEED THIS FUNCTION?
    setPixel(x, y, color) {
        this.display.setPixel(x, y, color);
    }

    update(timestep) {

        // Getting the updated data from the output module
        this.Output.update(timestep);
        //console.log(this.data.length, " ", this.data[0].length, " ", this.data[50][50]);

        // Updating each pixel in the screen
        this.img = this.flattenData(this.data);
        //console.log("updated to ", this.img);
        // console.log(this.data[50][50] , " corresponds to  " , this.img[50 * 400 + 50 * 4], this.img[50 * 400 + 50 * 4 + 1], this.img[50 * 400 + 50 * 4 + 2]);

        // Update the screen with the new image at the current timestep
        this.remove(this.children[3]);
        const texture = new THREE.DataTexture(this.img, 100, 100);
        //console.log(this.img);
        texture.needsUpdate = true;
        let screen_material = new THREE.SpriteMaterial({map: texture});
        //console.log(screen_material);
        this.sprite = new THREE.Sprite(screen_material);
        this.sprite.scale.set(this.hz_scale * this.parent.width, this.vt_scale *this.parent.height, 1);
        this.add(this.sprite);
        //console.log("sprite is now ", this.sprite);
    }
}
export default Screen;