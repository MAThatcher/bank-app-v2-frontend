const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
Object.defineProperty(window, 'crypto', { value: require('crypto').webcrypto, configurable: true });
