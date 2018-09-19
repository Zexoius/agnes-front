import API from './public'

// 登录
export const userLogin = (params) => {
    return API.fetchPost('/manager/user/login ', params)
}

// 退出登录
export const userLogout = (params) => {
	return API.fetchGet('/manager/user/logout', params)
}

//用户信息
export const userInfo = (params) => {
	return API.fetchGet('/manager/user/checkLogin',params)
}

//推荐板块
export const recommend = (params) => {
	return API.fetchGet('/manager/goods/recommend',params)
}
