const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'templates'),
          to: path.join(__dirname, 'dist', 'templates'),
        },
      ],
    }),
  ],
};
