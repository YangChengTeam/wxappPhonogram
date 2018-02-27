import wepy from 'wepy'
import to from 'await-to-js'  //npm install await-to-js --save
import md5 from 'md5'  // npm install md5 --save
import sha256 from 'sha256'  //npm install --save sha256

import global from '../common/global.js'

export default {	
	async get(url, params){
		let token = md5(url+global.session)
		return await to(wepy.request({
			url: url,
			method: 'GET',
			dataType: 'json',
			data: params,
			header: {
				Session: global.session,
			   	Token: md5(sha256(token))
			}
		}))
	},

	async post(url, params){
		let token = md5(url+JSON.stringify(params)+global.session)
		return await to(wepy.request({
			url: url,
			method: 'POST',
			data: params,
			dataType: 'json',
			header: {
				Session: global.session,
			   	Token: md5(sha256(token))
			}
		}))
	}
}