const debug = false 
const host = {
	dev: "https://tic.upkao.com",  //测试服务器
	pro: "https://tic.upkao.com"   //正式服务器
}

function getBaseUrl(){
    return (debug ? host.dev : host.pro) + '/Wxapp/index/'
}

function getUrl(str){
    return getBaseUrl() + str + "?app_id=5"
}

const api = {
	loginUrl : getUrl("init"),
	phoneticList : getUrl("phonetic_list"),
	phonetiClass: getUrl("phonetic_class"),
	vipList: getUrl("vip_list"),
	payUrl: getUrl("pay"),
	updateUserUrl: getUrl("user_edit"),
	superVip: false
}



export default api