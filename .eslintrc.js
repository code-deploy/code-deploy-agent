module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "babel"
  ],
  "ecmaFeatures": {
    "classes": true,
    "experimentalObjectRestSpread": true
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "no-undef": 2,
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "babel/generator-star-spacing": 1,
    "babel/new-cap": 1,
    "babel/array-bracket-spacing": 1,
    "babel/object-curly-spacing": 1,
    "babel/object-shorthand": 0,
    "babel/arrow-parens": 0,
    "babel/no-await-in-loop": 1,
    "babel/flow-object-type": 1
  },
  "globals": {
    "console": true,
    "process": true
  }
};
