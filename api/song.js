import $http from '../js_sdk/zhouWei-request/requestConfig';
// {load:false} 是否出现加载框

// 对歌单添加或删除歌曲
export const $playlist_tracks = (data) => $http.get('/playlist/tracks', data);
// 获取歌曲详情
export const $song_detail = (data) => $http.get('/song/detail', data);
// 获取歌词
export const $lyric = (data) => $http.get('/lyric', data);
