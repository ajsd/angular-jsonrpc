describe('jsonrpc', function() {

  beforeEach(function() {
    angular.module('jsonrpcTest', ['jsonrpc', 'mocks']);
    module('jsonrpcTest');
  });

  var $httpBackend, uuid;

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    uuid = $injector.get('uuid');
  }));

  describe('service creator', function() {

    var service;

    beforeEach(inject(function(jsonrpc) {
      service = jsonrpc.newService('svc');
      service.get = service.createMethod('Get');
    }));

    afterEach(function() {
      uuid.clearAndVerifyNoneRemain();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make an RPC call', function() {
      $httpBackend.expectPOST('/rpc', {
        jsonrpc: '2.0', method: 'svc.Get', id: 1, params: {max: 10}
      }).respond({
        jsonrpc: '2.0', result: {points: [{lat:10, long:20}, {lat:20, long:30}]},
        error: null, id: 1
      });
      uuid.setNext(1);
      service.get({max:10}).success(function(data) {
        expect(data.points).toEqual([{lat:10, long:20}, {lat:20, long:30}]);
      });
      $httpBackend.flush();
    });
  });
});
