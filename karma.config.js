module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    retryLimit: 0,
    files: ['tests-bundle/utils/main.js', 'tests-bundle/LocalDatabaseTransport/main.js', 'tests-bundle/Foundation/main.js'],
    reporters: ['progress', 'html'],
    htmlReporter: {
      outputDir: 'docs/reports/unit-testing/', // where to put the reports 
      templatePath: null, // set if you moved jasmine_template.html
      focusOnFailures: true, // reports show failures on start
      namedFiles: true, // name files instead of creating sub-directories
      pageTitle: null, // page title for reports; browser info by default
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
      reportName: 'index', // report summary filename; browser info by default
      // experimental
      preserveDescribeNesting: true, // folded suites stay folded 
      foldAll: true // reports start folded (only with preserveDescribeNesting)
    },
    port: 9876, // karma web server port
    colors: true,
    // logLevel: config.LOG_DEBUG,
    browsers: [
      'ChromeHeadless',
      'Firefox',
      'FirefoxDeveloper',
      'FirefoxNightly',
      'IE'
    ],
    autoWatch: false,
    concurrency: Infinity,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    }
  })
}
