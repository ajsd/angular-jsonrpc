'use strict';
angular.module('jsonrpc', ['uuid']).provider('jsonrpc', function () {
  var defaults = this.defaults = {};
  defaults.basePath = '/rpc';
  this.$get = [
    '$http',
    'uuid4',
    function ($http, uuid4) {
      function jsonrpc(options, config) {
        var id = uuid4.generate();
        var payload = {
            jsonrpc: '2.0',
            method: options.method,
            id: id
          };
        if (angular.isDefined(options.data)) {
          payload.params = options.data;
        }
        return $http.post(options.path || defaults.basePath, payload, config).then(function (response) {
          if (response.data.hasOwnProperty('error')) {
            throw response.data.error;
          }
          return response.data.result;
        });
      }
      jsonrpc.request = function (path, method, data, config) {
        if (arguments.length < 4) {
          config = data;
          data = method;
          method = path;
          path = null;
        }
        return jsonrpc({
          path: path,
          method: method,
          data: data
        }, config);
      };
      function Service(name, path) {
        this.serviceName = name;
        this.path = path;
      }
      Service.prototype.createMethod = function (name, config) {
        var path = this.path;
        var method = this.serviceName + '.' + name;
        return function (data) {
          return jsonrpc.request(path, method, data, config);
        };
      };
      jsonrpc.newService = function (name, path) {
        return new Service(name, path);
      };
      jsonrpc.setBasePath = function (path) {
        defaults.basePath = path;
        return this;
      };
      jsonrpc.getBasePath = function () {
        return defaults.basePath;
      };
      return jsonrpc;
    }
  ];
  this.setBasePath = function (path) {
    defaults.basePath = path;
    return this;
  };
});