//if (!debug) {
    var logger = window.console;
    window.console = {
        log: function () {
            var args = Array.prototype.slice.call(arguments, 0) || [];
            if (!args.toString().match(/%c/im)) {
                logger.log.apply(logger, args);
            }
        },
        info: function () {
            var args = Array.prototype.slice.call(arguments, 0) || [];
            logger.info.apply(logger, args);
        },
        warn: function () {
            var args = Array.prototype.slice.call(arguments, 0) || [];
            logger.warn.apply(logger, args);
        },
        error: function () {
            var args = Array.prototype.slice.call(arguments, 0) || [];
            logger.error.apply(logger, args);
        }
    };
//}
