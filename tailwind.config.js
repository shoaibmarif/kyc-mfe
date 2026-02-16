const sharedConfig = require('./tailwind.theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    ...sharedConfig,
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    // Inherit theme from sharedConfig
    theme: {
        ...sharedConfig.theme,
        extend: {
            ...sharedConfig.theme.extend,
            // Add MFE specific extensions here if needed
        },
    },
    plugins: [],
};
