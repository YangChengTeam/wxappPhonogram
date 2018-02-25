const debug = true
const host = {
	dev: "",  //测试服务器
	pro: ""   //正式服务器
}

function getHost(){
    return debug ? host.dev : host.pro
}

function getUrl(str){
    return getHost() + str
}

const api = {
	loginUrl : getUrl("login")
}

export default api