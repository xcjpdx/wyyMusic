<template>
	<navbar title="登录"></navbar>
	<!-- 登录 -->
	<div class="login-box" v-if="type == 0">
		<view class="title">欢迎登录！</view>
		<view class="text">现仅支持手机号登录</view>
		<view class="img">
			<image src="../../static/image/logo.png" mode="aspectFit" />
		</view>
		<div class="form-box">
			<div class="form-select">
				<div
					class="select-box"
					:class="{ 'select-box-active': loginType == 0 }"
					:style="{
						'margin-right': '20rpx',
					}"
					@click="loginType = 0"
					>密码登录</div
				>
				<div
					class="select-box"
					:class="{ 'select-box-active': loginType == 1 }"
					@click="loginType = 1"
					>验证码登录</div
				>
			</div>
			<div class="form-box-content">
				<up-input placeholder="请输入手机号" clearable v-model="phone">
					<template #suffix v-if="loginType == 1">
						<div class="get-code" v-if="changess" @click="getCode"> 获取验证码 </div>
						<div class="get-code" v-else>{{ second }}S后重试</div>
					</template>
				</up-input>
				<up-input
					placeholder="请输入密码"
					clearable
					password
					v-model="password"
					v-if="loginType == 0"
				></up-input>
				<up-input
					placeholder="请输入验证码"
					clearable
					v-model="code"
					v-if="loginType == 1"
				></up-input>
			</div>
		</div>
		<button class="btn" @click="login" v-if="check">登录</button>
		<button class="btn" @click="show = true" v-if="!check">登录</button>
		<view class="check" @click="check = !check">
			<view class="check-yes" v-if="check">
				<image src="../../static/image/loginSelect.png" mode="aspectFit" />
			</view>
			<view class="check-no" v-else></view>
			<view class="check-text1">我已阅读并同意</view>
			<view class="check-text2">《用户协议》</view>
			<view class="check-text1">和</view>
			<view class="check-text2">《服务条款》</view>
		</view>
	</div>
	<!-- 注册 -->
	<div class="resign-box" v-if="type == 1">
		<view class="title">欢迎注册</view>
		<view class="text">现仅支持手机号注册</view>
		<view class="img">
			<image src="../../static/image/logo.png" mode="aspectFit" />
		</view>
	</div>
	<!-- 忘记密码 -->
	<div class="forget-box" v-if="type == 2"></div>
	<div class="type-box">
		<text v-if="type != 0" @click="type = 0">已有账号?去登录</text>
		<text v-if="type != 1" @click="type = 1">没有账号?去注册</text>
		<text v-if="type != 2" @click="type = 2">忘记密码?</text>
	</div>
	<!-- 协议弹出层 -->
	<u-popup
		:show="show"
		@close="show = false"
		round="36"
		:customStyle="{
			padding: '30rpx',
		}"
	>
		<view class="popup-box">
			<view class="popup-box-title">用户协议和服务条款</view>
			<view class="popup-box-text"
				>在您使用网抑晕音乐前，您需要阅读井同意《用户协议》和《服务条款》，请您务必仔细阅读，充分理解条款内容后再同意</view
			>
			<view class="popup-box-btn">
				<view class="popup-box-btn1" @click="show = false">取消</view>
				<button class="popup-box-btn2" @click="agree">同意</button>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import navbar from '../../components/navbar.vue';
	import {
		$login_cellphone,
		$captcha_sent,
		$captcha_verify,
		$register_cellphone,
		$cellphone_existence_check,
		$nickname_check,
	} from '../../api/login';

	let type = ref(0); // 展示类型 0:登录 1:注册 2:忘记密码

	// 登录相关
	let loginType = ref(0); // 登录类型 0:密码登录 1:验证码登录
	let phone = ref(''); // 手机号
	let password = ref(''); // 密码
	let code = ref(''); // 验证码
	let second = ref(59); // 获取验证码时的倒计时数字
	let changess = ref(true); // 控制 获取验证码按钮 或 倒计时 的显示 true为获取验证码按钮 false为倒计时
	// 发送验证码
	async function getCode() {
		// 检查手机号
		if (!phone.value) {
			uni.showToast({ title: '请输入手机号', icon: 'none' });
			return;
		}
		if (
			!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
				phone.value
			)
		) {
			uni.showToast({ title: '手机号格式不正确', icon: 'none' });
			return;
		}
		try {
			await $captcha_sent({ phone: phone.value });
			uni.showToast({ title: '验证码已发送', icon: 'none' });
			changess.value = false;
			second.value = 59;
			var interval = setInterval(() => {
				--second.value;
			}, 1000);
			setTimeout(() => {
				clearInterval(interval);
				changess.value = true;
			}, 60000);
		} catch (error) {
			console.log(error);
		}
	}
	// 登录
	async function login() {
		if (!phone.value) {
			uni.showToast({ title: '请输入手机号', icon: 'none' });
			return;
		}
		switch (loginType.value) {
			case 0:
				// 密码登录
				if (!password.value) {
					uni.showToast({ title: '请输入密码', icon: 'none' });
					return;
				}
				break;
			case 1:
				// 验证码登录
				if (!code.value) {
					uni.showToast({ title: '请输入验证码', icon: 'none' });
					return;
				}
				break;
		}
		try {
			if (loginType.value == 1) {
				let res = await $captcha_verify({
					phone: phone.value,
					captcha: code.value,
				});
				if (res.code != 200) {
					uni.showToast({ title: res.message, icon: 'none' });
					return;
				}
			}
			let params = {
				phone: phone.value,
			};
			if (loginType.value == 0) {
				params.password = password.value;
			} else {
				params.captcha = code.value;
			}
			let res = await $login_cellphone(params);
			console.log(res);
			uni.setStorageSync('userInfo', res.profile);
			uni.setStorageSync('token', res.token);
			uni.setStorageSync('cookie', res.cookie);
			uni.showToast({
				title: '登录成功',
				icon: 'none',
				duration: 2000,
				complete: () => {
					uni.reLaunch({ url: '/pages/home/index' });
				},
			});
		} catch (error) {
			uni.showToast({ title: error.errMsg || error.message || error.msg, icon: 'none' });
		}
	}
	let check = ref(false); // 是否勾选协议
	let show = ref(false); // 协议弹窗 是否显示
	// 同意协议
	function agree() {
		check.value = true;
		show.value = false;
	}

	// 注册相关
