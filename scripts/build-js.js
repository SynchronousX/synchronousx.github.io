'use strict';

const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const UglifyJS = require('uglify-js');

const outputDir = 'build';
const globOptions = {
    ignore: [
        'node_modules/**/*',
        'build/**/*'
    ]
};
const files = glob.sync('**/assets/**/js/*.js', globOptions);

function writeFileSync(path, contents) {
    const dir = path.substring(0, path.lastIndexOf('/'));
    mkdirp.sync(dir);
    fs.writeFileSync(path, contents);
}

for (var i = 0; i < files.length; ++i) {
    const file = files[i];
    const jsIn = fs.readFileSync(file, "utf8");
    const jsOut = UglifyJS.minify(jsIn).code;
    writeFileSync([outputDir, file].join('/'), jsOut);
}
