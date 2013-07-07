'use strict';

describe('jsonrpc', function() {

  var $httpBackend, uuid;

  beforeEach(module('jsonrpc'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    uuid = $injector.get('uuid');
    uuid.generate = jasmine.createSpy('uuid.generate()');
  }));

  describe('service creator', function() {

    var service, callback, errback;

    beforeEach(inject(function(jsonrpc) {
      service = new function() {
        var svc = jsonrpc.newService('svc');
        this.get = svc.createMethod('Get');
      };

      callback = jasmine.createSpy('Success');
      errback = jasmine.createSpy('Error')
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make an RPC call', function() {
      var data = {points: [{lat:10, long:20}, {lat:20, long:30}]};
      uuid.generate.andReturn(1);

      $httpBackend.
          expectPOST('/rpc', {
              jsonrpc: '2.0',
              method: 'svc.Get',
              id: 1,
              params: {max: 10}
          }).
          respond({jsonrpc: '2.0', result: data, id: 1});

      service.get({max:10}).success(callback).error(errback);
      expect(uuid.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(data);
      expect(errback).not.toHaveBeenCalled();
    });
  });
});
