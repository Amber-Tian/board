/**
 * created by meizhouxiaoluzi
 * **/

var cookieIsAble = navigator.cookieEnabled
import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import qs from 'qs'
import config from '@/api/config'
import store from '@/store'

const confirm = MessageBox.confirm
const myApp = {
  /**
   * 设置cookie的值，key为变量名，value为key对应的值,exdays为设置过期天数(最好是数字类型)
   * */
  setCookie: function (key, value, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = 'expires=' + d.toGMTString()
    if (typeof value == 'object') {
      document.cookie = key + '=' + JSON.stringify(value) + ''
      '' + expires
    } else {
      document.cookie = key + '=' + value + ''
      '' + expires
    }
  },

  /**
   * 获取cookie的值
   * */
  getCookie: function (key) {
    var name = key + '='
    var keyList = document.cookie.split(';')
    for (var i = 0; i < keyList.length; i++) {
      var c = keyList[i].trim()
      if (c.indexOf(name) == 0) {
        var re = c.substring(name.length, c.length)
        if (typeof re == 'object') {
          return JSON.parse(re)
        } else {
          return re
        }
      }
    }
  },

  /**
   * 删除cookie
   * */
  removeCookie: function (key) {
    myApp.setCookie(key, null, -1)
  },

  /**
   * 存储token
   * */
  setToken: function (token) {
    if (cookieIsAble) {
      localStorage.setItem('stfRoomToken', token)
    }

  },
  /**
   * 获取token的值
   * */
  getToken: function () {
    if (cookieIsAble) {
      return localStorage.getItem('stfRoomToken')
    }
  },

  /**
   * 移除token的值
   * */
  removeToken: function () {
    if (cookieIsAble) {
      localStorage.removeItem('stfRoomToken')
    }

  },
  /**
   * 存储数据（可以是字符串或者对象的格式）
   * key表示变量名，value是对应的值
   * */
  setData: function (key, value) {
    // key对应的值为空或者不存在
    if (!value) {
      return
    }
    // key对应的值为对象的格式
    else if (typeof value == 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }
  },

  /**
   * 获取存储的数据
   * 当获取的key对应的值为空时，使用默认值defaultData
   * */
  getData: function (key, defaultData) {
    var re
    try {
      re = localStorage.getItem(key)
      if (re) {
        return JSON.parse(re)
      } else {
        return defaultData
      }
    } catch (e) {
      return re
    }
  },

  /**
   * 移除存储的数据
   * */
  removeData: function (key) {
    localStorage.removeItem(key)
  },

  /**
   * post请求
   * url为服务器的地址,data为请求参数,contentType表示请求头格式
   * otherUrl 为其他的后台地址
   * */
  post: function (url, data, contentType, otherUrl,port,  responseType, offLineTurnUrl, timeoutSetting, succCallBack, errorCallBack) {
    // let formData = qs.stringify(data) //处理axios请求的参数问题（要导入qs库），下面注释也可以解决（但是要导入url-search-params-polyfill解决URLSearchParams兼容性的问题）
    // if (contentType) {
    let formData = data
    // }
    return myApp.ajax(url, formData, 'POST', contentType, otherUrl,port,  responseType, offLineTurnUrl, timeoutSetting, succCallBack, errorCallBack)
  },

  /**
   * get请求
   * url为服务器的地址,data为请求参数
   * */
  get: function (url, data, contentType, otherUrl,port,  responseType, offLineTurnUrl, timeoutSetting, succCallBack, errorCallBack) {
    var reqParam = ''
    for (var key in data) {
      reqParam += key + '=' + data[key] + '&'
    }
    reqParam = reqParam.substr(0, reqParam.length - 1)
    // reqParam += 'token=' + myApp.getToken();
    return myApp.ajax(port, url + '?' + reqParam, {}, 'GET', contentType, otherUrl, responseType, offLineTurnUrl, timeoutSetting, succCallBack, errorCallBack)
  },

  /**
   * get请求
   * url为服务器的地址,data为请求参数，method为请求方法,isLoad表示是否显示加载样式
   * otherUrl  为调产线等其他的地址
   * */
  ajax: function (url, data, method, contentType, otherUrl, port, responseType, offLineTurnUrl, timeoutSetting) {
    let finalContentType = 'application/json;charset=UTF-8'
    if (contentType) {
      finalContentType = contentType  //表单格式提交
    } 
    let headers = {
      'Content-Type': finalContentType,
      'Accept': finalContentType
    } 
    let finalServer = config.server;
    let finalPort = config.port

    if (otherUrl) {
      finalServer = otherUrl;
    } 
    if (port) {
      finalPort = port;
    }  
    return new Promise(function (resolve) {
      axios({
        // baseUrl: config.server,
        method: method,
        url: finalServer + finalPort + url,
        headers: headers,
        data: data
      }).then(function (req) {
        myApp.responseOperate(req.status, req, '', resolve, offLineTurnUrl)
      })
        .catch(function (error) {
          let param = {
            code: 'myError',
            message: error.message
          }
          if (error.response) {
            myApp.responseOperate(error.response.status, '', error, resolve, offLineTurnUrl)
          } else {
            myApp.alert(error.message)
          }
          resolve(param)  //主要是解决没有网或者连接后台失败的时候的加载样式
        })
    })
  },

  /**
   * 请求返回的结果进行处理
   * status:返回的状态码
   * req:返回的所有数据
   * error：  请求捕获的错误
   * resolve：返回成功时的回调
   * */
  responseOperate(status, req, error, resolve, offLineTurnUrl) {
    switch (status) {
      case 401:
        myApp.removeToken('token')
        window._this.$router.push({ path: '/login' })  //线下登录
        break
      case 403:
        myApp.alert('权限不足，禁止访问')
        break
      case 404:
        myApp.alert(error ? error.message : '404', 'error')
        break
      case 200:
        if (req && req != '') {
          if (req.data.code == -3) {
            myApp.removeToken('token')
            let finalResponseOperate = '/login'

            if (offLineTurnUrl) {
              finalResponseOperate = offLineTurnUrl
            }
            window._this.$router.push({ path: finalResponseOperate })  //线下登录
          } else if (req.data.code === 10001) {
            myApp.alert(req.data.message, 'error')
            localStorage.clear()
            // window.location.href= '/login';  //线下登录
          } else if (req.data.code == 500) {
            myApp.alert(req.data.message, 'error')
            resolve(req.data)
          } else {
            if (req.data.code == -1) {
              myApp.alert(req.data.message, 'error')
            }
            resolve(req.data)
          }
        }
        break
      default:
        var errorMessage = '未知错误'
        if (error) {
          errorMessage = error.message
        }
        myApp.alert(errorMessage)
        break
    }
  },

  /**
   * 显示提示信息
   * message(提示的内容),type（success,error,info等），method为请求方法
   * */
  alert(message, type, duration) {
    let defaultType = 'info'
    let defaultDuration = 2
    if (type) {
      defaultType = type
    }
    if (duration) {
      defaultDuration = duration
    }
    Message({
      showClose: true,
      message: message,
      type: defaultType,
      customClass: 'messageModal',
      duration: defaultDuration * 1000
    })
  },

  /**
   * 弹出是否删除的警告框
   * message(提示的内容),type(提示的图标),callback(返回点击了哪个按钮)
   * */
  alertDelete(message, type, success) {
    if (!type) {
      type = 'warning'
    }
    confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: type,
      callback: function (action, instance) {
        success(action, instance)
      }
    })
  },

  // 成功之后的加载样式（比如添加或者修改的时候出现加载样式，防止再次点击确定或者关闭按钮）
  loading() {
    const load = Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.4)'
    })
    return load
  },

  showEchartLoading() {
    return {
      text: 'loading...',
      maskColor: 'rgba(143,133,133,0.41)',
      color: '#fff',
      textColor: '#fff'
    }
  }

}
// new Set()方法可以去除重复的元素
// const value=new Set([42, 'foo', 42, 'foo', true, true]);
// const noRepeat=[...value];   //noRepeat的值为[42, 'foo', true]

// 通过操作对象的方式去重
// data.data.forEach((item) => {
//   allObject[item.goods_sku_id] = item; //集合转换成对象
// });
// }
//   data.data.forEach((item) => {
//     if (!allObject[item.goods_sku_id]) {
//       allObject[item.goods_sku_id] = item;
//     }
//   })

//  普通请求接口
// var xhr = new XMLHttpRequest();
// // xhr.open('post', host.lineServerUrl + maintain.ADD_LINE_CHANGERECORD + '/' + myApp.getToken().replace('Bearer ', ').split('.')[0], true);
// xhr.open('post', host.lineServerUrl + maintain.ADD_LINE_CHANGERECORD);
// xhr.send(params);
// xhr.onreadystatechange = function () {
//   // 这步为判断服务器是否正确响应
//   if (xhr.readyState == 4 && xhr.status == 200) {
//     const lineReq = JSON.parse(xhr.responseText);
//     if (lineReq.code == 0) {
//       _this.initTable();
//       _this.handleClosedAddOrEdit();
//       _this.addOrEditVisible = false;
//       myApp.alert('操作成功', 'success', 2);
//     }
//   }else{
//     myApp.alert('报错了，请联系管理员','error')
//   }
// };

export { myApp }
