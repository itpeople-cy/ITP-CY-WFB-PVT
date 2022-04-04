'use strict';

let path = require('path');
let fs = require('fs');
let handlebars = require('handlebars');

module.exports = function RenderHBS(dir) {
    let templateCache = {};
    let render = function render(filePath, ctx) {
        if (templateCache[filePath]) {
            return templateCache[filePath](ctx);
        }

        let html = fs.readFileSync(path.join(dir, filePath), 'utf-8');
        templateCache[filePath] = handlebars.compile(html);

        return templateCache[filePath](ctx);
    };

    return { render: render, handlebars: handlebars };
};