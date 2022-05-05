import * as THREE from 'three';
import { Group } from 'three';
import { Image, Pixel } from 'objects';

class Screen extends Group {
    constructor(parent, name, Output) {

        // Call parent Group() constructor
        super();

        // Basic Variables
        this.parent = parent;
        this.name = name;

        // Setting screen position
        this.position.x = 0;
        this.position.y = this.parent.height / 4;
        this.position.z = 0.3;

        this.frame_width_ratio = 0.45;
        this.frame_height_ratio = 0.5;
        this.panel_width_ratio = (1 - this.frame_width_ratio) / 2; // & same height as frame
        this.screen_scalefactor_vt = 0.85;
        this.screen_scalefactor_hz = 0.85;

        let frame_width_scale = this.parent.width * this.frame_width_ratio;
        let frame_height_scale = this.parent.height * this.frame_height_ratio;
        let panel_width_scale = this.parent.width * this.panel_width_ratio;
        this.screen_width_scale = this.screen_scalefactor_vt * frame_width_scale;
        this.screen_height_scale = this.screen_scalefactor_hz * frame_height_scale;
        let panel_position_offset = (frame_width_scale + panel_width_scale) / 2;

        //frame and side panels
        let frame_map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/Screen/screen_backpanel.png`);
        //https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets
        //src/assets/Screen/screen_backpanel.png
        let frame_material = new THREE.SpriteMaterial({ map: frame_map });
        let right_map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/Screen/screen_rightpanel.png`);
        let left_map = new THREE.TextureLoader().load(`https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/Screen/screen_leftpanel.png`);
        //https://raw.githubusercontent.com/DavidBorts/ModularVideoSynthesizer/main/src/assets/Screen/screen_left/rightpanel.png
        //src/assets/Screen/screen_left/rightpanel.png
        let right_material = new THREE.SpriteMaterial({ map: right_map });
        let left_material = new THREE.SpriteMaterial({ map: left_map });
        this.frame = new THREE.Sprite(frame_material);
        this.frame.scale.set(frame_width_scale, frame_height_scale, 1);
        this.add(this.frame);
        this.panel_left = new THREE.Sprite(left_material);
        this.panel_left.scale.set(panel_width_scale, frame_height_scale, 1);
        this.panel_left.position.set(-panel_position_offset, 0, 0);
        this.add(this.panel_left);
        this.panel_right = new THREE.Sprite(right_material);
        this.panel_right.scale.set(panel_width_scale, frame_height_scale, 1);
        this.panel_right.position.set(panel_position_offset, 0, 0);
        this.add(this.panel_right);

        // Functionality
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
        this.img = this.flattenData(this.data);

        //make screen with starting data
        let screen_map = new THREE.DataTexture(this.img, 100, 100);
        let screen_material = new THREE.SpriteMaterial({ map: screen_map });
        this.sprite = new THREE.Sprite(screen_material);
        this.sprite.scale.set(this.screen_width_scale, this.screen_height_scale, 1);
        this.add(this.sprite);

        this.parent.addToUpdateList(this);
    }

    flattenData(d) {
        let a = 4; // for easy change to possible 3-val-only texture
        let flat = new Uint8Array(100 * 100 * a);
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                flat[x * 100 * a + y * a] = this.data[x][y].x;
                flat[x * 100 * a + y * a + 1] = this.data[x][y].y;
                flat[x * 100 * a + y * a + 2] = this.data[x][y].z;
                flat[x * 100 * a + y * a + 3] = 255; // Constant alpha value
            }
        }
        return flat;
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
        this.remove(this.children[3]); //leave screen backpanels intact

        const texture = new THREE.DataTexture(this.img, 100, 100);
        texture.needsUpdate = true;

        let screen_material = new THREE.SpriteMaterial({ map: texture });
        this.sprite = new THREE.Sprite(screen_material);
        this.sprite.scale.set(this.screen_width_scale, this.screen_height_scale, 1);
        this.add(this.sprite);
    }
}
export default Screen;