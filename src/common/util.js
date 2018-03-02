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
        let [_package, timeStamp] = ['' , '']
        let [err, data] = await to(req.get(`${api.payUrl}&goods_id=${parInfo.id}&goods_num=1`))
        console.log([err, data])
        // let randomNoceStr = this.randomNoceStr(16)
        // wepy.requestPayment({
        //     timeStamp: timeStamp,
        //     package: _package,
        //     nonceStr: randomNoceStr,
        //     signType: 'MD5',
        //     paySign: this.getPaySign(randomNoceStr, _package, timeStamp)
        // })
    },

    randomNoceStr(n){
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < n; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    getPaySign(randomNoceStr, _package, timeStamp){
        return md5(`appId=${global.appId}&nonceStr=${randomNoceStr}&package=${_package}&signType=MD5&timeStamp=${timeStamp}&key=${global.key}`)
    }


}