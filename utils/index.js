// 获取图片地址
export const getImg = function (path) {
	return '/static/imgs/' + path;
};
let innerAudioContext;

export const createPlayer = () => {
	return (innerAudioContext = uni.createInnerAudioContext());
};

export const getPlayer = () => innerAudioContext;
