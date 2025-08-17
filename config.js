module.exports = {
    templateDir: "./templates",
    baseTemplate: 'base.html',
    buildDir: './build',
    overallTitle: 'Alexis Burgon',
    pages: [
        // Templated files
        {pageTitle: 'index', file: 'index.html'},
        {pageTitle: 'projects', file: 'projects.html'},
        // Static files
        {file: 'style.css', noTemplate:true}
    ],
    projects: [
        {name: 'TEST'}
    ]
}