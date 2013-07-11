/* global describe, inject, module, beforeEach, afterEach, it, expect, jasmine */
/* jshint camelcase:false */
'use strict';

describe('jsonrpc', function() {

  // Fixtures:
  var DATA = {points: [{lat:10, long:20}, {lat:20, long:30}]};

  var callback, errback;

  beforeEach(function() {
    callback = jasmine.createSpy('Success');
    errback = jasmine.createSpy('Error');
  });

  beforeEach(module('jsonrpc'));

  var $httpBackend, jsonrpc, uuid4;

  beforeEach(inject(function(_$httpBackend_, _jsonrpc_, _uuid4_) {
    $httpBackend = _$httpBackend_;
    jsonrpc = _jsonrpc_;
    uuid4 = _uuid4_;

    uuid4.generate = jasmine.createSpy('uuid4.generate()');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('direct call', function() {

    it('should make an RPC call with the default path', function() {
      uuid4.generate.andReturn(1);
      $httpBackend.expectPOST(
          '/rpc',
          {jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}}
      ).respond({jsonrpc: '2.0', result: DATA, id: 1});

      jsonrpc.request('svc.Get', {max: 10}, {}).
          success(callback).error(errback);
      expect(uuid4.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(DATA);
      expect(errback).not.toHaveBeenCalled();
    });

    it('should make an RPC call with the specified path', function() {
      uuid4.generate.andReturn(1);
      $httpBackend.expectPOST(
          'https://api.example.com/rpc',
          {jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}}
      ).respond({jsonrpc: '2.0', result: DATA, id: 1});

      jsonrpc.request('https://api.example.com/rpc', 'svc.Get', {max: 10}, {}).
          success(callback).error(errback);
      expect(uuid4.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(DATA);
      expect(errback).not.toHaveBeenCalled();
    });

  });

  describe('service creator', function() {
    function Service() {
      var svc = jsonrpc.newService('svc');
      this.get = svc.createMethod('Get');
    }
    var service;

    beforeEach(function() {
      service = new Service();
    });

    it('should make an RPC call', function() {
      uuid4.generate.andReturn(1);
      $httpBackend.expectPOST(
          '/rpc',
          {jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}}
      ).respond({jsonrpc: '2.0', result: DATA, id: 1});

      service.get({max:10}).success(callback).error(errback);
      expect(uuid4.generate.callCount).toEqual(1);

      $httpBackend.flush();
      expect(callback.callCount).toEqual(1);
      expect(callback.mostRecentCall.args[0]).toEqual(DATA);
      expect(errback).not.toHaveBeenCalled();
    });
  });
});
