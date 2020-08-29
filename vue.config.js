module.exports = {
  // set page title
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'TensorFlowJS Testing';
      return args;
    });

    // enable pug
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .end();
  },
};
