/* config-overrides.js */
const { override, addBabelPlugins } = require('customize-cra');
const {alias, configPaths} = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json') // or jsconfig.paths.json
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const path = require('path');
const pkg = require("./package.json");
const webpack = require("webpack");

function myOverrides(config) {
  config.output = {
    ...config.output,
    path: path.resolve(process.env.BUILD_PATH || 'build'),
    publicPath: process.env.REACT_APP_REMOTE_DOMAIN,
  }
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    }),
    new ModuleFederationPlugin({
      "name": "assessment",
      filename: `remoteEntry.js`,
      exposes: {
        "./Assessment": "./src/main.tsx",
      },
      shared: {
        "@apollo/client": "^3.2.5",
        "@apollo/react-hooks": "^4.0.0",
        "@date-io/moment": "^1.3.13",
        "@dnd-kit/accessibility": "^3.0.0",
        "@dnd-kit/core": "^3.0.3",
        "@dnd-kit/modifiers": "^2.0.0",
        "@dnd-kit/utilities": "^2.0.0",
        "@kl-engineering/kidsloop-media-hooks": "^0.2.5",
        "@newrelic/publish-sourcemap": "^5.1.0",
        "@reduxjs/toolkit": "^1.7.0-rc.0",
        "@rpldy/shared": "^0.4.1",
        "@rpldy/shared-ui": "^0.4.1",
        "@rpldy/uploader": "^0.4.1",
        "@rpldy/uploady": "^0.4.1",
        "@testing-library/jest-dom": "^5.14.1",
        "@testing-library/react": "^12.1.2",
        "@testing-library/user-event": "^7.1.2",
        "@types/iframe-resizer": "^3.5.8",
        "@types/jest": "^27.0.2",
        "@types/js-cookie": "^2.2.6",
        "@types/lodash": "^4.14.159",
        "@types/moment": "^2.13.0",
        "@types/node": "^12.0.0",
        "@types/react": "^17.0.39",
        "@types/react-dom": "^17.0.3",
        "@types/react-draft-wysiwyg": "^1.13.0",
        "@types/react-redux": "^7.1.9",
        "@types/react-router-dom": "^5.1.5",
        "@types/redux": "^3.6.0",
        "axios": "^0.24.0",
        "clsx": "^1.1.1",
        "crypto-browserify": "^3.12.0",
        "dotenv": "^10.0.0",
        "graphql": "^15.4.0",
        "iframe-resizer": "^4.2.11",
        "immer": "^9.0.6",
        "js-cookie": "^2.2.1",
        "jssha": "^3.2.0",
        "lodash": "^4.17.20",
        "mitt": "^2.1.0",
        "notistack": "^1.0.0",
        "react-archer": "^2.0.2",
        "react-cropper": "^2.1.4",
        "react-dnd": "^11.1.3",
        "react-dnd-html5-backend": "^11.1.3",
        "react-draft-wysiwyg": "^1.14.5",
        "react-hook-form": "6.11.5",
        "react-intl": "^5.8.1",
        "react-pdf": "^5.3.0",
        "react-redux": "^7.2.1",
        "react-rnd": "^10.2.4",
        "react-router-dom": "^5.2.0",
        "react-scripts": "^5.0.0",
        "react-sketch-master": "^0.8.0",
        "react-spring": "^9.2.4",
        "react-visibility-sensor": "^5.1.1",
        "redux": "^4.0.5",
        "source-map-explorer": "^2.5.2",
        "stream-browserify": "^3.0.0",
        "swiper": "^8.1.3",
        "typescript": "^4.4.4",
        '@kl-engineering/frontend-state': {
          singleton: true,
          requiredVersion: pkg.dependencies['@kl-engineering/frontend-state'],
        },
        'fetch-intercept': {
          singleton: true,
          requiredVersion: pkg.dependencies['fetch-intercept'],
        },
        react: {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react'],
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react-dom'],
        }
      },
    }),
  ]);
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify")
  }
  const scopePluginIndex = config.resolve.plugins.findIndex(
    ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
  );
  config.resolve.plugins.splice(scopePluginIndex, 1);
  return  alias(aliasMap)(config)
}


module.exports = override(
  myOverrides,
  process.env.NODE_ENV !== 'development' && addBabelPlugins(
    "transform-remove-console"
  )
);