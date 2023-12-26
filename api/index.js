import $http from '../js_sdk/zhouWei-request/requestConfig';
// {load:false} 是否出现加载框

// 推荐歌单
export const $personalized_list = (data) => $http.get('/personalized', data);
// 歌单 ( 网友精选碟 )
export const $top_playlist = (data) => $http.get('/top/playlist', data);
// 获取精品歌单
export const $top_playlist_highquality = (data) => $http.get('/top/playlist/highquality', data);
// 获取每日推荐歌单
export const $recommend_resource = (data) => $http.get('/recommend/resource', data);

// 获取歌单详情
export const $playlist_detail = (data) => $http.get('/playlist/detail', data);
// 获取歌单所有歌曲
export const $playlist_track_all = (data) => $http.get('/playlist/track/all', data);
// 相关歌单推荐
export const $related_playlist = (data) => $http.get('/related/playlist', data);
// 歌单评论
export const $comment_playlist = (data) => $http.get('/comment/playlist', data);
// 获取音乐 url - 新版
export const $song_url = (data) => $http.get('/song/url/v1', data);
