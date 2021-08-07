var aut1smer = function() {

    //将ary拆分成size长度的区块，返回拆分后的二维数组
    function chunk(ary, size = 1) {
        let res = []
        if (size >= ary.length) {
            res = ary
            return res
        }
        for (let i = 0; i < ary.length; i += size) {
            let temp = []
            let end = ary[i + size - 1] ? i + size : ary.length
            for (let j = i; j < end; j++) {
                temp.push(ary[j])

            }
            res.push(temp)
        }
        return res
    }

    //返回无假值数组  假值：false、null、0、''、undefined、NaN
    function compact(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            if (ary[i]) {
                res.push(ary[i])
            }
        }
        return res
    }

    //concat 有展平一层的功能
    function concat(ary, ...args) {
        let res = ary.slice()
        for (let i = 0; i < args.length; i++) {
            if (Array.isArray(args[i])) {
                for (let j = 0; j < args[i].length; j++) {
                    res.push(args[i][j])
                }
            } else {
                res.push(args[i])
            }
        }
        return res
    }

    //深度展平
    function flattenDeep(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            if (Array.isArray(ary[i])) {
                let item = flattenDeep(ary[i])
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(ary[i])
            }
        }
        return res
    }

    function flattenDeep2(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            res = res.concat(Array.isArray(ary[i]) ? flattenDeep2(ary[i]) : ary[i])
        }
        return res
    }

    function flattenDeep3(ary) {
        return ary.reduce((res, item) => {
            return res.concat(Array.isArray(item) ? flattenDeep3(item) : item)
        }, [])
    }


    //根据depth递归减少ary的层级
    function flattenDepth(ary, depth = Infinity) {
        if (depth == 0) {
            return ary.slice()
        }

        let res = []
        for (let i = 0; i < ary.length; i++) {
            if (Array.isArray(ary[i])) {
                let item = flattenDepth(ary[i], depth - 1)
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(ary[i])
            }
        }
        return res
    }

    function groupBy(ary, predicate) {
        let res = {}
        for (let i = 0; i < ary.length; i++) {
            let key
            if (typeof predicate == 'function') {
                key = predicate(ary[i])
            } else {
                key = ary[i][predicate] // 以属性为基准
            }
            if (!(key in res)) {
                res[key] = []
            }
            res[key].push(ary[i])
        }
        return res
    }

    function keyBy(ary, predicate) {
        let res = {}
        for (let i = 0; i < ary.length; i++) {
            let key
            if (typeof predicate == 'function') {
                key = predicate(ary[i], i)
            } else {
                key = ary[i][predicate]
            }
            res[key] = ary[i]
        }
        return res
    }

    function forEach(ary, action) {
        let dealed = Object(ary)
        if (Array.isArray(ary)) {
            let len = ary.length
            for (let i = 0; i < len; i++) {
                if (action(ary[i], i) === false) {
                    break
                }
            }
        } else { //处理对象
            for (let k in ary) {
                if (action(ary[k], k) === false) {
                    break
                }
            }
        }
    }

    //传入什么属性名，它返回的函数就用来获取对象的什么属性名
    //传参类型一： a.b ----> obj[a][b]
    //
    function property(prop) { //a.b
        return get.bind(null, window, prop)
            // return function(obj){
            //     // return obj[prop] //只支持单个属性名
            //     return get(obj, prop) //得到深层次属性，转成bind返回的函数
            // }
    }

    //可跳跃绑定的bind  
    bind.placeholder = window

    function bind(f, thisArg, ...fixedArgs) { //bind(f, {}, 1, 2, _, 3, _, 4)
        return function(...args) { // 5,8, 9,10
            var parameters = fixedArgs.slice()
            var j = 0
            for (var i = 0; i < parameters.length; i++) {
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



    //比较对象source是否是对象object的子集
    //isMatch({a:1,b:2,d:{x:1,y:2}}, {b:2,d:{x:1}})   // true
    function isMatch(object, source) { //只有
        if (object === source) {
            return true
        }
        if (typeof object !== 'object' || typeof source !== 'object') {
            return false
        }
        for (var key in source) {
            if (object.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object') {
                    if (!isMatch(object[key], source[key])) {
                        return false
                    }
                } else { //原始类型
                    if (object[key] !== source[key]) {
                        return false
                    }
                }
            } else { //object中没有src的key属性
                return false
            }
        }
        return true
    }
    //matches接收的对象是item的子集，返回断言函数，断言函数依据src作为判断基准
    function matches(src) {
        // return bind(isMathch, null, window, )
        return function(obj) {
            //src是obj的子集，src里的属性及值在obj里都有
            for (let key in src) {
                if (!obj.hasOwnProperty(key) || src[key] !== obj[key]) {
                    return false
                }
            }
            return true
        }
    }

    function matches(src) { //当完成了isMatch函数后，可利用该函数写matches函数
        // return function (obj) {
        //     return isMatch(obj, src)
        // }
        return bind(isMatch, null, window, src)
    }



    //给定对象的属性是否与source深度相等
    //matchesProperty接收['key',val]（同{key:val}），断言依据这个数组判断接收的对象有无该键值对
    function matchesProperty(path, val) {
        return function(obj) {
            return isEqual(get(obj, path), val)
        }
    }

    //获取object的'a.b.c'属性
    //传参方式一：get(object, 'a[0].b.c',defalut)
    //传参方式二：get(object, ['a','0','b','c'])
    function get(object, path, defaultVal) {
        if (typeof path === 'string') {
            path = toPath(path)
        }
        for (let i = 0; i < path.length; i++) {
            if (object == undefined) { //reduce没有办法提前返回；null也读不到属性
                return defaultVal
            }
            object = object[path[i]]

        }
        return object
    }

    //递归写法，获取object的path路径上的属性
    function get(object, path, defaultVal = undefined) {
        if (object == undefined) { //object传进来时可能为null，递归过程中可能为undefined
            return defaultVal
        } else if (path.length == 0) {
            return object
        } else {
            return get(object[path[0]], path.slice(1), defaultVal)
        }
    }
    //将String的路径转为数组 
    //假设路径合法， 'a[0].b.c[0][3][4].foo.bar[2]'  ---> ['a','0','b','c','0','3','4','foo','bar']  右括号必须遇到左括号或者.，单独的左括号和单独的.
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
            var res = val.split(/\]\[|\]\.|\.|\[|\]/)
            if (res[0] === '') {
                res.shift()
            }
            if (res[res.length - 1] === '') {
                res.pop()
            }
            return res
        }
    }

    function map(collection, mapper) {
        if (typeof mapper === 'string') {
            mapper = property(mapper) //_.property('a.b')
        } else if (Array.isArray(mapper)) {
            mapper = matchesProperty(...mapper) //  _.matchesProperty('a', 4)
        } else if (typeof mapper === 'object') {
            mapper = matches(mapper) // _.matches({ 'a': 4, 'c': 6 })
        }

        var result = []
            //考虑到collection是对象的时候
        for (var key in collection) {
            result.push(mapper(collection[key], key, collection))
        }
        return result
    }



    // function map(ary, mapper) {
    //     let dealed = new Object(ary)
    //     let res = []
    //     if (Array.isArray(dealed)) {
    //         //此时mapper必是function类型
    //         if (typeof mapper === 'function') {
    //             for (let i = 0; i < dealed.length; i++) {
    //                 res.push(mapper(dealed[i], i))
    //             }
    //         } else { //作属性
    //             for (let i = 0; i < dealed.length; i++) {
    //                 res.push(dealed[i][mapper])
    //             }
    //         }

    //     } else { //处理对象
    //         if (typeof mapper === 'function') {
    //             for (let k in dealed) {
    //                 res.push(mapper(dealed[k], k))
    //             }
    //         } else { //谓词当做属性
    //             for (let k in dealed) {
    //                 if (k == mapper) {
    //                     res.push(dealed[mapper])
    //                 }
    //             }
    //         }
    //     }
    //     return res
    // }

    //根据不同类型生成不同的断言函数
    function iteratee(maybePredicate) {
        if (typeof maybePredicate === 'function') {
            return maybePredicate
        }
        if (typeof maybePredicate === 'stirng') { //给我一个字符串，断言生成器property生成一个判断这个属性在不在item、item[属性]=这个属性值的断言函数
            return property(maybePredicate)
        }
        if (Array.isArray(maybePredicate)) {
            return matchesProperty(...maybePredicate)
        }
        if (typeof maybePredicate === 'object') {
            return matches(maybePredicate)
        }
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





    function reduce(ary, reducer, initial) {
        let startIdx = 0
        if (arguments.length == 2) {
            initial = ary[0]
            startIdx = 1
        }
        if (Array.isArray(ary)) {
            for (let i = startIdx; i < ary.length; i++) {
                initial = reducer(initial, ary[i], i)
            }
        } else { //处理对象
            for (let k in ary) {
                initial = reducer(initial, ary[k], k)
            }
        }

        return initial
    }

    function reduceRight(ary, reducer, initial) { //从后向前，没考虑对象
        let startIdx = ary.length - 1
        if (arguments.length == 2) {
            initial = ary[ary.length - 1]
            startIdx = ary.length - 2
        }
        if (Array.isArray(ary)) {
            for (let i = startIdx; i >= 0; i--) {
                initial = reducer(initial, ary[i], i)
            }
        } else { //对象虽然不能从后向前遍历，但...好歹...能遍历把
            for (let k in ary) {
                initial = reducer(initial, ary[k], k)
            }
        }
        return initial
    }


    function zip(...args) {
        let res = []
        let maxLength = 0
        for (let i = 0; i < args.length; i++) {
            maxLength = args[i].length > maxLength ? args[i].length : maxLength
        }
        for (let i = 0; i < maxLength; i++) {
            let temp = []
            for (let j = 0; j < args.length; j++) {
                if (typeof args[j][i] !== 'undefined') {
                    temp.push(args[j][i])
                }
            }
            res.push(temp)
        }
        return res
    }

    function unzip(ary) {
        let res = []
        let len = ary[0].length
        for (let i = 0; i < len; i++) {
            let temp = []
            for (let j = 0; j < ary.length; j++) {
                temp.push(ary[j][i])
            }
            res.push(temp)
        }
        return res
    }

    function every(ary, test) {
        let len = ary.length
        for (let i = 0; i < len; i++) {
            if (!test(ary[i], i)) {
                return false
            }
        }
        return true
    }

    function every2(ary, test) {
        return ary.reduce((res, item, idx) => {
            return res && test(item, idx)
        }, true)
    }

    function every3(ary, test) {
        return !some(ary, (item, idx) => {
            return !test(item, idx)
        })
    }

    function some(ary, test) {
        let len = ary.length
        for (let i = 0; i < len; i++) {
            if (test(ary[i], i)) {
                return true
            }
        }
        return false
    }

    function some2(ary, test) {
        return ary.reduce((res, item, idx) => {
            return res || test(item, idx)
        }, false)
    }

    function fill(ary, value, start = 0, end = ary.length) {
        for (let i = start; i < end; i++) {
            ary[i] = value
        }
        return ary
    }

    function reverse(ary) {
        let left = 0,
            right = ary.length - 1
        while (left < right) {
            let temp = ary[left]
            ary[left] = ary[right]
            ary[right] = temp
            left++
            right--
        }
        return ary
    }


    function keys(obj) {
        let dealed = new Object(obj)
        let res = []
        for (let k in dealed) {
            if (obj.hasOwnProperty(k))
                res.push(k)
        }
        return res
    }

    function values(obj) {
        let dealed = new Object(obj)
        let res = []
        for (let k in dealed) {
            if (dealed.hasOwnProperty(k)) {
                res.push(dealed[k])
            }
        }
        return res
    }

    function isEqual(a, b) {
        if (a === b) {
            return true
        }
        var typea = typeof a
        var typeb = typeof b
        if (typea !== typeb) { //类型不同
            return false
        } else {
            //类型相同,同为obj
            if (typea === 'object') {
                //数组、对象
                if (Array.isArray(a) + Array.isArray(b) == 1) { //一个数组一个不是数组
                    return false
                }
                if (Array.isArray(a)) { //两个数组
                    if (a.length !== b.length) {
                        return false
                    }
                } else { //两个对象
                    if (Object.keys(a).length !== Object.keys(b).length) {
                        return false
                    }
                }
                for (let key in a) {
                    if (!(key in b)) {
                        return false
                    }
                    if (!isEqual(a[key], b[key])) {
                        return false
                    }
                }
                return true
            } else {
                return a === b
            }
        }
    }

    function toArray(value) {
        let res = [],
            type = typeof value
        if (type === 'object') {
            for (let k in value) {
                res.push(value[k])
            }
        } else if (type === 'string') {
            for (let i = 0; i < value.length; i++) {
                res.push(value[i])
            }
        }
        return res
    }


    function sum(ary) {
        let res = 0
        for (let i = 0; i < ary.length; i++) {
            res += ary[i]
        }
        return res
    }

    function sum2(ary) {
        return ary.reduce((res, item) => {
            return res + item
        })
    }

    //根据谓词求和，谓词用来计算每项的值，或是在对象里作为属性传属性值
    function sumBy(ary, predicate) {
        if (typeof predicate === 'function') {
            return ary.reduce((res, item, idx) => {
                    return res + predicate(item, idx)
                }, 0) //必须从0开始
        } else {
            return ary.reduce((res, item) => {
                return res + item[predicate]
            }, 0)
        }

    }
    //返回它自己
    function identity(val) {
        return val
    }

    function sumByXieran(ary, predicate = identity) {
        if (typeof predicate !== 'function') {
            predicate = property(predicate)
        }
        return ary.reduce((res, item, idx) => {
            return res + predicate(item, idx)
        }, 0)
    }

    function sumBy2(ary, predicate) {
        let res = 0
        for (let i = 0; i < ary.length; i++) {
            if (typeof predicate === 'function') {
                res += predicate(ary[i], i)
            } else {
                res += ary[i][predicate]
            }
        }
        return res
    }


    //存疑  全局isNaN(undefined)=true，Number.isNaN(undefined)=false,
    // 全局 isNaN(new Number(NaN))=true  Number.isNaN(new Number(NaN)) = false 
    function isNaN(val) {
        if (val !== val) {
            return true
        }
        if (Number.isNaN(val)) {
            return true
        }
        if (typeof val === 'object') {
            return true
        }
        return false
    }

    function isNull(val) {

        if (val === null) {
            return true
        }
        return false
    }

    function isNil(val) {
        if (val === null || val === undefined) {
            return true
        }
        return false
    }

    function isUndefined(val) {
        if (val === undefined) return true
        return false
    }

    //随机打乱顺序 Fisher-Yates Shuffle
    function shuffle(collection) {
        let res
        if (Array.isArray(collection)) {
            res = []
            let count = collection.length
            for (let i = 0; i <= count; i++) {
                res = res.concat(collection.splice(Math.floor(Math.random() * (collection.length)), 1))
            }
        } else { //对象乱序，对象好像没法乱序

        }
        return res
    }

    // 根据谓词计数，谓词可以是函数也可以是属性
    function countBy(collection, predicate) {
        if (typeof predicate === 'function') {

            return collection.reduce((res, item, idx) => {

                let key = predicate(item, idx)
                if (!(key in res)) {
                    res[key] = 1
                } else {
                    res[key] += 1
                }
                return res
            }, {})
        } else { //把predicate当做一个属性看待
            return collection.reduce((res, item, idx) => {

                let key = item[predicate]
                if (!(key in res)) {
                    res[key] = 1
                } else {
                    res[key] += 1
                }
                return res
            }, {})
        }
    }

    //创建一个数组，以谓词处理的结果升序排列。需要稳定排序。collection可以是Array|Object一个可迭代的集合。predicate谓词是函数。
    function sortBy(collection, predicate) {
        let res = []
        if (!collection) {
            return []
        }
        //插入排序是稳定的
        if (Array.isArray(collection)) {
            for (let i = 1; i < collection.length; i++) {
                let t = collection[i]
                let temp = predicate(collection[i], i)

                for (var j = i - 1; j >= 0; j--) {
                    if (predicate(collection[j]) > temp) {
                        collection[j + 1] = collection[j]
                    } else {
                        break
                    }
                }
                collection[j + 1] = t
            }
            //排好序了，按照特定格式输出
            for (let i = 0; i < collection.length; i++) {
                let temp = []
                for (let k in collection[i]) {
                    temp.push(collection[i][k])
                }
                res.push(temp)
            }

        }

        return res
    }

    //除了Set哈希表以外，去重都是n^2，最低不过nlogn(排序后遍历一遍)
    function unique(ary) {
        let set = new Set()
        for (let i = 0; i < ary.length; i++) {
            if (set.has(ary[i])) {
                continue
            } else {
                set.add(ary[i])
            }
        }

        let res = []
        set.forEach(item => {
            res.push(item)
        })
        return res
            // return Array.from(new Set(ary))
    }

    function uniqueBy(ary, predicate) {
        let hashmap = new Map()

        if (typeof predicate === 'function') {
            for (let i = 0; i < ary.length; i++) {
                let key = predicate(ary[i], i)
                if (hashmap.has(key)) {
                    continue
                } else {
                    hashmap.set(key, ary[i])
                }
            }

        } else { //谓词视作对象的属性
            for (let i = 0; i < ary.length; i++) {
                let key = ary[i][predicate]
                if (hashmap.has(key)) {
                    continue
                } else {
                    hashmap.set(key, ary[i])
                }
            }
        }
        //填入完毕，进行输出   
        let res = []
        hashmap.forEach((value, key) => {
            res.push(value)
        })
        return res

    }

    //递归下降parseJSON   str = '{"aa":"123","b":{"x":1,"y":[35,36,37],"z":null},"ccc":false}'
    function parseJSON(str) {
        var i = 0
        return parseValue()
            //将str的不同类型分发到各个函数
        function parseValue() {
            if (str[i] === '[') {
                return parseArray()
            }
            if (str[i] === '{') {
                return parseObject()
            }
            if (str[i] === '"') {
                return parseString()
            }
            if (str[i] === 't') {
                return parseTrue()
            }
            if (str[i] === 'f') {
                return parseFalse()
            }
            if (str[i] === 'n') {
                return parseNull()
            }
            return parseNumber()
        }

        function parseArray() {
            var thisAry = []
            i++
            while (str[i] !== ']') {
                var val = parseValue()
                thisAry.push(val)
                if (str[i] == ',') {
                    i++
                }
            }
            i++
            return thisAry
        }

        function parseObject() {
            var thisObj = {}
            i++
            while (str[i] !== '}') {
                var key = parseString()
                i++
                var val = parseValue()
                thisObj[key] = val
                if (str[i] === ',') {
                    i++
                }
            }
            i++
            return thisObj
        }

        function parseString() {
            var thisStr = ''
            i++
            while (str[i] !== '"') {
                thisStr += str[i++]
            }
            i++
            return thisStr
        }

        function parseNumber() {
            var thisNum = ''
            while (str[i] >= '0' && str[i] <= '9') {
                thisNum = str[i++]
            }
            return Number(thisNum)
        }

        function parseTrue() {
            var s = str.substr(i, 4)
            if (s === 'true') {
                i += 4
                return true
            } else {
                throw new SyntaxError('unexpected token ' + s + ' in pos of ' + i)
            }
        }

        function parseFalse() {
            var s = str.substr(i, 5)
            if (s === 'false') {
                i += 5
                return false
            } else {
                throw new SyntaxError('unexpected token ' + s + ' in pos of ' + i)
            }
        }

        function parseNull() {
            var s = str.substr(i, 4)
            if (s === 'null') {
                i += 4
                return null
            } else {
                throw new SyntaxError('unexpected token ' + s + ' in pos of ' + i)
            }
        }
    }


    return {
        chunk: chunk,
        compact: compact,
        concat: concat,
        unique: unique,
        uniqueBy: uniqueBy,
        flattenDeep: flattenDeep,
        flattenDepth: flattenDepth,
        groupBy: groupBy,
        keyBy: keyBy,
        forEach: forEach,
        map: map,
        filter: filter,
        reduce: reduce,
        zip: zip,
        unzip: unzip,
        keys: keys,
        values: values,
        every: every,
        some: some,
        fill: fill,
        sortBy: sortBy,
        isEqual: isEqual,
        reverse: reverse,
        countBy: countBy,
        reduceRight: reduceRight,
        shuffle: shuffle,
        isNaN: isNaN,
        isNull: isNull,
        isNil: isNil,
        isUndefined: isUndefined,
        toArray: toArray,
        sum: sum,
        sumBy: sumBy,
        parseJSON: parseJSON,
    }
}()