"use strict";

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: [
          'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
          'vendor/jquery'
        ],
        _common: 'modules/_common',
    }
});

define(["require", "jquery", "_common"], function(require, $, _common) {

  var $win = $(window),
      $doc = $(document),
      features = {},
      featureQueue = [];

  // checking for any data features and loading them
  function loadFeatures() {

    // initialize all required feature scripts based off of data-feature attribute of an element
    // Require.js will not duplicate http requests for modules
    $('*[data-feature]').each(function(i, el) {
      var feature = $(el).data('feature');
      featureQueue.push('_' + feature);
    });

    // require module and initialize
    require(featureQueue, function() {
      for ( var i = 0; i < arguments.length; i++ ) {
        var feature = arguments[i],
            featureName = loadQueue[i];

        features[featureName] = feature;
        feature.init($win, $doc);
      }
    });
  }

  // destroy any features to clean event handler stack
  function destroyFeatures() {
    $.each(features, function(name, feature) {
      console.log('destroy _' + name);
      feature.destroy();
    });
  }

  return {
    init: function($w, $d) {
      _common.init($win, $doc);

      loadFeatures();
    }
  };

});