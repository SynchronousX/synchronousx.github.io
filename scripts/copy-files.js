'use strict';

const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');

const outputDir = 'build';
const globOptions = {
    ignore: [
        'node_modules/**/*',
        'build/**/*'
    ]
};
const filePatterns = [
    'CNAME',
    '**/*.html',
    '**/*.htc',
    '**/assets/**/images/*'
];

function writeFileSync(path, contents) {
    const dir = path.substring(0, path.lastIndexOf('/'));
    mkdirp.sync(dir);
    fs.writeFileSync(path, contents);
}

for (var i = 0; i < filePatterns.length; ++i) {
    const filePattern = filePatterns[i];
    const files = glob.sync(filePattern, globOptions);

    for (var j = 0; j < files.length; ++j) {
        const file = files[j];
        const contents = fs.readFileSync(file);

        writeFileSync([outputDir, file].join('/'), contents);
    }
}
