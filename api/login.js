import $http from '../js_sdk/zhouWei-request/requestConfig';
// {load:false} 是否出现加载框

// 手机登录
export const $login_cellphone = (data) => $http.get('/login/cellphone', data);
// 发送验证码
export const $captcha_sent = (data) => $http.get('/captcha/sent', data);
// 验证验证码
export const $captcha_verify = (data) => $http.get('/captcha/verify', data);
// 退出登录
export const $logout = (data) => $http.get('/logout', data);

// 注册(修改密码)
export const $register_cellphone = (data) => $http.get('/register/cellphone', data);
// 检测手机号码是否已注册
export const $cellphone_existence_check = (data) => $http.get('/cellphone/existence/check', data);
// 重复昵称检测
export const $nickname_check = (data) => $http.get('/nickname/check', data);
