class Module_Map {
    constructor() {
        //Format: each item starts with a vertical percentage offset,
        //then a type, then a 2d array of positions.
        //the spaces between consecutive rows depend on hardcoded constants in Module.
        //MUST MATCH THESE MAPS to valid numbers of knobs, inputs, and outputs
        this.ramp_map = [
            [2, "in", [[1, 1, 0], [1, 0, 1]]],
            [30, "knob", [[1],[1],[1]]],
            [70, "out", [[1,1,1]]]
        ];
        this.lfo_map = [
            [2, "in", [[1, 1, 0], [1, 0, 1]]],
            [30, "knob", [[1],[1],[1]]],
            [70, "out", [[1,1,1]]]

        ];
        this.wave_map = [
            [2, "in", [[1, 1, 0], [1, 0, 1]]],
            [30, "knob", [[1],[1],[1]]],
            [70, "out", [[1,1,1]]]

        ];
        this.vignette_map = [
            [2, "in", [[1, 1, 0], [1, 0, 1]]],
            [30, "knob", [[1],[1],[1]]],
            [70, "out", [[1,1,1]]]

        ];
        this.output_map = [
            [2, "in", [[1, 1, 0], [1, 0, 1]]],
            [30, "knob", [[1],[1],[1]]],
        ];
        return this;
    }

    get_map(name){
        switch (name) {
            case "Ramp":  
                return this.ramp_map;                         
            case "LFO":
                return this.lfo_map;
            case "Wave":
                return this.wave_map;
            case "Vignette":
                return this.vignette_map;
            case "Output":
                return this.output_map;
        }
        return "Name not recognized";
    }
}

export default Module_Map;