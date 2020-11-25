const path = require('path');




module.exports = {
    mode: 'development',
    entry: {
        //index: { import: './js/three.js', dependOn: 'shared' },
        ambient: './js/main.js',
        //shared: 'lodash',
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};