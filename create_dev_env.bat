mkdir orig

move duelyst.js orig
call js-beautify orig/duelyst.js > duelyst.js

move vendor.js orig
call js-beautify orig/vendor.js > vendor.js