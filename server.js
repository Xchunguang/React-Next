const express = require('express')
const next = require('next')
const LRUCache = require('lru-cache')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
})


app.prepare()
.then(() => {
  const server = express()

  // Use the `renderAndCache` utility defined below to serve pages
  server.get('/', (req, res) => {
    renderAndCache(req, res, '/')
  })




  server.get('/post/:id', (req, res) => {
    const queryParams = { id: req.params.id }
    renderAndCache(req, res, '/post', queryParams)
  })

  // 不适用缓存
  // server.get('/post/:id', (req, res) => {
  //   return app.render(req, res, '/post', {
  //     id: req.params.id
  //   })
  // })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})


/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey (req) {
  return `${req.url}`
}

function renderAndCache (req, res, pagePath, queryParams) {
  const key = getCacheKey(req)
  // 如果在缓存中存在页面，则直接从缓存中读取，目前不完善，不能判断出错
  if (ssrCache.has(key)) {
          console.log(`CACHE HIT: ${key}`)
          res.send(ssrCache.get(key))
          return    
  }

  // 如果缓存中没有页面，则直接返回页面，并将页面添加到缓存中
  app.renderToHTML(req, res, pagePath, queryParams)
    .then((html) => {
      // Let's cache this page
      console.log(`CACHE MISS: ${key}`)
      //将请求成功的页面添加进缓存
      if(res.statusCode === 200){
        ssrCache.set(key, html)
      }else{
        ssrCache.del(key);
      }
      
      // console.log(res.statusCode);
      res.send(html)
    })
    .catch((err) => {
      app.renderError(err, req, res, pagePath, queryParams)
    })
}