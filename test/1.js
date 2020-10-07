let source = ' <template><div>hello</div></template>   a <template><div>hello2</div></template>'

let target = source.matchAll(/(?!`\s*)?<template>(.*?)<\/template>(?!\s*`)?/g)
console.log(...target);
