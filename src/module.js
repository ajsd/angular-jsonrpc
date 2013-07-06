angular.module('jsonrpc', []).
    service('uuid', UuidService).
    provider('jsonrpc', JsonRpcProvider);
