const {compileJsv} = require('../dist/jsv-compiler.cjs')

let Counter = `<template><h1>{{count}}</h1><button @click="handleClick"></button></template>`

const {code} = compileJsv(Counter)
console.log(code);
