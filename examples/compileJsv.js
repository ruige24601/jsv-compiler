// import { baseCompile as compile, CompilerOptions } from '@vue/compiler-core'
import * as compiler from '@vue/compiler-dom'

export function compileJsv(source, options) {
  let code = source.replace(/(?!`\s*)?<template>(.*?)<\/template>(?!\s*`)?/g, ($0,$1)=>{
    const {code, map} = compileJsvItem($1,options)
    return code
  })
  code = `import * as Vue from 'vue';\n${code}`
  return {code, map:{}}
}

function compileJsvItem(source, options) {

  let { code, map } = compiler.compile(source, {
    sourceMap: false,
    filename: `foo.vue`,
    prefixIdentifiers: true,
    mode:'function',
    ...options
  })

  // 1. 兼容 ctx.state.count
  code = code.replace(
    /\b_ctx\.([a-zA-Z_$0-9]+)(?![a-zA-Z_$0-9])?/g,
    ($0, $1) => {
      return `(()=>{
      try{
        return ${$1}
      }catch{
        return ${$0}
      }
    })()`
    }
  )

  // 2. 兼容 _resolveComponent("Title")
  code = code.replace(/\b_resolveComponent\("([^"]+)"\)/g, ($0, $1) => {
    return `(()=>{
        try {
          return ${$1};
        } catch {
          return ${$0};
        }
      }) ()
      `
  })

  code = `(()=> {\n ${code} \n})()\n`
  return {code, map}

  // const parsed = parse(source)
  // const { ast: astAll, descriptor, errors } = parsed
  // const { templates } = descriptor
  // for (let i = 0; i < templates.length; i++) {
  //   const template = templates[i]
  //   const { code, map, errors: errors2, ast: astTempl } = compileTemplate({
  //     source: template.content,
  //     filename: 'App.jsfv',
  //     inMap: template.map,
  //     compilerOptions: {
  //       mode: 'function'
  //     }
  //   })

  //   let result = `(()=> {\n ${code} \n})()\n`
  //   // console.log(result)
  //   template.code = result

  //   astAll.helpers = new Set([...astAll.helpers, ...astTempl.helpers])
  // }
  // let i = 0
  // astAll.children.forEach((node, index) => {
  //   if (node.tag !== 'template') {
  //     // 去掉 ` `
  //     let source = node.loc.source
  //     if (index === 0) {
  //       source = source.replace(/`\s*?$/, '')
  //     } else if (index === astAll.children.length - 1) {
  //       source = source.replace(/^\s*?`/, '')
  //     } else {
  //       source = source.replace(/`\s*?$/, '')
  //       source = source.replace(/^\s*?`/, '')
  //     }
  //     target += source
  //   } else {
  //     target += templates[i++].code
  //   }
  // })

  // function genModulePreamble(ast) {
  //   // generate import statements for helpers
  //   if (ast.helpers.size) {
  //     return `import { ${[...ast.helpers]
  //       .map(s => `${helperNameMap[s]} as _${helperNameMap[s]}`)
  //       .join(', ')} } from 'vue'\n`
  //   }
  //   return ''
  // }

  // target = genModulePreamble(astAll) + target

  // return {
  //   code: target,
  //   map: {}
  // }
}

// exports.compileJsv = compileJsv
