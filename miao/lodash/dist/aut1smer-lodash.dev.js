"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var aut1smer = function () {
  //将ary拆分成size长度的区块，返回拆分后的二维数组
  function chunk(ary) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var res = [];

    if (size >= ary.length) {
      res = ary;
      return res;
    }

    for (var i = 0; i < ary.length; i += size) {
      var temp = [];
      var end = ary[i + size - 1] ? i + size : ary.length;

      for (var j = i; j < end; j++) {
        temp.push(ary[j]);
      }

      res.push(temp);
    }

    return res;
  } //返回无假值数组  假值：false、null、0、''、undefined、NaN


  function compact(ary) {
    var res = [];

    for (var i = 0; i < ary.length; i++) {
      if (ary[i]) {
        res.push(ary[i]);
      }
    }

    return res;
  } //concat 有展平一层的功能


  function concat(ary) {
    var res = ary.slice();

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < args.length; i++) {
      if (Array.isArray(args[i])) {
        for (var j = 0; j < args[i].length; j++) {
          res.push(args[i][j]);
        }
      } else {
        res.push(args[i]);
      }
    }

    return res;
  } //深度展平


  function flattenDeep(ary) {
    var res = [];

    for (var i = 0; i < ary.length; i++) {
      if (Array.isArray(ary[i])) {
        var item = flattenDeep(ary[i]);

        for (var j = 0; j < item.length; j++) {
          res.push(item[j]);
        }
      } else {
        res.push(ary[i]);
      }
    }

    return res;
  }

  function flattenDeep2(ary) {
    var res = [];

    for (var i = 0; i < ary.length; i++) {
      res = res.concat(Array.isArray(ary[i]) ? flattenDeep2(ary[i]) : ary[i]);
    }

    return res;
  }

  function flattenDeep3(ary) {
    return ary.reduce(function (res, item) {
      return res.concat(Array.isArray(item) ? flattenDeep3(item) : item);
    }, []);
  } //根据depth递归减少ary的层级


  function flattenDepth(ary) {
    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

    if (depth == 0) {
      return ary.slice();
    }

    var res = [];

    for (var i = 0; i < ary.length; i++) {
      if (Array.isArray(ary[i])) {
        var item = flattenDepth(ary[i], depth - 1);

        for (var j = 0; j < item.length; j++) {
          res.push(item[j]);
        }
      } else {
        res.push(ary[i]);
      }
    }

    return res;
  }

  function groupBy(ary, predicate) {
    var res = {};

    for (var i = 0; i < ary.length; i++) {
      var key = void 0;

      if (typeof predicate == 'function') {
        key = predicate(ary[i]);
      } else {
        key = ary[i][predicate]; // 以属性为基准
      }

      if (!(key in res)) {
        res[key] = [];
      }

      res[key].push(ary[i]);
    }

    return res;
  }

  function keyBy(ary, predicate) {
    var res = {};

    for (var i = 0; i < ary.length; i++) {
      var key = void 0;

      if (typeof predicate == 'function') {
        key = predicate(ary[i], i);
      } else {
        key = ary[i][predicate];
      }

      res[key] = ary[i];
    }

    return res;
  }

  function forEach(ary, action) {
    var dealed = Object(ary);

    if (Array.isArray(ary)) {
      var len = ary.length;

      for (var i = 0; i < len; i++) {
        if (action(ary[i], i) === false) {
          break;
        }
      }
    } else {
      //处理对象
      for (var k in ary) {
        if (action(ary[k], k) === false) {
          break;
        }
      }
    }
  }

  function map(ary, mapper) {
    var dealed = new Object(ary);
    var res = [];

    if (Array.isArray(dealed)) {
      //此时mapper必是function类型
      if (typeof mapper === 'function') {
        for (var i = 0; i < dealed.length; i++) {
          res.push(mapper(dealed[i], i));
        }
      } else {
        //作属性
        for (var _i = 0; _i < dealed.length; _i++) {
          res.push(dealed[_i][mapper]);
        }
      }
    } else {
      //处理对象
      if (typeof mapper === 'function') {
        for (var k in dealed) {
          res.push(mapper(dealed[k], k));
        }
      } else {
        //谓词当做属性
        for (var _k in dealed) {
          if (_k == mapper) {
            res.push(dealed[mapper]);
          }
        }
      }
    }

    return res;
  }

  function filter(ary, test) {
    var res = [];

    for (var i = 0; i < ary.length; i++) {
      if (test(ary[i], i)) {
        res.push(ary[i]);
      }
    }

    return res;
  }

  function reduce(ary, reducer, initial) {
    var startIdx = 0;

    if (arguments.length == 2) {
      initial = ary[0];
      startIdx = 1;
    }

    if (Array.isArray(ary)) {
      for (var i = startIdx; i < ary.length; i++) {
        initial = reducer(initial, ary[i], i);
      }
    } else {
      //处理对象
      for (var k in ary) {
        initial = reducer(initial, ary[k], k);
      }
    }

    return initial;
  }

  function reduceRight(ary, reducer, initial) {
    //从后向前，没考虑对象
    var startIdx = ary.length - 1;

    if (arguments.length == 2) {
      initial = ary[ary.length - 1];
      startIdx = ary.length - 2;
    }

    if (Array.isArray(ary)) {
      for (var i = startIdx; i >= 0; i--) {
        initial = reducer(initial, ary[i], i);
      }
    } else {
      //对象虽然不能从后向前遍历，但...好歹...能遍历把
      for (var k in ary) {
        initial = reducer(initial, ary[k], k);
      }
    }

    return initial;
  }

  function zip() {
    var res = [];
    var maxLength = 0;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    for (var i = 0; i < args.length; i++) {
      maxLength = args[i].length > maxLength ? args[i].length : maxLength;
    }

    for (var _i2 = 0; _i2 < maxLength; _i2++) {
      var temp = [];

      for (var j = 0; j < args.length; j++) {
        if (typeof args[j][_i2] !== 'undefined') {
          temp.push(args[j][_i2]);
        }
      }

      res.push(temp);
    }

    return res;
  }

  function unzip(ary) {
    var res = [];
    var len = ary[0].length;

    for (var i = 0; i < len; i++) {
      var temp = [];

      for (var j = 0; j < ary.length; j++) {
        temp.push(ary[j][i]);
      }

      res.push(temp);
    }

    return res;
  }

  function every(ary, test) {
    var len = ary.length;

    for (var i = 0; i < len; i++) {
      if (!test(ary[i], i)) {
        return false;
      }
    }

    return true;
  }

  function every2(ary, test) {
    return ary.reduce(function (res, item, idx) {
      return res && test(item, idx);
    }, true);
  }

  function every3(ary, test) {
    return !some(ary, function (item, idx) {
      return !test(item, idx);
    });
  }

  function some(ary, test) {
    var len = ary.length;

    for (var i = 0; i < len; i++) {
      if (test(ary[i], i)) {
        return true;
      }
    }

    return false;
  }

  function some2(ary, test) {
    return ary.reduce(function (res, item, idx) {
      return res || test(item, idx);
    }, false);
  }

  function fill(ary, value) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ary.length;

    for (var i = start; i < end; i++) {
      ary[i] = value;
    }

    return ary;
  }

  function reverse(ary) {
    var left = 0,
        right = ary.length - 1;

    while (left < right) {
      var temp = ary[left];
      ary[left] = ary[right];
      ary[right] = temp;
      left++;
      right--;
    }

    return ary;
  }

  function keys(obj) {
    var dealed = new Object(obj);
    var res = [];

    for (var k in dealed) {
      if (obj.hasOwnProperty(k)) res.push(k);
    }

    return res;
  }

  function values(obj) {
    var dealed = new Object(obj);
    var res = [];

    for (var k in dealed) {
      if (dealed.hasOwnProperty(k)) {
        res.push(dealed[k]);
      }
    }

    return res;
  }

  function isEqual(a, b) {
    if (a === b) {
      return true;
    }

    var typea = _typeof(a);

    var typeb = _typeof(b);

    if (typea !== typeb) {
      //类型不同
      return false;
    } else {
      //类型相同,同为obj
      if (typea === 'object') {
        //数组、对象
        if (Array.isArray(a) + Array.isArray(b) == 1) {
          //一个数组一个不是数组
          return false;
        }

        if (Array.isArray(a)) {
          //两个数组
          if (a.length !== b.length) {
            return false;
          }
        } else {
          //两个对象
          if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
          }
        }

        for (var key in a) {
          if (!(key in b)) {
            return false;
          }

          if (!isEqual(a[key], b[key])) {
            return false;
          }
        }

        return true;
      } else {
        return a === b;
      }
    }
  }

  function toArray(value) {
    var res = [],
        type = _typeof(value);

    if (type === 'object') {
      for (var k in value) {
        res.push(value[k]);
      }
    } else if (type === 'string') {
      for (var i = 0; i < value.length; i++) {
        res.push(value[i]);
      }
    }

    return res;
  }

  function sum(ary) {
    var res = 0;

    for (var i = 0; i < ary.length; i++) {
      res += ary[i];
    }

    return res;
  }

  function sum2(ary) {
    return ary.reduce(function (res, item) {
      return res + item;
    });
  } //根据谓词求和，谓词用来计算每项的值，或是在对象里作为属性传属性值


  function sumBy(ary, predicate) {
    if (typeof predicate === 'function') {
      return ary.reduce(function (res, item, idx) {
        return res + predicate(item, idx);
      }, 0); //必须从0开始
    } else {
      return ary.reduce(function (res, item) {
        return res + item[predicate];
      }, 0);
    }
  }

  function sumBy2(ary, predicate) {
    var res = 0;

    for (var i = 0; i < ary.length; i++) {
      if (typeof predicate === 'function') {
        res += predicate(ary[i], i);
      } else {
        res += ary[i][predicate];
      }
    }

    return res;
  } //存疑  全局isNaN(undefined)=true，Number.isNaN(undefined)=false,
  // 全局 isNaN(new Number(NaN))=true  Number.isNaN(new Number(NaN)) = false 


  function isNaN(val) {
    if (val !== val) {
      return true;
    }

    if (Number.isNaN(val)) {
      return true;
    }

    if (_typeof(val) === 'object') {
      return true;
    }

    return false;
  }

  function isNull(val) {
    if (val === null) {
      return true;
    }

    return false;
  }

  function isNil(val) {
    if (val === null || val === undefined) {
      return true;
    }

    return false;
  }

  function isUndefined(val) {
    if (val === undefined) return true;
    return false;
  } //随机打乱顺序


  function shuffle(collection) {
    var res;

    if (Array.isArray(collection)) {
      res = [];
      var count = collection.length;

      for (var i = 0; i <= count; i++) {
        res = res.concat(collection.splice(Math.floor(Math.random() * collection.length), 1));
      }
    } else {//对象乱序，对象好像没法乱序
    }

    return res;
  } // 根据谓词计数，谓词可以是函数也可以是属性


  function countBy(collection, predicate) {
    if (typeof predicate === 'function') {
      return collection.reduce(function (res, item, idx) {
        var key = predicate(item, idx);

        if (!(key in res)) {
          res[key] = 1;
        } else {
          res[key] += 1;
        }

        return res;
      }, {});
    } else {
      //把predicate当做一个属性看待
      return collection.reduce(function (res, item, idx) {
        var key = item[predicate];

        if (!(key in res)) {
          res[key] = 1;
        } else {
          res[key] += 1;
        }

        return res;
      }, {});
    }
  } //创建一个数组，以谓词处理的结果升序排列。需要稳定排序。collection可以是Array|Object一个可迭代的集合。predicate谓词是函数。


  function sortBy(collection, predicate) {
    var res = [];

    if (!collection) {
      return [];
    } //插入排序是稳定的


    if (Array.isArray(collection)) {
      for (var i = 1; i < collection.length; i++) {
        var t = collection[i];
        var temp = predicate(collection[i], i);

        for (var j = i - 1; j >= 0; j--) {
          if (predicate(collection[j]) > temp) {
            collection[j + 1] = collection[j];
          } else {
            break;
          }
        }

        collection[j + 1] = t;
      } //排好序了，按照特定格式输出


      for (var _i3 = 0; _i3 < collection.length; _i3++) {
        var _temp = [];

        for (var k in collection[_i3]) {
          _temp.push(collection[_i3][k]);
        }

        res.push(_temp);
      }
    }

    return res;
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
    sumBy: sumBy
  };
}();