'use strict';

describe('jsonrpc', function() {

  // Fixtures:
  var DATA_GET = {points: [{lat:10, long:20}, {lat:20, long:30}]};

  var $httpBackend, uuid, callback, errback;

  beforeEach(module('jsonrpc'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    uuid = $injector.get('uuid');
    uuid.generate = jasmine.createSpy('uuid.generate()');

    callback = jasmine.createSpy('Success');
    errback = jasmine.createSpy('Error');
  }));

  describe('direct call', function() {

    var jsonrpc;

    beforeEach(inject(function($injector) {
      jsonrpc = $injector.get('jsonrpc');
    }));

    it('should make an RPC call with the default path', function() {
      uuid.generate.andReturn(1);
      $httpBackend.expectPOST(
          '/rpc',
          {jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}}
      ).respond({jsonrpc: '2.0', result: DATA_GET, id: 1});

      jsonrpc.request('svc.Get', {max: 10}, {}).
          success(callback).error(errback);
      expect(uuid.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(DATA_GET);
      expect(errback).not.toHaveBeenCalled();
    });

    it('should make an RPC call with the specified path', function() {
      uuid.generate.andReturn(1);
      $httpBackend.expectPOST(
          'https://api.example.com/rpc',
          {jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}}
      ).respond({jsonrpc: '2.0', result: DATA_GET, id: 1});

      jsonrpc.request('https://api.example.com/rpc', 'svc.Get', {max: 10}, {}).
          success(callback).error(errback);
      expect(uuid.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(DATA_GET);
      expect(errback).not.toHaveBeenCalled();
    });

  });

  describe('service creator', function() {

    var service;

    beforeEach(inject(function(jsonrpc) {
      service = new function() {
        var svc = jsonrpc.newService('svc');
        this.get = svc.createMethod('Get');
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make an RPC call', function() {
      uuid.generate.andReturn(1);
      $httpBackend.expectPOST(
          '/rpc',
          {jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}}
      ).respond({jsonrpc: '2.0', result: DATA_GET, id: 1});

      service.get({max:10}).success(callback).error(errback);
      expect(uuid.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(DATA_GET);
      expect(errback).not.toHaveBeenCalled();
    });
  });
});
