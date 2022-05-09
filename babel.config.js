/* eslint-disable */

const config = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "usage",
                corejs: {version: 3, proposals: true},
                modules: false
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-export-default-from",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-private-methods",
        [
            "import",
            {
                libraryName: "lodash",
                libraryDirectory: "",
                camel2DashComponentName: false
            },
            "lodash"
        ],
        [
            "import",
            {
                libraryName: "antd",
                libraryDirectory: "es",
                style: false
            },
            "antd"
        ],
        [
            "formatjs",
            {
                idInterpolationPattern: "[sha512:contenthash:20]"
            }
        ],
        [
            "babel-plugin-import",
            {
                libraryName: "@mui/material",
                libraryDirectory: "",
                camel2DashComponentName: false
            },
            "core"
        ],
        [
            "babel-plugin-import",
            {
                libraryName: "@mui/icons-material",
                libraryDirectory: "",
                camel2DashComponentName: false
            },
            "icons"
        ],
        [
            "babel-plugin-import",
            {
                libraryName: "@mui/lab",
                libraryDirectory: "",
                camel2DashComponentName: false
            },
            "lab"
        ],
        [
            "babel-plugin-import",
            {
                libraryName: "@mui/styles",
                libraryDirectory: "",
                camel2DashComponentName: false
            },
            "styles"
        ]
    ]
};

module.exports = config;
