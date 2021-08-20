var aut1smer = function() {


    /*-----------------------------------
     *              Array
     *------------------------------------
     */

    //将ary拆分成size长度的区块，返回拆分后的二维数组
    function chunk(ary, size = 1) {
        if (size >= ary.length) {
            return [ary.slice()]
        }
        let res = []
        let len = ary.length
        for (let i = 0; i < len; i += size) {
            let temp = []
            let end = (i + size) <= len ? i + size : len //end取不到
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


    //有展平一层的功能
    function concat(ary, ...args) {
        let res = ary.slice()
        for (let i = 0; i < args.length; i++) {
            let item = args[i]
            if (Array.isArray(item)) {
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(item)
            }
        }
        return res
    }

    // 二维数组变一维
    function flatten(ary) {
        let result = []
        for (let i = 0; i < ary.length; i++) {
            let item = ary[i]
            if (Array.isArray(item)) {
                for (let it of item) {
                    result.push(it)
                }
            } else {
                result.push(item)
            }
        }
        return result
    }

    //深度展平为一维数组
    function flattenDeep(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            let item = ary[i]
            if (Array.isArray(ary[i])) { //如果是数组就展平成一维数组
                item = flattenDeep(ary[i])
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(item)
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
        return ary.reduce((res, item) => res.concat(Array.isArray(item) ? flattenDeep3(item) : item), [])
    }


    //根据depth递归减少ary的层级
    function flattenDepth(ary, depth = 1) {
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


    function difference(ary, ...values) {
        var result = []
        var valuesAry = flattenDeep(values)
        for (let i = 0; i < ary.length; i++) {
            if (!valuesAry.includes(ary[i])) {
                result.push(ary[i])
            }
        }
        return result
    }

    // _.differenceBy(array, [values], [iteratee=_.identity])
    function differenceBy(ary, ...values) {
        var differ = values[values.length - 1]
        var valuesAry
        if (!Array.isArray(differ)) {
            differ = iteratee(differ) //_.property
            valuesAry = flattenDeep(values.slice(0, -1)).map((it) => differ(it))
        } else {
            differ = identity // it => it
            valuesAry = flattenDeep(values).map((it) => differ(it))
        }
        var result = []
        for (let i = 0; i < ary.length; i++) {
            if (!valuesAry.includes(differ(ary[i], i))) {
                result.push(ary[i])
            }
        }
        return result
    }


    function differenceWith(ary, ...values) {
        var differWith = values[values.length - 1]

        if (Array.isArray(differWith)) {
            differWith = isEqual
            values = flattenDeep(values)
        } else { //not ary, but function
            values = flattenDeep(values.slice(0, -1))
        }
        return ary.filter(it => {
            for (let item of values) {
                if (differWith(it, item)) {
                    return false
                }
            }
            return true
        })
    }

    function intersection(...arys) {
        var ary = arys[0]
        var values = arys.slice(1)
        var result = []
        for (var value of values) { //values二维数组
            for (var item of ary) {
                if (value.includes(item)) {
                    result.push(item)
                }
            }
        }
        return result
    }

    //_.intersectionBy([arrays], [iteratee=_.identity])
    function intersectionBy(...arys) {
        var predicate = arys[arys.length - 1]
        var ary = arys[0]
        var values
        if (Array.isArray(predicate)) { //没传iteratee
            predicate = identity
            values = flattenDeep(arys.slice(1)).map(it => predicate(it))
        } else {
            predicate = iteratee(predicate)
            values = flattenDeep(arys.slice(1, -1)).map(it => predicate(it))
        }

        var result = []
        for (let i = 0; i < ary.length; i++) {
            if (values.includes(predicate(ary[i]))) {
                result.push(ary[i])
            }
        }
        return result
    }


    function intersectionWith(ary, ...arrays) {
        let comparator = arrays[arrays.length - 1]
        if (Array.isArray(comparator)) {
            comparator = isEqual
            arrays = flattenDeep(arrays)
        } else {
            comparator = iteratee(comparator) //maybe it needs
            arrays = flattenDeep(arrays.slice(0, -1))
        }
        return ary.filter(it => {
            for (var item of arrays) {
                if (comparator(it, item)) {
                    return true
                }
            }
            return false
        })
    }

    //找到第一个插入位置
    // _.sortedIndex(30, 40);返回NaN  _.sortedIndex('512', 40);返回3  _.sortedIndex(30, 40);返回1
    function sortedIndex(ary, value) { //ary为sorted
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return NaN
        }
        let start = 0,
            end = ary.length; //不包括end
        //最后要取什么？取start：因为end取不到且end代表前面是>=value的位置。到最后只可能从[30,40,40]的前一个40的mid值返回，或者其他例子：[30,40,40,60]  [40,40,40] 皆从 return mid处返回。 [50,50],80，从return start处返回
        while (start < end) {
            let mid = (start + end) >> 1
            if (value < ary[mid]) {
                end = mid
            } else if (value > ary[mid]) {
                start = mid + 1
            } else { //相等
                if (ary[mid - 1] != value) {
                    return mid
                } else {
                    end = mid
                }
            }
        }
        return start //start = end... [50,50],80。 这个位置即大于等于又小于value
    }

    //找到第一个插入位置
    function sortedIndexBy(ary, value, predicate = identity) {
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return NaN
        }
        predicate = iteratee(predicate)

        let v = predicate(value)
        let left = 0,
            right = ary.length //有可能插到ary.length
        while (left < right) {
            let mid = (left + right) >> 1 //奇数项正中间，偶数项右半部分第一个
            let midVal = predicate(ary[mid])
            if (midVal < v) {
                left = mid + 1
            } else if (midVal > v) {
                right = mid
            } else {
                if ((mid - 1) < 0 || predicate(ary[mid - 1]) != v) { //(mid -1)<0说明left = mid = 0，找到最前面了且ary[mid - 1]无效索引值
                    return mid
                } else { //前面还有相等的
                    right = mid
                }
            }
        }
        return left //找到最右边了，即ary[ary.length - 1] < value
            //找到最左边了，即ary[right]>value
    }

    //binary search on a sorted ary. find first index of val which was in ary
    function sortedIndexOf(ary, val) {
        if (val == undefined) {
            return -1
        }
        let begin = 0,
            end = ary.length
        while (begin < end) {
            let mid = (begin + end) >> 1
            if (ary[mid] >= val) {
                end = mid
            } else {
                begin = mid + 1
            }
        }
        //begin为第一个大于等于val的位置
        if (ary[begin] === val) {
            return begin
        }
        return -1
    }




    //除了Set哈希表以外，去重都是n^2，最低不过nlogn(排序后遍历一遍)
    function uniq(ary) {
        // return Array.from(new Set(ary))
        let set = new Set()
        for (let i = 0; i < ary.length; i++) {
            set.has(ary[i]) || set.add(ary[i])
        }
        var result = []
        for (var item of set) {
            result.push(item)
        }
        return result
    }
    // O(n^2)写法
    function uniq2(ary) {
        let result = []
        for (let i = 0; i < ary.length; i++) {
            if (!result.includes(ary[i])) {
                result.push(ary[i])
            }
        }
        return result
    }

    //根据断言判断计算出的key是否相同，相同则去重
    function uniqBy(ary, predicate = identity) {
        predicate = iteratee(predicate)
        let hashMap = new Map()
        for (let i = 0; i < ary.length; i++) {
            let key = predicate(ary[i], i, ary)
            hashMap.has(key) || hashMap.set(key, ary[i])
        }
        let result = []
        for (let item of hashMap) {
            result.push(item[1])
        }
        return result
    }

    //xieran
    function uniqBy2(ary, predicate = identity) {
        predicate = iteratee(predicate)
        var result = []
        var seen = new Set()
        for (var i = 0; i < ary.length; i++) {
            var computed = predicate(ary[i], i, ary)
            if (!seen.has(computed)) {
                result.push(ary[i])
                seen.add(computed)
            }
        }
        return result
    }
    // _.uniqWith([{a:1,b:2},{a:2,b:5},{a:1,b:2},{a:2,b:5}],_.isEqual);返回[{a:1,b:2},{a:2,b:5}]
    //时间退化到O(n^2)
    function uniqWith(ary, comparator = isEqual) {
        if (ary.length < 1) {
            return []
        }
        let result = [ary[0]]
        for (let i = 1; i < ary.length; i++) {
            let flag = true
            let item = ary[i]
            for (let j = 0; j < result.length; j++) {
                if (comparator(ary[j], item)) {
                    flag = false //有重复
                    break
                }
            }
            if (flag) {
                result.push(ary[i])
            }
        }
        return result
    }
    //xieran
    function uniqWith2(ary, comparator = isEqual) {
        var result = []
        for (let i = 0; i < ary.length; i++) {
            if (!result.some(it => comparator(it, ary[i]))) { //遍历result，有一项和ary[i]深度相等就不放入result里
                result.push(ary[i])
            }
        }
        return result
    }

    //扔掉前0项的新数组
    function drop(ary, n = 1) {
        return ary.slice(n)
    }

    //扔掉最后n项的新数组
    function dropRight(ary, n = 1) {
        if (n >= ary.length) {
            return []
        } else if (n <= 0) {
            return ary.slice()
        }
        return ary.slice(0, ary.length - n)

    }

    //前面通过测验的略过，从第一个没有通过测验的开始拿
    function dropWhile(ary, predicate = identity) {
        predicate = iteratee(predicate)
        for (var i = 0; i < ary.length; i++) {
            if (!predicate(ary[i], i, ary)) {
                break
            }
        }
        return ary.slice(i) // i [0,length]
    }
    //从后向前测，删除通过的元素直至第一个没通过的元素出现
    function dropRightWhile(ary, predicate = identity) {
        predicate = iteratee(predicate)
        for (var i = ary.length - 1; i >= 0; i--) {
            if (!predicate(ary[i], i, ary)) {
                break
            }
        }
        return ary.slice(0, i + 1)
    }

    function findIndex(ary, predicate = identity, fromIndex = 0) {
        predicate = iteratee(predicate)
        for (let i = fromIndex; i < ary.length; i++) {
            if (predicate(ary[i], i, ary)) {
                return i
            }
        }
        return -1
    }

    function findLastIndex(ary, predicate = identity, fromIndex = ary.length - 1) {
        predicate = iteratee(predicate)
        for (let i = fromIndex; i >= 0; i--) {
            if (predicate(ary[i], i, ary)) {
                return i
            }
        }
        return -1
    }


    function fromPairs(pairs) {
        var result = {}
        for (var item of pairs) {
            result[item[0]] = item[1]
        }
        return result
    }

    function head(ary) {
        return ary[0]
    }

    function indexOf(ary, val, fromIndex = 0) {
        for (let i = fromIndex; i < ary.length; i++) {
            if (ary[i] === val) {
                return i
            }
        }
        return -1
    }

    function lastIndexOf(ary, val, fromIndex = ary.length - 1) {
        for (let i = fromIndex; i >= 0; i--) {
            if (val === ary[i]) {
                return i
            }
        }
        return -1
    }

    function initial(ary) {
        let len = ary.length - 1
        let result = []
        for (let i = 0; i < len; i++) {
            result.push(ary[i])
        }
        return result
    }

    function last(ary) {
        return ary[ary.length - 1]
    }


    function join(ary, separator = ',') {
        let str = ''
        for (let i = 0; i < ary.length - 1; i++) {
            str += ary[i].toString() + separator
        }
        str += ary[ary.length - 1]
        return str
    }

    function nth(ary, n = 0) {
        if (n < 0) {
            n = n + ary.length
        }
        return ary[n]
    }

    //移除和values相等的全部值
    function pull(ary, ...values) {
        let set = new Set(values)
        let temp = []
        for (let i = 0; i < ary.length; i++) {
            if (!set.has(ary[i])) {
                temp.push(ary[i])
            }
        }
        ary = temp
        return ary
    }

    function pullAll(ary, values) {
        let set = new Set(values)
        let temp = []
        for (let i = 0; i < ary.length; i++) {
            if (!set.has(ary[i])) {
                temp.push(ary[i])
            }
        }
        ary = temp
        return ary
    }

    function pullAllBy(ary, values, predicate = identity) {
        predicate = iteratee(predicate)
        values = new Set(values.map(it => predicate(it)))
        ary = ary.filter(it => {
            var val = predicate(it)
            return !values.has(val)
        })
        return ary
    }

    function pullAllWith(ary, values, comparator = isEqual) {
        ary = ary.filter(it => {
            for (let value of values) {
                if (comparator(it, value)) {
                    return false
                }
            }
            return true
        })
        return ary
    }

    /* --------------------------Array-------------------------- */



    /*-----------------------------------
     *              Collection
     *------------------------------------
     */

    function groupBy(collection, predicate = identity) {
        if (typeof predicate == 'string') {
            predicate = property(predicate) // property(propPath)
        }
        let res = {}
        for (var cKey in collection) {
            var key = predicate(collection[cKey], cKey, collection)
            if (Array.isArray(res[key])) {
                res[key].push(collection[cKey])
            } else {
                res[key] = [collection[cKey]]
            }
        }
        return res
    }


    //会出现覆盖的情况，即res.length <= collection.length
    function keyBy(collection, predicate = identity) {
        if (typeof predicate == 'string') {
            predicate = iteratee(predicate)
        }
        let res = {}
        for (var cKey in collection) {
            var key = predicate(collection[cKey], cKey, collection)
            res[key] = collection[cKey]
        }
        return res
    }

    //遍历对象自有可枚举属性
    function forEach(collection, predicate = identity) {
        // forOwn(collection, action)
        predicate = iteratee(predicate)
        for (var key in collection) {
            if (predicate(collection[key], key, collection) === false)
                break
        }
        return collection
    }


    function map(collection, mapper = identity) {
        // if (typeof mapper === 'string') {
        //     mapper = property(mapper) //_.property('a.b')
        // }
        mapper = iteratee(mapper)
        var result = []
        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                result.push(mapper(collection[key], key, collection))
            }
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



    function reduce(collection, reducer, initial) {
        let keyAry = []
        for (let key in collection) { //对象也可能从1开始数
            if (collection.hasOwnProperty(key)) {
                keyAry.push(key)
            }
        }

        let startIdx = 0
        if (arguments.length == 2) {
            startIdx = 1
            initial = collection[keyAry[0]]
        }
        for (let i = startIdx; i < keyAry.length; i++) {
            initial = reducer(initial, collection[keyAry[i]], keyAry[i], collection)
        }
        return initial
    }



    function reduceRight(collection, reducer, initial) {
        let keyAry = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                keyAry.push(key)
            }
        }
        let len = keyAry.length
        let startIdx = len - 1
        if (arguments.length == 2) {
            startIdx = len - 2
            initial = collection[keyAry[len - 1]]
        }
        for (let i = startIdx; i >= 0; i--) {
            initial = reducer(initial, collection[keyAry[i]], keyAry[i], collection)
        }
        return initial
    }


    function every(collection, test = identity) {
        test = iteratee(test)
        for (var key in collection) {
            if (!test(collection[key])) {
                return false
            }
        }
        return true
    }


    function every1(ary, test) {
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


    function some(collection, test = identity) {
        test = iteratee(test)
        for (var item of collection) {
            if (test(item)) {
                return true
            }
        }
        return false
    }

    function some1(ary, test) {
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


    //随机打乱顺序 Fisher-Yates Shuffle
    function shuffle(collection) {
        let res = []
        for (var k in collection) {
            res.push(collection[k])
        }
        let len = res.length - 1
        for (let i = len; i >= 0; i--) {
            let idx = Math.random() * (i + 1) | 0
            swap(res, idx, i)
        }
        return res
    }

    function swap(ary, i, j) {
        let t = ary[i]
        ary[i] = ary[j]
        ary[j] = t
        return ary
    }




    /*-----------------------------------
     *              Date
     *------------------------------------
     */



    /*-----------------------------------
     *              Function
     *------------------------------------
     */

    //可跳跃绑定的bind  
    bind.placeholder = window;

    function bind(f, thisArg, ...fixedArgs) { //bind(f, {}, 1, 2, _, 3, _, 4)
        return function(...args) { // 5,8, 9,10
            var parameters = fixedArgs.slice()
            var j = 0
            for (var i = 0; i < parameters.length; i++) {
                if (Object.is(parameters[i], bind.placeholder)) { //Object.is()能够做到NaN===NaN
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



    /*-----------------------------------
     *              Lang
     *------------------------------------
     */


    //判断obj是否全包含src，src的每个属性及值都在obj上找到并相等.支持深层
    //测试用例 isMatch({a:1,b:2,c:3,d:{x:1,y:2}}, {b:2,d:{x:1}})
    function isMatch(obj, src) {
        if (obj === src) {
            return true
        }
        if ((typeof obj == 'object') + (typeof src == 'object') == 1) { //不是都为对象
            return false
                //lodash规则奇怪，src可以不是对象，也返回true
        }
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                if (typeof src[key] !== 'object') {
                    if (!obj.hasOwnProperty(key) || obj[key] !== src[key]) {
                        return false
                    }
                } else { //src[key]是Object，深层判断
                    if (src[key] === null && obj[key] !== null) {
                        return false
                    } else if (!isMatch(obj[key], src[key])) {
                        return false
                    }
                }
            }
        }
        return true
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
                return a == b
            }
        }
    }


    function isGreeting(val) {
        return /^h(?:i|ello)$/.test(val)
    }

    //The customizer is invoked with up to six arguments: (objValue, othValue [, index|key, object, other, stack]).
    function customizer(objValue, othValue, idx, obj, other, stack) {
        if (isGreeting(objValue) && isGreeting(othValue)) {
            return true
        }
        //否则返回undefined
    }

    // If customizer returns undefined, comparisons are handled by the method instead.
    function isEqualWith(val, other, customizer = function() {}) {

        if (customizer(val, other) || val === other) { //maybe undefined
            return true
        }
        let typeVal = typeof val
        let typeOther = typeof other
        if (typeVal != typeOther) {
            return false
        } else {
            if (val && typeVal == 'object') {
                let valKeys = keys(val)
                let otherKeys = keys(other)
                if (valKeys.length != otherKeys.length) {
                    return false
                }
                for (let key in val) {
                    if (val.hasOwnProperty(key)) {
                        if (!other.hasOwnProperty(key)) {
                            return false
                        }
                        if (customizer(val[key], other[key], key, val, other)) {
                            continue
                        }
                        if (!isEqualWith(val[key], other[key])) {
                            return false
                        }
                    }
                }
                return true
            } else {
                return customizer(val, other) || val == other
            }
        }
    }


    //存疑  全局isNaN(undefined)=true，Number.isNaN(undefined)=false,
    // 全局 isNaN(new Number(NaN))=true  Number.isNaN(new Number(NaN)) = false 
    //该函数只检测作为数字的NaN。NaN与new Number(NaN)
    function isNaN(val) {
        if (typeof val === 'object') {
            return val.valueOf() !== val.valueOf()
        }
        return val !== val
    }

    //Checks if value is classified as a Function object.
    function isFunction(val) {
        if (typeof val == 'function') {
            return true
        }
        return false
    }

    function isArguments(val) {
        return toString.call(val) === '[object Arguments]'
    }

    function isArray(val) {
        return toString.call(val) === '[object Array]'
    }

    function isArrayBuffer(val) { //指定字节长度的ArrayBuffer对象，表示通用的、固定长度的二进制数据缓冲区
        return Object.prototype.toString.call(val) === '[object ArrayBuffer]'
    }
    //检测值是否为类数组，只要不是function且有有效length属性即可，包括字符串
    function isArrayLike(val) {
        if (typeof val == 'function') {
            return false
        }
        //val.hasOwnProperty('length') document.body.children的length属性是个继承来的getter,故document.body.children.__proto__.hasOwnProperty('length')为true
        if (val.length >= 0 && val.length <= Number.MAX_SAFE_INTEGER) { //53位
            return true
        }
        return false
    }
    //类数组对象：对象里有有效的length属性且不是函数对象
    function isArrayLikeObject(val) {
        if (val && typeof val == 'object') {
            if (val.length >= 0 && val.length <= Number.MAX_SAFE_INTEGER) {
                return true
            }
        }
        return false
    }

    function isBoolean(val) {
        return Object.prototype.toString.call(val) === '[object Boolean]'
    }

    function isDate(val) {
        return Object.prototype.toString.call(val) === '[object Date]'
    }
    //dom元素从html开始皆继承于ELement.prototype 
    function isElement(val) {
        while (val) {
            if (val.__proto__ == Element.prototype) {
                return true
            }
            val = val.__proto__
        }
        return false
    }


    //https://lodash.com/docs/4.17.15#isEmpty
    //原子类型、对象、类数组对象、Map、Set
    function isEmpty(val) {
        if (typeof val != 'object' || !val) {
            return true
        }
        if (Object.prototype.toString(val) !== '[object Object]') {
            if (('size' in val && val.size == 0) || ('length' in val && val.length == 0)) {
                return true
            }
            return false
        }
        if (typeof val == 'object') {
            for (let key in val) {
                if (val.hasOwnProperty(key)) {
                    return false
                }
            }
            return true
        }
    }
    //EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.
    function isError(val) {
        while (val) {
            if (val.__proto__ === Error.prototype) {
                return true
            }
            val = val.__proto__
        }
        return false
    }
    //写法二 不循环
    function isError2(val) {
        if (Object.prototype.toString.call(val) == '[object Error]') {
            return true
        }
        return false
    }

    //Number.MAX_VALUE + 10**(308-16) === Infinity //IEEE754规定，大于1.7976931348623158e+308的数才为Infinity.同 Number.isFinite(),不会进行强制转换
    function isFinite(val) {
        if (typeof val == 'number' && Math.abs(val) !== Infinity) {
            return true
        }
        return false
    }

    //同 Number.isInterger()
    function isInteger(val) {
        // return val === (val | 0) //没法判断64位数
        return typeof val == 'number' && val - Math.floor(val) === 0
    }

    //类数组对象可用length,范围0到4字节
    function toLength(val) {
        if (val >= 0) {
            if (val <= 4294967295) { // 2147483648 * 2 - 1   2^32
                return val | 0
            }
            return 4294967295
        }
        return 0
    }

    function isLength(val) {
        return val === toLength(val)
    }

    function isMap(val) {
        return Object.prototype.toString.call(val) == '[object Map]'
    }

    //Checks if value is a pristine native function.
    function isNative(val) {
        return val.__proto__ == Function.prototype
    }

    // exclude Infinity, -Infinity, and NaN
    function isNumber(val) {
        if (Math.abs(val) == Infinity || val != val || isFinite(val)) {
            return true
        }
        return false
    }

    // (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
    function isObject(val) {
        while (val) {
            if (val.__proto__ == Object.prototype) {
                return true
            }
            val = val.__proto__
        }
        return false
    }

    //A value is object-like if it's not null and has a typeof result of "object".
    function isObjectLike(val) {
        if (val !== null && typeof val == 'object') {
            return true
        }
        return false
    }

    //朴素对象
    function isPlainObject(val) {
        return val.__proto__ === Object.prototype || val.__proto__ === null
    }

    //----------------Lang-----------------








    /*-----------------------------------
     *              Math
     *------------------------------------
     */

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

    function sum3(ary) {
        return sumBy(ary)
    }
    //根据谓词求和，谓词用来计算每项的值，或是在对象里作为属性传属性值
    function sumBy(ary, predicate = identity) { //即predicate= it=>it
        predicate = iteratee(predicate)
        var result = 0
        for (let i = 0; i < ary.length; i++) {
            result += predicate(ary[i], i, ary)
        }
        return result
    }


    function floor(num, precision = 0) {
        var digit = Math.pow(10, precision)
        var result = num * digit | 0
        return result / digit
    }


    /*-----------------------------------
     *              Number
     *------------------------------------
     */


    /*-----------------------------------
     *              Object
     *------------------------------------
     */

    //获取object的'a.b.c'属性
    //传参方式一：get(object, 'a[0].b.c',defalut)
    //传参方式二：get(object, ['a','0','b','c'])
    function get(object, path, defaultVal) {
        if (typeof path === 'string') {
            path = toPath(path) //将字符串path转为数组，如传参方式二
        }
        for (let i = 0; i < path.length; i++) {
            if (object == undefined) { //null == undefined//true，或是循环中读到空。 不用reduce：reduce没有办法提前返回；null也读不到属性
                return defaultVal
            }
            object = object[path[i]]
        }
        return object
    }

    //递归写法，获取object的path路径上的属性
    function get2(object, path, defaultVal = undefined) {
        if (object == undefined) { //object传进来时可能为null，递归过程中可能为undefined
            return defaultVal
        } else if (path.length == 0) {
            return object
        } else {
            return get2(object[path[0]], path.slice(1), defaultVal)
        }
    }


    function forIn(obj, predicate = identity) {
        // predicate = 
        for (var key in obj) {
            if (predicate(obj[key], key, obj) === false) {
                break
            }
        }
        return obj
    }

    function forInRight(obj, predicate = identity) {
        var keyAry = []
        for (var key in obj) {
            keyAry.push(key)
        }
        for (let i = keyAry.length - 1; i >= 0; i--) {
            predicate(obj[keyAry[i]], keyAry[i], obj)
            if (predicate(obj[keyAry[i]], keyAry[i], obj) === false) {
                break
            }
        }
        return obj
    }

    function forOwn(obj, predicate = identity) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (predicate(obj[key], key, obj) === false) {
                    break
                }
            }
        }
        return obj
    }

    function forOwnRight(obj, predicate = identity) {
        var keyAry = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keyAry.push(key)
            }
        }
        for (let i = keyAry.length - 1; i >= 0; i--) {
            if (predicate(obj[keyAry[i]], keyAry[i], obj) === false) {
                break
            }
        }
        return obj
    }

    //将实例对象上的key:val变为[key,val]
    function toPairs(obj) {
        var result = []
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push([key, obj[key]])
            }
        }
        return result
    }

    //返回对象上的所有自有方法名组成的数组
    function functions(obj) {
        var result = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && isFunction(obj[key])) {
                result.push(key)
            }
        }
        return result
    }
    //返回对象上所有 自有方法+原型继承方法的方法名组成的数组
    function functionsIn(obj) {
        var result = []
        for (let key in obj) {
            if (isFunction(obj[key])) {
                result.push(key)
            }
        }
        return result
    }


    function keys(obj) {
        let res = []
        for (let k in obj) {
            if (obj.hasOwnProperty(k))
                res.push(k)
        }
        return res
    }

    function keysIn(obj) {
        let res = []
        for (let k in obj) {
            res.push(k)
        }
        return res
    }

    //对于obj的可枚举属性，依托断言函数修改这些属性名，返回新对象
    function mapKeys(obj, mapper = identity) {
        let res = {}
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                res[mapper(obj[k], k, obj)] = obj[k]
            }
        }
        return res
    }
    //对于obj的可枚举属性，依托断言函数修改这些属性值，返回和原对象property相同的新对象
    function mapValues(obj, mapper = identity) {
        let res = {}
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                res[k] = mapper(obj[k], k, obj)
            }
        }
        return res
    }
    //----------------------Object----------------------------

    /*-----------------------------------
     *              Seq
     *------------------------------------
     */





    /*-----------------------------------
     *              String
     *------------------------------------
     */




    /*-----------------------------------
     *              Util
     *------------------------------------
     */

    //根据不同类型生成不同的断言函数
    function iteratee(maybePredicate) {
        if (typeof maybePredicate === 'function') {
            return maybePredicate
        } else if (typeof maybePredicate === 'string') {
            return property(maybePredicate) //输入属性，返回属性值
        } else if (Array.isArray(maybePredicate)) {
            return matchesProperty(...maybePredicate) // 输入...[key,val]，返回断言是否其超集
        } else if (maybePredicate instanceof RegExp) {
            return isMatchByRegexp(maybePredicate) //输入正则，返回断言是否匹配string
        } else if (typeof maybePredicate === 'object') {
            return matches(maybePredicate) //输入对象，返回断言是否其超集
        }
    }


    //传入什么属性名，它返回的函数就用来获取对象的属性值
    function property(prop) {
        // return bind(get,null, _, prop) //当一个函数调用另一个函数，传入的参数不变的情况下，永远可以被优化为bind写法
        return function(obj) {
            // return obj[prop]
            return get(obj, prop) //get(obj, path)得到深层路径下的属性值
        }
    }



    //将String的路径转为数组 
    //假设路径合法， 'a[0].b.c[0][3][4].foo.bar[2]'  ---> ['a','0','b','c','0','3','4','foo','bar']  右括号必须遇到左括号或者.，单独的左括号和单独的.
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

    function toPath2(val) {
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


    //src为filter接收的对象，判断src是否是obj的子集.没有考虑深层次嵌套
    //函数构造器matches，返回的函数传入的参数应是传入matches里的超集。不支持深层
    function matches2(src) {
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



    //判断obj在path路径下的属性值与val是否深度相等
    function matchesProperty(path, val) {
        return function(obj) {
            return isEqual(get(obj, path), val)
        }
    }


    //返回它自己
    function identity(val) {
        return val
    }
    //调用iteratee n次，返回调用结果
    function times(n, iteratee = identity) {
        let result = []
        let idx = 0
        while (n) {
            result.push(iteratee(idx))
            idx++
            n--
        }
        return result
    }
    //常量函数，创建一个返回val的函数
    function constant(val) {
        return function() {
            return val
        }
    }

    //------------------------Util---------------------



    /*-----------------------------------
     *              Properties
     *------------------------------------
     */






    /*-----------------------------------
     *              Methods
     *------------------------------------
     */
























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
    function sortBy(collection, predicate = identity) {
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
    //lodash可以取出对象里的值进行排序，返回新数组
    function sortBy(collection, ary) { //ary could be [function(o) { return o.user; }] or ['user', 'age']

        //need a compare func
        function compare(a, b, ary, idx = 0) {
            if (typeof ary[idx] == 'function') {
                if (ary[idx](a) < ary[idx](b)) {
                    return -1
                } else if (ary[idx](a) > ary[idx](b)) {
                    return 1
                } else {
                    if (idx < ary.length - 1) {
                        return compare(a, b, ary, idx + 1)
                    } else {
                        return 0
                    }
                }
            }
            if (typeof ary[idx] == 'string') {
                if (a[ary[idx]] < b[ary[idx]]) {
                    return -1
                } else if (a[ary[idx]] > b[ary[idx]]) {
                    return 1
                } else {
                    if (idx < ary.length - 1) {
                        return compare(a, b, ary, idx + 1)
                    } else {
                        return 0
                    }
                }
            }
        }


        // need return a new array
        if (typeof collection == 'object') {
            if (Array.isArray(collection)) {
                collection = collection.slice()
            } else {
                let temp = []
                for (let k in collection) {
                    if (collection.hasOwnProperty(k)) {
                        temp.push(collection[k])
                    }
                }
                collection = temp
            }
        }

        //insertion sort
        for (let i = 1; i < collection.length; i++) {
            let temp = collection[i]
            for (var j = i - 1; j >= 0; j--) {
                if (compare(temp, collection[j], ary) < 0) {
                    collection[j + 1] = collection[j]
                } else {
                    break
                }
            }
            collection[j + 1] = temp
        }
        return collection
    }



    //递归下降parseJson   str = '{"aa":"123","b":{"x":1,"y":[35,36,37],"z":null},"ccc":false}'
    function parseJson(str) {
        var i = 0
        return parseValue()
            //将str的不同类型分发到各个函数
        function parseValue() {
            var c = str[i]
            if (c === '[') {
                return parseArray()
            }
            if (c === '{') {
                return parseObject()
            }
            if (c === '"') {
                return parseString()
            }
            if (c === 't') {
                return parseTrue()
            }
            if (c === 'f') {
                return parseFalse()
            }
            if (c === 'n') {
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
                thisNum += str[i++]
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


    function stringifyJson(value) {
        if (value === null) {
            return null
        } else if (Array.isArray(value)) {
            let str = '['
            for (let i = 0; i < value.length; i++) {
                str += stringifyJson(value[i]) + ','
            }
            str = str.slice(0, -1) + ']'
            return str
        } else if (typeof value === 'object') {
            let str = '{'
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    if (value[key] === undefined) {
                        continue
                    }
                    str += '"' + key + '":' + stringifyJson(value[key]) + ','
                }
            }
            str = str.slice(0, -1) + '}'
            return str
        } else if (typeof value == 'string') {
            return '"' + value + '"'
        } else if (typeof value == 'number') {
            if (value !== value || Math.abs(value) === Infinity) {
                return null
            }
            return value
        } else if (typeof value == 'boolean') {
            return value ? 'true' : 'false'
        } else if (value === undefined || typeof value == 'function') {
            return null
        }
    }



    return {
        chunk: chunk,
        compact: compact,
        concat: concat,
        uniq: uniq,
        uniqBy: uniqBy,
        uniqWith: uniqWith,
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
        parseJson: parseJson,
        stringifyJson: stringifyJson,
        forIn: forIn,
        forInRight: forInRight,
        forOwn: forOwn,
        forOwnRight: forOwnRight,
        difference: difference,
        differenceBy: differenceBy,
        differenceWith: differenceWith,
        intersection: intersection,
        intersectionBy: intersectionBy,
        sortedIndex: sortedIndex,
        sortedIndexBy: sortedIndexBy,
        sortedIndexOf: sortedIndexOf,
        floor: floor,
        isMatch: isMatch,
        matches: matches,
        property: property,
        get: get,
        toPath: toPath,
        matchesProperty: matchesProperty,
        drop: drop,
        dropRight: dropRight,
        dropWhile: dropWhile,
        dropRightWhile: dropRightWhile,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        flatten: flatten,
        fromPairs: fromPairs,
        toPairs: toPairs,
        head: head,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        initial: initial,
        intersectionWith: intersectionWith,
        join: join,
        last: last,
        nth: nth,
        pull: pull,
        pullAll: pullAll,
        pullAllBy: pullAllBy,
        pullAllWith: pullAllWith,
        times: times,
        constant: constant,
        isFunction: isFunction,
        functions: functions,
        keysIn: keysIn,
        mapKeys: mapKeys,
        mapValues: mapValues,
        isArguments: isArguments,
        isArray: isArray,
        isBoolean: isBoolean,
        isDate: isDate,
        isEmpty: isEmpty,
        isEqualWith: isEqualWith,
        isArrayLike: isArrayLike,
        isArrayLikeObject: isArrayLikeObject,
        isArrayBuffer: isArrayBuffer,
        isElement: isElement,
        isError: isError,
        isFinite: isFinite,
        isPlainObject: isPlainObject,
        isObjectLike: isObjectLike,
        isObject: isObject,
        isNumber: isNumber,
        isNative: isNative,
        isMap: isMap,
        isLength: isLength,
        toLength: toLength,
        isInteger: isInteger,


    }
}()