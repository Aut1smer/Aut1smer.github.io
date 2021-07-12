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
    var len = ary.length;

    for (var i = 0; i < len; i++) {
      if (action(ary[i], i) === false) {
        break;
      }
    }
  }

  function map(ary, mapper) {
    var res = [];

    for (var i = 0; i < ary.length; i++) {
      res.push(mapper(ary[i], i));
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

    for (var i = startIdx; i < ary.length; i++) {
      initial = reducer(initial, ary[i], i);
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

    for (var _i = 0; _i < maxLength; _i++) {
      var temp = [];

      for (var j = 0; j < args.length; j++) {
        if (typeof args[j][_i] !== 'undefined') {
          temp.push(args[j][_i]);
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
  }

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