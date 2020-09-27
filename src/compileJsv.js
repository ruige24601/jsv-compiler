const compiler = require('./vue-pkg/compiler-sfc.cjs')
const { helperNameMap } = require('./vue-pkg/compiler-core.cjs')
const { parse, compileTemplate } = compiler


function compileJsv(source){
  let target = ''

  const parsed = parse(source)
  const {  ast: astAll, descriptor, errors } = parsed
  const { templates } = descriptor
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]
    const { code, map, errors: errors2, ast: astTempl } = compileTemplate({
      source: template.content,
      filename: 'App.jsfv',
      inMap: template.map,
      compilerOptions: {
        mode: 'function'
      }
    })

    let result = `(()=> {\n ${code} \n})()\n`
    // console.log(result)
    template.code = result

    astAll.helpers = new Set([...astAll.helpers, ...astTempl.helpers])
  }
  let i = 0
  astAll.children.forEach((node,index) => {
    if (node.tag !== 'template') {
      // 去掉 ` `
      let source = node.loc.source
      if(index === 0){
        source = source.replace(/`\s*?$/, '')
      } else if(index === astAll.children.length-1){
        source = source.replace(/^\s*?`/, '')
      } else {
        source = source.replace(/`\s*?$/, '')
        source = source.replace(/^\s*?`/, '')
      }
      target += source
    } else {
      target += templates[i++].code
    }
  })

  function genModulePreamble(ast) {
    // generate import statements for helpers
    if (ast.helpers.size) {
      return `import { ${[...ast.helpers]
        .map(s => `${helperNameMap[s]} as _${helperNameMap[s]}`)
        .join(', ')} } from 'vue'\n`
    }
    return ''
  }

  target = genModulePreamble(astAll) + target

  return {
    code : target,
    map: {}
  }
}

exports.compileJsv = compileJsv
