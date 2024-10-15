const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Adiciona os polyfills para stream e vm
  config.resolve.fallback = {
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
    crypto: require.resolve('crypto-browserify'),  // Caso não tenha adicionado antes
  };

  return config;
};
