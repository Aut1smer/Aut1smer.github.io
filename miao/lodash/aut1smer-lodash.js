var aut1sm = function() {

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
            } else if (predicate == 'length') {
                key = ary[i].length
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

    return {
        chunk: chunk,
        compact: compact,
        concat: concat,
        unique: unique,
        uniqueBy: uniqueBy,
        flattenDeep: flattenDeep,
        flattenDepth: flattenDepth,
        groupBy: groupBy,
        keyBy: keyBy
    }
}()