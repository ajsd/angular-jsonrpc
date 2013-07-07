'use strict';

function MockUuidService() {
  this.next_ = [];
}

MockUuidService.prototype.generate = function() {
  return this.next_.shift();
};

MockUuidService.prototype.setNext = function(/* values */) {
  var next = this.next_;
  angular.forEach(arguments, function(value) {
    next.push(value);
  });
};

MockUuidService.prototype.clear = function() {
  var remaining = this.next_.length;
  this.next_ = [];
  return remaining;
};

MockUuidService.prototype.clearAndVerifyNoneRemain = function() {
  var remaining = this.clear();
  if (remaining !== 0) {
    throw new Error('Expected no remaing UUIDs, but found ' + remaining);
  }
};
