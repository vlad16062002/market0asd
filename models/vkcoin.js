const VKCOINAPI = require('node-vkcoinapi');
const config = require('../config');

const vkcoin = new VKCOINAPI({
 key: ".g!ypNPsTID[cfH_f7#vrhWjWabgPBYb8AZI_h]XDqz9IhuND0",
 userId: 597702810,
 token: "cb53307731392dcdc784cc79559eff37542b4df4b08562622b2c0f6493a527398b2620a20c0fe84e8d732"});

module.exports = vkcoin;