module.exports = {
    templateDir: "./templates",
    baseTemplate: 'base.html',
    buildDir: './build',
    overallTitle: 'Alexis Burgon',
    pages: [
        // Templated files
        {pageTitle: 'index', file: 'index.html'},
        {pageTitle: 'Projects', file: 'projects.html'},
        {pageTitle: 'Publications', file:'publications.html'},
        // Static files
        {file: 'style.css', noTemplate:true}
    ],
    projects: [
        {name: 'DRAGen', link:'https://github.com/DIDSR/DRAGen'},
        {name: 'bias.myti.report', link:'https://github.com/DIDSR/bias.myti.report'},
    ],
    contactInformation: [
        {icon: 'google-scholar', link:'https://scholar.google.com/citations?user=sfrd0esAAAAJ&hl=en', text:'Google Scholar'},
        {icon: 'linkedin', link:'', text:'LinkedIn'},
    ],
    publicationFile: './publications.bib',
    additionalPublicationInfo: {
        'kanakaraj2025behype': {
            url: 'https://doi.org/10.1117/12.3047359',
            abstract: 'Artificial intelligence (AI) models need to be carefully evaluated for performance on underrepresented subgroups to avoid exacerbating health disparities, but test data for such subgroups are often limited. Traditional evaluation methods often misinterpret performance differences across such limited subgroups data. We present an novel approach for meaningful subgroup analysis, based on hyperdimensional computing to encode model features during the AI model evaluation phase. The hyperdimensional representation retains the subtle subgroup characteristics and enables identification of diverging characteristics (DCs) responsible for performance differences across subgroups. Thus, we develop a technique to identify and detect these DCs and show that they reflect performance bias.'
        },        
    }
}