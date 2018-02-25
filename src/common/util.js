import wepy from 'wepy'
import to from 'await-to-js'

import req from '../common/request.js'
import api from '../common/config.js'
import global from '../common/global.js'

export default {
	async login(){
         let [login_err, res] = await to(wepy.login())
         let [getUserInfo_err, userInfo] = await to(wepy.getUserInfo())
         if(userInfo){
            if(typeof userInfo.rawData === 'string'){
                userInfo.rawData = JSON.parse(userInfo.rawData)
            }
            global.userInfo = userInfo.rawData
            return await req.post(api.loginUrl, Object.assign({
            	 encryptedData: userInfo.encryptedData,
            	 iv: userInfo.iv
            }, userInfo.rawData))
         }
         return [{errMsg: 'login fail'}, null]
     }
}