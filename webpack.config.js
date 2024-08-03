const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: '[name].[contenthash].js', // Output filename with content hash for caching
    clean: true, // Clean the output directory before each build
  },
  mode: 'production', // Set mode to 'production' for production optimizations
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Use babel-loader for JavaScript and JSX files
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Load images as file resources
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // Load fonts as file resources
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // Handle CSS files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML template for HtmlWebpackPlugin
    }),
    new CompressionPlugin(), // Enable gzip compression
    new BundleAnalyzerPlugin(), // Optional: Analyze bundle composition
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()], // Minimize JavaScript with TerserPlugin
  },
  devServer: {
    contentBase: './dist', // Serve content from this directory
    hot: true, // Enable hot module replacement
  },
};
