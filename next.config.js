const fetch = require('isomorphic-fetch');
const path = require('path');
const glob = require('glob');
module.exports = {
  async exportPathMap () {
    return {
      '/': { page: '/' },
      'about':{page:'/about'}
    }
  },
  webpack: (config) => {
    config.module.rules.push(
      
    );

    return config;
  },
}
