const colors = require("tailwindcss/colors");

module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				rose: colors.rose,
				gray: colors.gray,
				coolGray: colors.coolGray,
				warmGray: colors.warmGray,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
