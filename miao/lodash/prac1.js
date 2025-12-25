//传入什么属性名，它返回的函数就用来获取对象的属性值
function property(prop) {
    // return bind(get,null, _, prop) //当一个函数调用另一个函数，传入的参数不变的情况下，永远可以被优化为bind写法
    return function(obj) {
        // return obj[prop]
        return get(obj, prop) //get(obj, path)得到深层路径下的属性值
    }
}

//获取object的'a.b.c'属性
//传参方式一：get(object, 'a[0].b.c',defalut)
//传参方式二：get(object, ['a','0','b','c'])
function get(obj, path, defaultVal) {
    if (typeof path === 'string') {
        path = toPath(path) //将字符串path转为数组，如传参方式二
    }
    for (let i = 0; i < path.length; i++) {
        if (obj == undefined) { //null == undefined//true，或是循环中读到空
            return defaultVal
        }
        obj = obj[path[i]]
    }
    return obj
}

//得到obj在path路径上的属性值，找不到返回defaultVal.仅限path为数组的情况
function get2(obj, path, defaultVal) {
    if (obj == undefined) {
        return defaultVal
    } else
    if (path.length == 0) {
        return obj
    } else {
        return get2(obj[path[0]], path.slice(1), defaultVal)
    }
}


function toPath(val) {
    if (Array.isArray(val)) {
        return val
    } else {
        var result = val.split('][')
            .reduce((res, it) => res.concat(it.split('].')), [])
            .reduce((res, it) => res.concat(it.split('[')), [])
            .reduce((res, it) => res.concat(it.split('.')), [])
        var item = result[result.length - 1]
        if (item[item.length - 1] === ']') { //val最后属性为[2]时，该项为2]，需要把]去掉
            result[result.length - 1] = item.slice(0, item.length - 1)
        }
        return result
    }
}

function toPath(val) {
    if (Array.isArray(val)) {
        return val
    } else {
        var result = val.split(/\]\[|\]\.|\.|\[|\]/) //'[1]a[0].b.c[0][3][4].foo.bar[2]'
        if (res[0] === '') {
            res.shift()
        }
        if (res[res.length - 1] == -'') {
            res.pop()
        }
        return res
    }
}


//src为filter接收的对象，判断src是否是obj的子集.没有考虑深层次嵌套
//函数构造器matches，返回的函数传入的参数应是传入matches里的超集。不支持深层
function matches(src) {
    return function(obj) {
        if (obj === src) {
            return true
        }
        for (var key in src) {
            if (!obj.hasOwnProperty(key) || obj[key] !== src[key]) {
                return false
            }
        }
        return true
    }
}
//对matches的优化改进，支持了深层比较
function matches(src) {
    // return bind(isMatch, null, window, src)
    return function(obj) {
        return isMatch(obj, src)
    }
}


//判断obj是否全包含src，src的每个属性及值都在obj上找到并相等.支持深层
//测试用例 isMatch({a:1,b:2,c:3,d:{x:1,y:2}}, {b:2,d:{x:1}})
function isMatch(obj, src) {
    if (obj === src) {
        return true
    }
    if ((typeof obj == 'object') + (typeof src == 'object') !== 2) { //不是都为对象
        return true
            //这条if忽略了_.isMatch(5,{a:2})返回false的情况，但_isMatch(5,{})返回true
    }
    for (var key in src) {
        if (src[key] && typeof src[key] !== 'object') {
            if (!obj.hasOwnProperty(key) || obj[key] !== src[key]) { //基本类型也能调用hasOwnProperty方法.这里没有考虑到null和undefined的情况，这两个特殊值进入这个if会报错
                return false
            }
        } else { //src[key]是Object，深层判断
            if (!isMatch(obj[key], src[key])) {
                return false
            }
        }
    }
    return true
}



//判断obj在path路径下的属性值与val是否深度相等
function matchesProperty(path, val) {
    return function(obj) {
        return isEqual(get(obj, path), val)
    }
}


function map(collection, mapper) {
    mapper = iteratee(mapper)
    var result = []
    for (var key in collection) { //collection[key] maybe a object...
        result.push(mapper(collection[key], key, collection))
    }
    return result
}









function filter(collection, predicate) {
    predicate = iteratee(predicate)
    var result = []
    for (var key in collection) {
        if (predicate(collection[key], key, collection) === true) {
            result.push(collection[key])
        }
    }
    return result
}

function isMatchByRegexp(re) {
    return function(item) {
        return re.test(item)
    }
}

function iteratee(func) {
    if (typeof func === 'function') {
        return func
    } else if (typeof func === 'string') {
        return property(func) //输入属性，返回属性值
    } else if (Array.isArray(func)) {
        return matchesProperty(...func) // 输入...[key,val]，返回断言是否其超集
    } else if (func instanceof RegExp) {
        return isMatchByRegexp(func) //输入正则，返回断言是否匹配string
    } else if (typeof func === 'object') {
        return matches(func) //输入对象，返回断言是否其超集
    }
}


function bind(f, thisArg, ...fixedArgs) {
    return function(...args) {
        var parameters = fixedArgs.slice()
        var j = 0
        for (let i = 0; i < parameters.length; i++) {
            if (Object.is(parameters[i], bind.placeholder)) {
                if (j < args.length) {
                    parameters[i] = args[j++]
                } else {
                    parameters[i] = undefined
                }
            }
        }
        while (j++ < args.length) {
            parameters.push(args[j])
        }
        return f.apply(thisArg, parameters)
    }
}


var ary = [5, -2, -3, 5, 6, 7, -1, -2, 6, -2]
    // out-of-place
function mergeArr(ary) {
    var result = []
    for (let i = 0; i < ary.length; i++) {
        let item = ary[i]
        if (item < 0) {
            for (let j = i + 1; j < ary.length; j++) {
                if (ary[j] < 0) {
                    item += ary[j]
                } else {
                    i = j - 1
                    break
                }
            }

        }
        result.push(item)
    }
    return result

}
// in-place
function mergeArr(ary) {
    var ai = 0
    for (let i = 0; i < ary.length; i++) {
        if (ary[i] >= 0) {
            ary[ai++] = ary[i]
        } else {
            let item = ary[i]
            for (var j = i + 1; j < ary.length; j++) {
                if (ary[j] < 0) {
                    item += ary[j]
                } else {
                    break
                }
            }
            i = j - 1
            ary[ai++] = item
        }
    }
    ary.length = ai
    return ary
}



bind.placeholder = window;

function bind(f, thisArg, ...fixedArgs) {
    return function(...args) {
        let parameters = fixedArgs.slice()
        let j = 0
        for (let i = 0; i < fixedArgs.length; i++) {
            if (Object.is(parameters[i], bind.placeholder)) {
                if (j < args.length) {
                    parameters[i] = args[j++]
                } else {
                    parameters[i] = undefined
                }
            }
        }
        while (j < args.length) {
            parameters.push(args[j++])
        }

        return f.apply(thisArg, parameters)
    }
}