import API from './public'


//首页
export const goodsHome = (params) => {
	return API.fetchGet('/manager/goods/home',params)
}
//所有商品
export const getAllGoods = (params) => {
	return API.fetchGet('/manager/goods/getAllGoods',params)
}
//获取购物车
export const getCartList = (params) => {
	return API.fetchPost('/manager/cart/cartList',params,{'contentType':'application/json'})
}
export const cartDel = (params) => {
	return API.fetchPost('/manager/cart/cartDel',params)
}
//商品详情
 export const goodsDetail = (params) => {
	 return API.fetchGet('/manager/goods/goodsDetail',params)
 }

//加入购物车
export const addCart = (params) => {
	return API.fetchPost('/manager/cart/addCart',params)
}
