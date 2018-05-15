module.exports = {
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "sourceType": "module",
        "parser": "babel-eslint"
    },
    "env": {
        "browser": true,
        "node": true,
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "rules": {
        "indent": ["warn", 4],
        "quotes": ["warn", "single"],
        "semi": ["error", "never"],
        "no-console": "off",
        "no-unused-vars": "off",
    }
}