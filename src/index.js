const { Readable } = require('stream');
const {compileJsv} = require('./compileJsv')

const jsvPlugin = ({ app, config, resolver }) => {
  app.use(async (ctx, next) => {

    await next()
    if (!/\.js(v)?/.test(ctx.path)) {
      return;
    }
    ctx.type = 'js'
    const src = await readBody(ctx.body)

    if (/<template/.test) {
      const { code, map } = compileJsv(src)
      ctx.body = code
    }

    // if (map) {
    //   ctx.map = JSON.parse(map)
    // }
  })
}

/**
 * Read already set body on a Koa context and normalize it into a string.
 * Useful in post-processing middlewares.
 */
async function readBody(
  stream
) {
  if (stream instanceof Readable) {
    return new Promise((resolve, reject) => {
      let res = ''
      stream
        .on('data', (chunk) => (res += chunk))
        .on('error', reject)
        .on('end', () => {
          resolve(res)
        })
    })
  } else {
    return !stream || typeof stream === 'string' ? stream : stream.toString()
  }
}


exports.jsvPlugin = jsvPlugin
exports.compileJsv = compileJsv
