// We need some way to get global constants for module width, height, control panel widtn (how many modules wide), etc
// Placeholders:
const modules_wide = 10;
const module_units_tall = 3;

function writePresetFile(filename, module_map, patch_list, knob_settings) {

}

function savePreset(moduleList) {

    var module_map = Array.from(Array(modules_wide), () => new Array(module_units_tall)); // TODO: module_map is already used in ./Module_Map
    horizontal = 0;
    vertical = 0; // starting from top left corner of panel
    for (var module of moduleList) {

        // Adding to module map
        module_height = module.height; //TODO: add height property to module class
        module_map[horizontal][vertical] = module.name;
        for (i = 1; i < module_height; i++) {
            module_map[horizontal][vertical + i] = "full"; // could replace with NULL
        }

        vertical += module_height;
        if (vertical > module_units_tall) {
            horizontal++;
            vertical = 0;
        }
    }

}

function loadPreset(filename) {
    
    

}