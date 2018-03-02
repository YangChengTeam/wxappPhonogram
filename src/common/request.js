import wepy from 'wepy'
import to from 'await-to-js'  //npm install await-to-js --save
import md5 from 'md5'  // npm install md5 --save
import sha256 from 'sha256'  //npm install --save sha256

import global from '../common/global.js'

export default {	
	async get(url, params){
		let token = md5(url+global.session)
		let [err, data] = await to(wepy.request({
			url: url,
			method: 'GET',
			dataType: 'json',
			data: params,
			header: {
				Session: global.session,
			   	Token: md5(sha256(token))
			}
		}))
		if(this.checkSession(data,()=>{
			this.get(url, params)
		})){
			return [err, data]
		}
		
	},
	async post(url, params){
		let token = md5(url+JSON.stringify(params)+global.session)
		let [err, data] = await to(wepy.request({
			url: url,
			method: 'POST',
			data: params,
			dataType: 'json',
			header: {
				Session: global.session,
			   	Token: md5(sha256(token)),
			   	'content-type':'application/x-www-form-urlencoded'
			}
		}))
		if(this.checkSession(data, ()=>{
			this.post(url, params)
		})){
			return [err, data]
		}
	},
	 //检测session是否过期
	async checkSession(data, callback){
		 console.log(data)
		 if(data.data.code == -101){
		 	 let [loginErr, loginData] = await util.login()
       		 if(loginErr){
           		 return
       		 }
       		 if(loginData.data.code == "1"){
          		global.session = loginData.data.data.info.session
          		callback()
      		 }
      		 return false
		 }
		 return true
	}
}