</script>

<style lang="scss" scoped>
	.login-box {
		padding: 0 80rpx;
		.title {
			margin-top: 100rpx;
			@extend %c-box-center;
			font-size: 48rpx;
			font-weight: bold;
			color: #333333;
		}
		.text {
			margin-top: 30rpx;
			@extend %c-box-center;
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
		.img {
			width: 360rpx;
			height: 360rpx;
			margin: 0 auto;
			margin-top: 36rpx;
			border-radius: 20rpx;
			overflow: hidden;
			margin-bottom: 30rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.form-box {
			.form-select {
				@extend %c-box-center;
				.select-box {
					width: 200rpx;
					height: 80rpx;
					@extend %c-box-center;
					border-radius: 40rpx;
					font-size: 28rpx;
					font-weight: 500;
					background: #ccc;
				}
				.select-box-active {
					color: #ffffff;
					background: #e13027;
				}
			}
			.form-box-content {
				::v-deep {
					.u-input {
						margin: 20rpx 0;
					}
				}
				.get-code {
					padding: 10rpx;
					@extend %c-box-center;
					font-size: 28rpx;
					font-weight: 500;
					color: #fff;
					background: #e13027;
					border-radius: 15rpx;
				}
			}
		}
		.btn {
			background: #e13027;
			border-radius: 46rpx 46rpx 46rpx 46rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #ffffff;
			width: 80%;
		}
		.check {
			margin-top: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.check-yes,
			.check-no {
				width: 35rpx;
				height: 35rpx;
				border-radius: 18rpx;
				margin-right: 9rpx;
			}
			.check-yes {
				background: #e13027;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 18rpx;
					height: 14rpx;
				}
			}
			.check-no {
				background: #ffffff;
				border: 1rpx solid #a6a6a6;
			}
			.check-text1 {
				font-size: 24rpx;
				font-family: Source Han Sans SC;
				font-weight: 400;
				color: #a6a6a6;
				margin-right: 9rpx;
			}
			.check-text2 {
				font-size: 24rpx;
				font-family: Source Han Sans SC;
				font-weight: 400;
				color: #666666;
				margin-right: 9rpx;
			}
		}
	}
	.resign-box {
		padding: 0 80rpx;
		.title {
			margin-top: 100rpx;
			@extend %c-box-center;
			font-size: 48rpx;
			font-weight: bold;
			color: #333333;
		}
		.text {
			margin-top: 30rpx;
			@extend %c-box-center;
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
		.img {
			width: 360rpx;
			height: 360rpx;
			margin: 0 auto;
			margin-top: 36rpx;
			border-radius: 20rpx;
			overflow: hidden;
			margin-bottom: 30rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.forget-box {
		padding: 0 80rpx;
	}
	.type-box {
		padding: 0 80rpx;
		margin-top: 50rpx;
		@extend %c-box-space-center;
		font-size: 28rpx;
		font-weight: 700;
		color: #333333;
	}
	.popup-box {
		.popup-box-title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 30rpx;
		}
		.popup-box-text {
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			margin-bottom: 30rpx;
		}
		.popup-box-btn {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.popup-box-btn1,
			.popup-box-btn2 {
				width: 45%;
				height: 80rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #ffffff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.popup-box-btn1 {
				background: #a6a6a6;
			}
			.popup-box-btn2 {
				background: #e13027;
			}
		}
	}
</style>
