const version = require('./package.json').version;

module.exports = {
  plugins: [
    require('cssnano')(),
    require('postcss-banner')({
      banner: `\
Bootstrap-Themes.com v${version} (https://bootstrap-themes.com/)
Copyright 2019 Utkarsh Kukreti
Licensed under MIT (https://github.com/utkarshkukreti/bootstrap-themes/blob/master/LICENSE)`,
      important: true,
    }),
  ],
};
