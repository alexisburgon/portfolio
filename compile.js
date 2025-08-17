const config = require('./config.js');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars')

// Utility function
function fileExists(file) {
    return fs.promises.access(file, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
};

// define needed helpers
Handlebars.registerHelper('equiv', function(a,b,options) {
    if (a == b) return options.fn(this)
});

Handlebars.registerHelper('nequiv', function(a,b,options) {
    if (a != b) return options.fn(this)
});

// broadly needed variables
const baseTemplateFile = path.join(config.templateDir, config.baseTemplate);

fileExists(config.templateDir).then( exists => {
    if (!exists) throw Error(`The indicated template directory does not exist (${config.templateDir})`);
}).then( () => { // check that the output directory exists, or create it if it doesn't
    return fileExists(config.buildDir)
}).then( (exists) => {
    if (!exists) fs.mkdirSync(config.buildDir)
}).then( () => { // get the base template (after checking that it exists)
    return fileExists(baseTemplateFile)
}).then( (exists) => {
    if (!exists) throw Error(`The indicated base template does not exist (${baseTemplateFile})`);
    return fs.promises.readFile(baseTemplateFile, {encoding:'utf8'})
}).then( (fileContent) => { // compile each of the pages
    const baseTemplate = Handlebars.compile(fileContent)
    config.pages.forEach(page => {
        console.log('Rendering the page:', page)
        // load the pageContent from the indicated file
        fs.promises.readFile(path.join(config.templateDir, page.file), {encoding:'utf8'}).then( (pageContent) => {
            Handlebars.registerPartial('pageContent', pageContent);
            const outputFile = path.join(config.buildDir, (page.outputName ?? page.file));
            // console.log('Saving to:', outputFile);
            let content = (page.noTemplate) ? pageContent : baseTemplate({...page, ...config});
            fs.promises.writeFile(outputFile, content, {encoding: 'utf8'})
        })
    })
})
