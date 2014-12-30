//exports.dummy = function () {
//    console.log('dummy loaded externally.');
//};
//
//var content = 'return (function(options) { ' +
//    '   console.log("Hello", options.name); ' +
//    '   return 123; ' +
//    '})(this)';
//
//var fn = Function;
//var a = (new fn(content)).apply({ name: 'fred' });
//console.log('result', a);

//(function (platform) {
//    //platform.registerPlugin('dummy', function (options) {
//    //    console.log('dummy called', options);
//    //});
//
//    return function (options) {
//        console.log('dummy called', options);
//    };
//})(this);

//return function (options) {
//    console.log('dummy called', options);
//};


exports.test = function() {

};

//(function (exports) {

    var abc = 123;

    exports = function(options, next) {
        platform.on('')
    };

    //return exports;

//})(this);
