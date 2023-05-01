module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "jest/globals": true
  },
  "extends": [
    "react-app",
    "eslint:recommended",
    "plugin:react/recommended",
    // Prettier _must_ come last so it can override other configs
    //   (see https://github.com/prettier/eslint-config-prettier#installation)
    "prettier"
  ],
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "jest"
  ],
  "rules": {
    "react/prop-types": ["warn", { "skipUndeclared": true }],
    "no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
