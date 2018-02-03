module.exports = function()
{
    "use strict";
    let self = {};
    self.PORT = 3000;
    self.STATIC_DIR = __dirname + "/../static/";
    self.STATIC_HTML_DIR = self.STATIC_DIR + "html/";
    self.STATIC_JS_DIR   = self.STATIC_DIR + "js/";
    self.STATIC_CSS_DIR  = self.STATIC_DIR + "css/";
    self.BYTE = 1;
    self.KILOBYTE = 1024 * self.BYTE;
    self.MEGABYTE = 1024 * self.KILOBYTE;
    self.MAXIMUM_BYTES = 200 * self.MEGABYTE;
    return self; 
}();
