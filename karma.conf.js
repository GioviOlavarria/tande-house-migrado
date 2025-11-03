module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      // React UMD (global React/ReactDOM)
      { pattern: 'node_modules/react/umd/react.development.js', watched: false, type: 'js' },
      { pattern: 'node_modules/react-dom/umd/react-dom.development.js', watched: false, type: 'js' },

      // App source (orden similar a index.html, pero sin boot)
      { pattern: 'public/fuente/data/seed.js', type: 'js' },
      { pattern: 'public/fuente/data/tienda.js', type: 'js' },
      { pattern: 'public/fuente/libreria/router.js', type: 'js' },
      { pattern: 'public/fuente/componentes/*.jsx', type: 'js' },
      { pattern: 'public/fuente/paginas/*.jsx', type: 'js' },
      { pattern: 'public/fuente/app.jsx', type: 'js' },
      // IMPORTANTE: Excluimos main.jsx para evitar boot automático durante tests

      // Tests y helpers
      { pattern: 'tests/helpers.js', type: 'js' },
      { pattern: 'tests/**/*.spec.js', type: 'js' },
      { pattern: 'tests/**/*.spec.jsx', type: 'js' }
    ],
    preprocessors: {
      'public/fuente/**/*.jsx': ['babel'],
      'tests/**/*.js': ['babel'],
      'tests/**/*.jsx': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: [['@babel/preset-react', { runtime: 'classic' }]]
      }
    },
    // Silenciar warnings de extensión .jsx en Karma 6
    mime: { 'text/javascript': ['js', 'jsx'] },

    browsers: ['Chrome'], // o 'ChromeHeadless'
    singleRun: true
  });
};