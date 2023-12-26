import $http from '../js_sdk/zhouWei-request/requestConfig';
// {load:false} 是否出现加载框

// 获取用户歌单
export const $user_playlist = (data) => $http.get('/user/playlist', data);
// 收藏/取消收藏歌单
export const $playlist_subscribe = (data) => $http.get('/playlist/subscribe', data);
