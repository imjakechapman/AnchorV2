'use strict';

define(['jquery', /* require common modules */ ], function($) {

  var $win, $doc, $body;

  return {
    init: function($w, $d) {
      $win = $w;
      $doc = $d;
      $body = $('body');

      // Initialize common modules
    }
  };
});