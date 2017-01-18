import test from 'ava';
import fn from './';
const pojo = { radius: 1, area: Math.PI },
    circle = fn(pojo, {
        area(obj) {
            return obj.radius * obj.radius * Math.PI
        }
    }, {
        area(obj, property, value) {
            obj.radius = Math.sqrt(value / Math.PI)
            return value
        }
    }),
    a = r => r * r * Math.PI
test('Test original size', t => {
    t.deepEqual(pojo.radius, 1)
    t.deepEqual(pojo.area, Math.PI)
})

test('Get Proxy values', t => {
    t.deepEqual(circle.radius, 1)
    t.deepEqual(circle.area, Math.PI)
})

test('Set Proxy values', t => {
    for (let i = 0; i < 12; i++) {
        circle.radius = i
        t.deepEqual(circle.area, a(i))
        t.deepEqual(circle.radius, i)
    }
})

test('Set Proxied Setter', t => {
    for (let i = 0; i < 12; i++) {
        circle.area = i * Math.PI * i
        t.deepEqual(circle.area, a(i))
        t.deepEqual(circle.radius, i)
    }
})

test('Get Target', t => {
    circle.area = a(9)
    t.deepEqual(pojo.radius, 9)
    t.deepEqual(pojo.area, a(9))

    circle.radius = 10
    t.deepEqual(pojo.radius, 10)
    t.deepEqual(pojo.area, a(9))
        //desired as we are not attempting to keep the pojo in sync

})


const tri = {
    a: {
        x: 0,
        y: 0
    },
    b: {
        x: 0,
        y: 2
    },
    c: {
        x: 1,
        y: 1
    },
    area: 1,
    height: 2,
    base: 1
}

const triangle = fn(tri, {
    area(obj) {
        return obj.height * obj.base / 2
    },
    height(obj) {
        const get = (xOrY) => ['a', 'b', 'c'].map(prop => {
                return obj[prop][xOrY]
            }),
            min = get('y').reduce((a, b) => {
                return Math.min(a, b)
            }),
            max = get('y').reduce((a, b) => {
                return Math.max(a, b)
            })
        return max - min
    },
    base(obj) {
        const get = (xOrY) => ['a', 'b', 'c'].map(prop => {
                return obj[prop][xOrY]
            }),
            min = get('x').reduce((a, b) => {
                return Math.min(a, b)
            }),
            max = get('x').reduce((a, b) => {
                return Math.max(a, b)
            })
        return max - min
    }
})

test('triangle', t => {
    t.deepEqual(triangle.area, 1)
    t.deepEqual(triangle.height, 2)
    t.deepEqual(triangle.base, 1)
})

test('set triangle prop', t => {
    triangle.b = { x: 0, y: 4 }
    triangle.c = { x: 4, y: 0 }
    t.deepEqual(triangle.area, 8)
    t.deepEqual(triangle.height, 4)
    t.deepEqual(triangle.base, 4)
})


const reverse = fn({}, {}, {
    defaultCase(obj, property, value, originalObj) {
        originalObj[value] = property
    }
})

test('default case of setting - tests reverse', t => {
    reverse.value = 'key'
    t.deepEqual(reverse.key, 'value')
})

const returnsKey = fn({ alreadyHere: 12 }, {
    defaultCase(obj, property, orginalObj) {
        return property
    }
}, {})

test('default case of getting - tests returns key that isnt on object already', t => {
    t.deepEqual(returnsKey.value, 'value')
    t.deepEqual(returnsKey.alreadyHere, 12)
})
