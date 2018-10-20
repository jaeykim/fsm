WeakMap.prototype.indexOf = x => {
    console.log(this);
    for (let key in Object.keys(this)) {
        if (this[key] == x) return key;
    }
    return -1;
};

WeakMap.prototype.print = () => {
    console.log("sadf");
    console.log(this);
}


var wm = new WeakMap();

wm[0] = 0;
wm[1] = new Object();
wm[2] = {a: 10, b: 20};
var o = wm[1];

function indexOfWeakMap(wm, obj) {
    for (let key in Object.keys(wm)) {
        console.log(`key: ${key}, value: ${wm[key]}`);
        if (wm[key] == obj) return key;
    }
    return -1;
}

function lengthOfWeakMap(wm) {
    return Object.keys(wm).length;
}

console.log(indexOfWeakMap(wm, o));
console.log(lengthOfWeakMap(wm));

