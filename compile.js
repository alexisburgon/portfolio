const config = require('./config.js');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars')
const bibtex = require('bibtex');

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

function getAuthors(data) {
    data = data.map(d => d.trim()).filter(d => d.length > 0).map(d => (d == ',') ? ',' : " "+d).join("").split('and').map( a => a.trim());
    return data.map(d => {
        let names = d.split(",").map(a => a.trim()).reverse()
        return Object.assign(names, {
            first: names[0],
            last: names[1],
        })
    })
}


function ProcessBibEntries(text) {
    let entries = Object.values(bibtex.parseBibFile(text).entries$)
    // console.log('RAW:', entries)
    return entries.map( e => ({
        id: e._id,
        author: getAuthors(e.fields.author.data),
        title: e.fields.title.data.map(d => d.trim()).filter(d => d.length > 0).join(" "),
        year: e.fields.year.data[0],
        publisher: (e.fields.journal ?? e.fields.booktitle ?? e.fields.organization).data.map(d => String(d).trim()).filter(d => d.length > 0).join(" ").replace(" :", ":").replace(" ,", ","),
    }))
}

fileExists(config.templateDir).then( exists => {
    if (!exists) throw Error(`The indicated template directory does not exist (${config.templateDir})`);
}).then( () => { // check that the output directory exists, or create it if it doesn't
    return fileExists(config.buildDir)
}).then( (exists) => {
    if (!exists) fs.mkdirSync(config.buildDir)
}).then( () => { // load the bibliography
    return fs.promises.readFile(config.publicationFile, {encoding:'utf8'})
}).then((citations) => {
    config.publications = ProcessBibEntries(citations)
    config.publications.forEach( pub => {
        let add = config.additionalPublicationInfo[pub.id];
        if (add !== undefined) {
           pub.url = add.url;
           pub.abstract = add.abstract; 
        }
    })
    // console.log('Publications:', config.publications)
}).then( () => { // get the base template (after checking that it exists)
    return fileExists(baseTemplateFile)
}).then( (exists) => {
    if (!exists) throw Error(`The indicated base template does not exist (${baseTemplateFile})`);
    return fs.promises.readFile(baseTemplateFile, {encoding:'utf8'})
}).then( (fileContent) => { // compile each of the pages
    const baseTemplate = Handlebars.compile(fileContent)
    config.pages.forEach(page => {
        // console.log('Rendering the page:', page)
        // load the pageContent from the indicated file
        fs.promises.readFile(path.join(config.templateDir, page.file), {encoding:'utf8'}).then( (pageContent) => {
            Handlebars.registerPartial('pageContent', pageContent);
            const outputFile = path.join(config.buildDir, (page.outputName ?? page.file));
            // console.log('Saving to:', outputFile);
            let content = (page.noTemplate) ? pageContent : baseTemplate({...page, ...config});
            fs.promises.writeFile(outputFile, content, {encoding: 'utf8'})
        })
    })
    console.log("Compilation complete")
})
