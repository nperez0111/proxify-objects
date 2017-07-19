'use strict';

var isFn = require('is-fn'),
    isArr = function isArr(a) {
    return Array.isArray(a);
};

function makeNewProxy(obj, properties) {
    var setters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


    var keys = Object.keys(properties),
        settersKeys = Object.keys(setters),
        hasProp = function hasProp(which, prop) {
        return which.indexOf(prop) > -1;
    };

    var proxyObject = new Proxy(obj, {
        get: function get(target, property) {
            if (!property) return noop;

            if (hasProp(keys, property)) {
                return properties[property](proxyObject);
            }
            if (!target.hasOwnProperty(property) && hasProp(keys, 'defaultCase')) {
                return properties.defaultCase(proxyObject, property);
            }

            return target[property];
        },
        set: function set(target, property, value) {
            if (!property) return noop;
            var ret = value;
            if (hasProp(settersKeys, property)) {
                var val = setters[property];
                if (isFn(val)) {
                    ret = val(proxyObject, property, value);
                }
                if (ret === undefined) {
                    return true;
                }
            } else if (hasProp(settersKeys, 'defaultCase')) {

                ret = setters.defaultCase(proxyObject, property, value, target);

                if (ret === undefined) {
                    return true;
                }
            }

            target[property] = ret;

            return true;
        }
    });
    return proxyObject;
}

module.exports = makeNewProxy;
