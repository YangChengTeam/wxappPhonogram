const debug = true
const host = {
	dev: "https://tic.upkao.com",  //测试服务器
	pro: ""   //正式服务器
}

function getBaseUrl(){
    return (debug ? host.dev : host.pro) + '/Wxapp/index/'
}

function getUrl(str){
    return getBaseUrl() + str + "?app_id=6"
}

const api = {
	loginUrl : getUrl("login"),
	phoneticList : getUrl("phonetic_list"),
	phonetiClass: getUrl("phonetic_class")
}

export default api