
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/transfers/**/*.test.js'],
  setupFiles: ['<rootDir>/test/transfers/setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },
  // CRA's Jest 27 resolver predates React Router 7's package exports.
  moduleNameMapper: {
    '^axios$': '<rootDir>/node_modules/axios/dist/node/axios.cjs',
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom/dist/index.js',
    '^react-router/dom$': '<rootDir>/node_modules/react-router/dist/development/dom-export.js',
    '\\.(png|jpg|svg)$': '<rootDir>/test/transfers/assetMock.js',
  },
};

