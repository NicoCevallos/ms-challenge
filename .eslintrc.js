module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"prettier/@typescript-eslint",
	],
	rules: {
		"prettier/prettier": "error",
	},
	parserOptions: {
		parser: "@typescript-eslint/parser",
	},
};
