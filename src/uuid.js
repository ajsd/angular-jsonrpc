'use strict';

/**
 * An ID generator.
 * Based on http://stackoverflow.com/a/2117523/377392.
 */
function UuidService() {
  this.format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
}


/**
 * @return {string} A UUID.
 */
UuidService.prototype.generate = function() {
  /**! http://stackoverflow.com/a/2117523/377392 */
  return this.format.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};
