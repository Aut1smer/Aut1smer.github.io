"use strict";

var aut1sm = function () {
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
      } else if (predicate == 'length') {
        key = ary[i].length;
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
  };
}();