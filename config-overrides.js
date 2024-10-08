/* config-overrides.js */
const webpack = require('webpack');

module.exports = function override(config, env) {
    // Existing fallbacks
    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        // Add vm fallback to address the specific error you're seeing
        vm: require.resolve('vm-browserify'),
    };

    // Existing plugins
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    // Modify module rules
    config.module = {
        ...config.module,
        rules: [
            ...config.module.rules,
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            },
            // Add source-map-loader to handle source map warnings
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
                exclude: /node_modules/,
            }
        ]
    };

    // Ignore source map warnings from node_modules
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
}