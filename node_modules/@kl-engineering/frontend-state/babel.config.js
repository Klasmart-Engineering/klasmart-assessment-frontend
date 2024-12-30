module.exports = {
    presets: [
        [
            `@babel/preset-env`,
            {
                modules: false,
                useBuiltIns: `usage`,
                corejs: {
                    version: `3.22.2`,
                    proposals: true,
                },
            },
        ],
        `@babel/preset-typescript`,
        [
            `@babel/preset-react`,
            {
                runtime: `automatic`,
            },
        ],
    ],
    plugins: [],
};
