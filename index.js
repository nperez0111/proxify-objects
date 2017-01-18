const isFn = require('is-fn'),
    isArr = a => Array.isArray(a)

function makeNewProxy(obj, properties, setters = {}) {

    const keys = Object.keys(properties),
        settersKeys = Object.keys(setters),
        hasProp = (which, prop) => which.indexOf(prop) > -1

    const proxyObject = new Proxy(obj, {
        get(target, property) {
            if (!property) return noop;

            if (hasProp(keys, property)) {
                return properties[property](proxyObject)
            }
            if (!target.hasOwnProperty(property) && hasProp(keys, 'defaultCase')) {
                return properties.defaultCase(proxyObject, property)
            }

            return target[property]
        },
        set(target, property, value) {
            if (!property) return noop;
            let ret = value
            if (hasProp(settersKeys, property)) {
                let val = setters[property]
                if (isFn(val)) {
                    ret = val(proxyObject, property, value)
                }
                if (ret === undefined) {
                    return true;
                }
            } else if (hasProp(settersKeys, 'defaultCase')) {

                ret = setters.defaultCase(proxyObject, property, value, target)

                if (ret === undefined) {
                    return true
                }
            }

            target[property] = ret

            return true
        }
    })
    return proxyObject
}

module.exports = makeNewProxy
