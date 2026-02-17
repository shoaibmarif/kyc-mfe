const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
    // Determine which .env file to use
    const envFile = env?.production ? '.env.production' : env?.staging ? '.env.staging' : '.env';

    // Load environment variables
    const dotenv = require('dotenv');
    const envVars = dotenv.config({ path: path.resolve(__dirname, envFile) }).parsed || {};

    const isProduction = argv.mode === 'production';
    // Check process.env FIRST (Netlify vars), then fall back to .env files
    const customMainUrl =
        process.env.REACT_HOST_MAIN_URL || envVars.REACT_HOST_MAIN_URL || 'http://localhost:5000';

    return {
        mode: argv.mode || 'development',
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
            publicPath: 'auto',
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                customMain: path.resolve(__dirname, '../custom-main-shell/src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require('tailwindcss')(
                                            path.resolve(__dirname, 'tailwind.config.js'),
                                        ),
                                        require('autoprefixer'),
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                async: false,
            }),
            new ModuleFederationPlugin({
                name: 'kycMfe',
                filename: 'remoteEntry.js',
                exposes: {
                    './App': './src/App.tsx',
                    './SignUpForm': './src/pages/SignUpForm.tsx',
                    './services/auth': './src/services/auth/index.ts',
                },
                remotes: {
                    customMain: `customMain@${customMainUrl}/remoteEntry.js`,
                },
                shared: {
                    react: {
                        singleton: true,
                        strictVersion: false,
                        requiredVersion: '^18.2.0 || ^19.0.0',
                    },
                    'react-dom': {
                        singleton: true,
                        strictVersion: false,
                        requiredVersion: '^18.2.0 || ^19.0.0',
                    },
                    'react-router-dom': {
                        singleton: true,
                        strictVersion: false,
                    },
                    'react-hook-form': {
                        singleton: true,
                        strictVersion: false,
                        eager: true,
                    },
                    'react-toastify': {
                        singleton: true,
                        strictVersion: false,
                        eager: true,
                    },
                    axios: {
                        singleton: true,
                        strictVersion: false,
                        eager: true,
                    },
                    zod: {
                        singleton: true,
                        strictVersion: false,
                        eager: true,
                    },
                    '@hookform/resolvers': {
                        singleton: true,
                        strictVersion: false,
                        eager: true,
                    },
                    clsx: {
                        singleton: true,
                        strictVersion: false,
                    },
                    'react-select': {
                        singleton: true,
                        strictVersion: false,
                    },
                    'react-day-picker': {
                        singleton: true,
                        strictVersion: false,
                    },
                },
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
            new Dotenv({
                path: path.resolve(__dirname, envFile),
                systemvars: true,
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            port: parseInt(envVars.REMOTE_PORT) || 5005,
            open: false,
            historyApiFallback: true,
            client: {
                overlay: false,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };
};
