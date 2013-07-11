# angular-jsonrpc

JSON-RPC (v2.0) for AngularJS.

[JSON-RPC](http://www.jsonrpc.org/specification),
[AngularJS](http://angularjs.org)

### Usage

The `jsonrpc` service includes some shorthand methods to quickly create simple
services. The created service methods accept data and optional `$http.Config`
and return `$http.HttpPromise`.

```js
    module = angular.module('xyz', ['jsonrpc']);
    module.service('locationService', function(jsonrpc) {
      var service = jsonrpc.newService('locationsvc');
      this.get = service.createMethod('Get');
      this.save = service.createMethod('Save');
    });
```

This way, the service can be injected into controllers, etc.

```js
    module.controller('Ctrl', function($scope, locationService) {
      $scope.coords = [];
      locationService.get({max: 10}).success(function(data) {
        $scope.coords = data.coords;
      });
      locationService.save({lat: 22, long: 33}, {headers: {'X-ACL': 'x@y.z'}}).
          success(function(data) {}).
          error(function(error) {});
    });
```

The methods used are:

```js
    jsonrpc.request('svc.Get', {x: "y"}, {});  // returns $http.HttpPromise
    jsonrpc.request('/_goRPC_', 'svc.Get', {x: "y"}, {});
```

which internally call

```js
    jsonrpc({path: '/_goRPC_', method: 'svc.Get', data: {x: "y"}}, {});
```

(the last object in each of these calls is an optional `$http.Config` object)

#### Configuration

The base RPC path can be configured using the `jsonrpcProvider`

    module.config(function(jsonrpcProvider) {
      jsonrpcProvider.setBasePath('http://localhost:8000/rpc');
    });


#### TODOs

1. Use $q and resolve the result to a value directly, like $resource.
2. Make services more configurable through `jsonrpc.newService()`.
3. Better tests.

### Licence

MIT open-source [licence](http://opensource.org/licenses/MIT)
