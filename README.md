# Proxify-Objects
Uses Proxies to create computed values

## Install
``$ npm install --save proxify-objects ``

## Usage
```` JS
const makeNewProxy = require( 'proxify-objects' );

let circle = makeNewProxy({ radius: 3, area: 2 }, {
    area(obj) {
        return obj.radius * obj.radius * Math.PI
    }
})

circle.radius = 10
circle.area
//=> 314.1592653589793
````
## What it does
It allows you to make computabe properties that look like normal properties. In the example above area depends on radius so when we set the radius it updates the area according to the function specified in the second parameter of the function.
## Can it do more?
Of course it can.
```` JS

circle = makeNewProxy({ radius: 3, area: 2 }, {
    area(obj) {
        return obj.radius * obj.radius * Math.PI
    }
}, {
    area(target, property, value) {
        circle.radius = Math.sqrt(value / Math.PI)
        return value
    }
})

circle.area = 100
circle.radius
//=> 5.641895835477563
````
## What did that do?
It just created a bidirectional relationship between the area and radius of the circle; now the radius has just been updated based on the area of the circle.
So now whenever the radius is updated it updates the area and when the area is updated it updates the radius.

## API
## makeNewProxy(objectToBeProxied, gettersObject, settersObject)

### objectToBeProxied:

 Just a Plain Ol JavaScript Object that may or may not have all the properties you wish to have computed.
 
### gettersObject:

 Another PoJo with keys equal to the properties you wish to have computed and values of the function you wish to compute with. The function will be called with the function signature: 
 
`` function( proxyObjectItself) ``

### returning

 Anything you return within this function will be used as the computed value without restriction.
 
#### defaultCase

 A special key with the name `defaultCase` can be called whenever a key is not on the original object. This can be used dynamically create properties to be read from. It is called with the function signature:
 
 `` function( proxyObject, keyBeingCalledFor ) ``
 
### settersObject:

 Another PoJo with keys equal to the properties you want to control the setting of; with values of the functionl you wish to create that setting with. The function will be called with the function signature:
 
 `` function( proxyObjectItself, keyBeingAttemptedToSet, valueBeingAttemptedToSet ) ``
 
#### Returning
 
 If what is returned is ``Undefined`` or no return is specified:
 	No additional assignment on the object will be made.
 If what is returned is anything but ``Undefined``:
 	Whatever is returned will be assigned to the key specified and its value will be whatever is returned from that function.

#### defaultCase
 
 A special key with the name `defaultCase` can be called whenever a key is not on the original object. This can be used dynamically create properties to be read from. It is called with the function signature:
 
 `` function( proxyObjectItself, keyBeingAttemptedToBeSet, valueAttemptedToBeingSet, originalPoJoObjectToAvoidRecursion ) ``
 
 *Note*: anything set on the original PoJo Object is automatically available to the object returned from making the proxy.
