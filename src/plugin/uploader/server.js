const http = require('http')
var qiniu = require('qiniu')

const hostname = '127.0.0.1'
const port = 8899

const server = http.createServer((req, res) => {
  var accessKey = 'int8BqAJUi3OMzVyAtJsSTKoBnKhZqwkY1at0rIz'
  var secretKey = 'QpQtmBOysu4cb7l8yexbTf_ErRlTuPOoc8cj98HE'
  var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

  var options = {
    scope: 'test',
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  }
  var putPolicy = new qiniu.rs.PutPolicy(options)
  var uploadToken = putPolicy.uploadToken(mac)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end(uploadToken)
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
