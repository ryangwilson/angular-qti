var extend = function(target, source) {
    var args = Array.prototype.slice.call(arguments, 0), i = 1, len = args.length, item, j;
    var options = this || {};
    while (i < len) {
        item = args[i];
        for (j in item) {
            if (item.hasOwnProperty(j)) {
                if (target[j] && typeof target[j] === 'object' && !item[j] instanceof Array) {
                    target[j] = extend.apply(options, [target[j], item[j]]);
                } else if (item[j] instanceof Array) {
                    target[j] = target[j] || (options && options.arrayAsObject ? {length: item[j].length} : []);
                    if (item[j].length) {
                        target[j] = extend.apply(options, [target[j], item[j]]);
                    }
                } else if (item[j] && typeof item[j] === 'object') {
                    if (options.objectsAsArray && typeof item[j].length === "number") {
                        if (!(target[j] instanceof Array)) {
                            target[j] = [];
                        }
                    }
                    target[j] = extend.apply(options, [target[j] || {}, item[j]]);
                } else {
                    target[j] = item[j];
                }
            }
        }
        i += 1;
    }
    return target;
};