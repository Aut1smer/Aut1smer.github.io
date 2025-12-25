"use strict";

function Person(name) {
  this.name = name;
}

function fn1(x) {
  console.log(x.name);
  x.name = 'wangbadan';
  console.log(x.name);
}

var p = new Person('xiaoguisun');
console.log(p.name);
fn1(p);
console.log(p.name);