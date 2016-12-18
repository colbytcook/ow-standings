'use strict';

module.exports = ($el) => {

  require.ensure([], (require) => {

    var Module = require('./overwatchAjax.main');
    new Module($el);

  });

};
