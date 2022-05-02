import * as THREE from 'three';
import { Group } from 'three';
import {Image, Pixel} from 'objects';

class Screen extends Group {
    constructor(parent, name, Output, xPos, yPos) { // Are we gonna use xPos and yPos??

        // Call parent Group() constructor
        super();

        // Variables
        this.parent = parent;
        this.name = name;
        this.Output = Output; // Linking output module
        this.matrixWorldNeedsUpdate;
        this.data = []; 
        // Initializing screen as black
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
        this.position.y = 190;
        this.position.z = 0.5;

        //make a sprite with VideoTexture or DataTexture ?
        let screen_map = new THREE.DataTexture(this.img, 100, 100);
        //const screen_map = new THREE.TextureLoader().load(`src/assets/modules/default_panel.png`);
        //const screen_material = new THREE.SpriteMaterial({ map: map, sizeAttenuation: false });
        //console.log(screen_map);
        let screen_material = new THREE.SpriteMaterial({map: screen_map});
        //console.log(screen_material);
        this.sprite = new THREE.Sprite(screen_material);
        this.sprite.scale.set(500, 350, 1);
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
        //let temp_child = this.children[1];
        this.remove(this.children[1]);
        const texture = new THREE.DataTexture(this.img, 100, 100);
        //console.log(this.img);
        texture.needsUpdate = true;
        let screen_material = new THREE.SpriteMaterial({map: texture});
        //console.log(screen_material);
        this.sprite = new THREE.Sprite(screen_material);
        this.sprite.scale.set(500, 350, 1);
        this.add(this.sprite);
        //console.log("sprite is now ", this.sprite);
    }
}
export default Screen;