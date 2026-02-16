module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            // Strict Text Colors
            textColor: {
                primary: 'rgb(var(--text-primary) / <alpha-value>)',
                secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
                ternary: 'rgb(var(--text-ternary) / <alpha-value>)',
            },
            // Strict Background Colors
            backgroundColor: {
                primary: 'rgb(var(--bg-primary) / <alpha-value>)',
                secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
                ternary: 'rgb(var(--bg-ternary) / <alpha-value>)',
            },
            // Strict Border Colors (Matching bg/text logic)
            borderColor: {
                primary: 'rgb(var(--border-primary) / <alpha-value>)',
                secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
                ternary: 'rgb(var(--border-ternary) / <alpha-value>)',
            },
            // Also map ring colors for focus states
            ringColor: {
                primary: 'rgb(var(--border-primary) / <alpha-value>)',
                secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
                ternary: 'rgb(var(--bg-ternary) / <alpha-value>)', // Use accent for rings
            }
        },
    },
    plugins: [],
};
