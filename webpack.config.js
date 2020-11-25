const path = require('path');




module.exports = {
    mode: 'development',
    entry: {
        //index: { import: './js/three.js', dependOn: 'shared' },
        ambient: './js/main.js',
        //model: './js/titanic2.js',
        //shared: 'lodash',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};