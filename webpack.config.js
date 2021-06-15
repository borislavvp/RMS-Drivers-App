const path = require('path');
module.exports = {
    entry: {
        "app": "./src/App.tsx"
    },
    output: {
        path: path.resolve(__dirname, "output/drivers"),
        filename: 'app.bundle.js',
        chunkFilename: '[name].app.bundle.js',
        publicPath: "/drivers/"
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: "awesome-typescript-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)?$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader?modules&localIdentName=[local]--[hash:base64:5]"
                }, {
                    loader: "less-loader"
                }]
            },
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".less"]
    }
}