const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
   publicPath: process.env.NODE_ENV === 'production'
    ? '/shoemart/' // production path for GitHub Pages
    : '/' ,
  transpileDependencies: true
})
