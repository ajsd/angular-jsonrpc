'use strict';

/**
 * The jsonrpc module.
 */
angular.module('jsonrpc', []).
    service('uuid', UuidService).
    provider('jsonrpc', JsonRpcProvider);
