import $http from '../js_sdk/zhouWei-request/requestConfig';

// 热搜列表(详细)
export const $search_hot_detail = (data) => $http.get('/search/hot/detail', data);
// 搜索建议
export const $search_suggest = (data) => $http.get('/search/suggest', data);
// 搜索
export const $cloudsearch = (data) => $http.get('/cloudsearch', data);
// 所有榜单
export const $toplist = (data) => $http.get('/toplist', data);
