import * as qiniu from 'qiniu-js'
import request from '@/plugin/axios'

const uploader = {}

uploader.config = function (callback) {
  var config = {
    useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
    disableStatisticsReport: false, // 是否禁用日志报告，为布尔值，默认为false。
    region: qiniu.region.z0, // 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
    // qiniu.region.z0: 代表华东区域
    // qiniu.region.z1: 代表华北区域
    // qiniu.region.z2: 代表华南区域
    // qiniu.region.na0: 代表北美区域
    // qiniu.region.as0: 代表东南亚区域
    retryCount: 3, // 上传自动重试次数（整体重试次数，而不是某个分片的重试次数）；默认 3 次（即上传失败后最多重试两次）；目前仅在上传过程中产生 599 内部错误时生效，但是未来很可能会扩展为支持更多的情况。
    concurrentRequestLimit: 3, // 分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
    checkByMD5: false // 是否开启 MD5 校验，为布尔值；在断点续传时，开启 MD5 校验会将已上传的分片与当前分片进行 MD5 值比对，若不一致，则重传该分片，避免使用错误的分片。读取分片内容并计算 MD5 需要花费一定的时间，因此会稍微增加断点续传时的耗时，默认为 false，不开启。
  }
  var putExtra = {
    fname: '', // string，文件原文件名
    params: {
      'x:name': ''
    }, // object，用来放置自定义变量
    mimeType: null // null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里：["image/png", "image/jpeg", "image/gif"]
  }

  return {
    config,
    putExtra
  }
}

uploader.uptoken = function (file, callback) {
  request({
    url: 'http://127.0.0.1:8899/uptoken',
    method: 'get',
    data: file.name
  })
    .then(res => {
      // 返回数据
      callback(res)
    })
    .catch(err => {
      // 异常情况
      console.log(err)
    })
}

// H5上传
uploader.uploadWithSDK = function (file, autoStart, handler = {}) {
  var self = this
  const {
    config,
    putExtra
  } = this.config()

  if (file) {
    var key = '/sjjx/resource/' + new Date().getTime() + '/' + file.name
    putExtra.params['x:name'] = key.split('.')[0]

    // 设置next,error,complete对应的操作，分别处理相应的进度信息，错误信息，以及完成后的操作
    var next = handler.next || function (res) {
      console.log(res)
    }
    var error = handler.error || function (err) {
      console.log(err)
    }
    var complete = handler.complete || function (res) {
      console.log(res)
    }

    var subObject = {
      next: next,
      error: error,
      complete: complete
    }

    self.uptoken(file, function (res) {
      var token = res
      // 调用sdk上传接口获得相应的observable，控制上传和暂停
      var observable = qiniu.upload(file, key, token, putExtra, config)

      if (autoStart) {
        return observable.subscribe(subObject)
      } else {
        var subscription
        return {
          start: function () {
            subscription = observable.subscribe(subObject)
          },
          pause: function () {
            if (subscription) {
              subscription.unsubscribe()
            }
          }
        }
      }
    })
  }
}

// 低版本浏览器上传
uploader.uploadWithPlupload = function (token, putExtra, config, domain) {}

export default uploader
