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



    //深度展平为一维数组
    function flattenDeep(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            if (Array.isArray(ary[i])) { //如果是数组就展平成一维数组
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
        for (var value of values) {
            if (Array.isArray(value)) {
                for (var item of ary) {
                    if (!value.includes(item)) {
                        result.push(item)
                    }
                }
            }
        }
        return result
    }

    // _.differenceBy(array, [values], [iteratee=_.identity])
    function differenceBy(ary, ...values) {
        var differ = values[values.length - 1]
        if (!Array.isArray(differ)) {
            differ = iteratee(differ) //_.property
            values = values.slice(0, -1)
        } else {
            differ = identity // it=>it
        }
        var result = []
        for (var value of values) {
            for (let i = 0; i < value.length; i++) {
                value[i] = differ(value[i])
            }
            for (var item of ary) {
                if (!value.includes(differ(item))) {
                    result.push(item)
                }
            }

        }
        return result
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
        var filter = arys[arys.length - 1]
        if (Array.isArray(filter)) { //没传iteratee
            filter = identity
        } else {
            filter = iteratee(filter)
        }
        var ary = arys[0]
        var values = arys.slice(1, -1)
        var result = []
        for (var value of values) {
            if (Array.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    value[i] = filter(value[i])
                }
                for (var item of ary) {
                    if (value.includes(filter(item))) {
                        result.push(item)
                    }
                }
            }
        }
        return result
    }

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
    /* --------------------------Array-------------------------- */



    /*-----------------------------------
     *              Collection
     *------------------------------------
     */

    function groupBy(collection, predicate) {
        if (typeof predicate == 'string') {
            predicate = iteratee(predicate) // property(propPath)
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
    function keyBy(collection, predicate) {
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
    function forEach(collection, action) {
        forOwn(collection, action)
    }


    function map(collection, mapper) {
        if (typeof mapper === 'string') {
            mapper = property(mapper) //_.property('a.b')
        }
        var result = []
        for (var key in collection) {
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
        if ((typeof obj == 'object') + (typeof src == 'object') !== 2) { //不是都为对象
            return true
                //这条if忽略了_.isMatch(5,{a:2})返回false的情况，但_isMatch(5,{})返回true
        }
        for (var key in src) {
            if (src[key] && typeof src[key] !== 'object') {
                if (!obj.hasOwnProperty(key) || obj[key] !== src[key]) { //原始类型也能调用hasOwnProperty方法.这里没有考虑到null和undefined的情况，这两个特殊值进入这个if会报错
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


    function forIn(obj, predicate) {
        for (var key in obj) {
            if (predicate(obj[key], key, obj) === false) {
                break
            }
        }
    }

    function forInRight(obj, predicate) {
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
    }

    function forOwn(obj, predicate) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (predicate(obj[key], key, obj) === false) {
                    break
                }
            }
        }
    }

    function forOwnRight(obj, predicate) {
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
    }

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
        parseJSON: parseJSON,
        forIn: forIn,
        forInRight: forInRight,
        forOwn: forOwn,
        forOwnRight: forOwnRight,
        difference: difference,
        differenceBy: differenceBy,
        intersection: intersection,
        intersectionBy: intersectionBy,
        sortedIndex: sortedIndex,
        sortedIndexBy: sortedIndexBy,
    }
}()