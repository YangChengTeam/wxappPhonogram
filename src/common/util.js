import wepy from 'wepy'
import to from 'await-to-js'
import md5 from 'md5'  // npm install md5 --save

import req from '../common/request.js'
import api from '../common/config.js'
import global from '../common/global.js'

export default {

    async login2(){
       let [loginErr, loginData] = await req.login()
       if(loginErr){
           return false
       }
       if(loginData.data.code == "1" && loginData.data.data && loginData.data.data.info){
          global.session = loginData.data.data.info.session || ''
          global.vips =  loginData.data.data.vip || []
          return true
       }
       return false
    },

    async checkLogin(){
       if(global.session.length == 0){
           let [err, res] = await to(wepy.getSetting())
           if(res && res.authSetting["scope.userInfo"]){
               return -1  //已授权微信登录
           }
           return -2  //未授权微信登录
       }
       return 0
    },

    async authLogin(){
        let status = await this.checkLogin()
        if(status == 0){
            return true
        }
        else if(status == -2){
            let [err, res] = await to(wepy.openSetting())
            if(res  && res.authSetting["scope.userInfo"]){
                  return true
            }
            wepy.showModal({
                        title: '提示',
                        content: '未授权获取用户信息, 无法使用【支付功能】',
                        showCancel: false
                })
            return false
        }

        status = this.login2()
        if(!status){
            wepy.showModal({
                title: '提示',
                content: '登录失败',
                showCancel: false
            })
        }
        return status
    },


    async authRecord(){
        let [err, res] = await to(wepy.authorize({
            scope: 'scope.record'
        }))
        let [settingErr, settingRes] = await to(wepy.getSetting())

        if(settingRes && settingRes.authSetting["scope.record"]){
             return true
        }
        [settingErr, settingRes] = await to(wepy.openSetting())

        if(settingRes && settingRes.authSetting["scope.record"]){
             return true
        }
        wepy.showModal({
              title: '提示',
              content: '未授权录音功能, 无法使用【跟我读功能】',
              showCancel: false
        })
        return false
    },

    async pay(parInfo){
        let [err, res] = await req.get(`${api.payUrl}&goods_id=${parInfo.id}&goods_num=1`)
        if(res && res.data && res.data.code == 1){
            let randomNoceStr = res.data.data.info.nonce_str
            let _package = `prepay_id=${res.data.data.info.prepay_id}`
            let timeStamp = res.data.data.info.timeStamp
            let [payErr, payData] = await to(wepy.requestPayment({
                     timeStamp: timeStamp.toString(),
                     package: _package,
                     nonceStr: randomNoceStr,
                     signType: 'MD5',
                     paySign: this.getPaySign(randomNoceStr, _package, timeStamp)
            }))
            console.log([payErr, payData])
            return [payErr, payData]
        }
        let msg = '请求【支付参数】失败'
        if(err){
            msg = err.errMsg
        } else if(res && res.data){
            msg = res.data.msg
        }
        wepy.showToast({
              title: msg,
              icon: 'none'
        })
    },


    getPaySign(randomNoceStr, _package, timeStamp){
        return md5(`appId=${global.appId}&nonceStr=${randomNoceStr}&package=${_package}&signType=MD5&timeStamp=${timeStamp}&key=${global.key}`)
    }


}