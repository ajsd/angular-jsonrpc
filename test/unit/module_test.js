describe('jsonrpc module', function() {
  'use strict';

  beforeEach(module('jsonrpc'));

  it('should inject jsonrpc', inject(function($injector) {
    expect($injector.get('jsonrpc')).toBeDefined();
  }));

});
