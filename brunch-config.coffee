module.exports = config:
  sourceMaps: false
  files:
    javascripts: joinTo:
      'libs.js': /^vendor\//
      'game.js': /^app\//
    stylesheets: joinTo: 'game.css'
  plugins:
    afterBrunch: [
      '7za -x!*.map a public.zip ./public/*'
    ]

overrides:
  production:
    optimize: true
    sourceMaps: false
    htmlPages:
      htmlMin :
        removeComments: true
        removeCommentsFromCDATA: true
        removeCDATASectionsFromCDATA: true
        collapseBooleanAttributes: true
        useShortDoctype: true
        removeEmptyAttributes: true
        removeScriptTypeAttributes: true
        removeStyleLinkTypeAttributes: true
        collapseWhitespace: true
        minifyJS: true
        minifyCSS: true
      destination : (path) ->
        path.replace /^app[\/\\](.*)\.html$/, "$1.html"
      disabled: false