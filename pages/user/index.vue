<template>
	<div class="page_box">
		<navbar title="个人中心" bgColor="transparent" color="#fff" type="0"></navbar>
		<div class="bgi">
			<image :src="userInfo.backgroundUrl" mode="aspectFill"></image>
		</div>
		<div class="card user-box">
			<image :src="userInfo.avatarUrl" mode="aspectFill" class="user-avatar"></image>
			<div class="user-name">{{ userInfo.nickname }}</div>
		</div>
		<div class="card like-play-box" @click="goSongSheet(userLike.id)">
			<image :src="userLike.coverImgUrl" mode="aspectFill" class="like-img"></image>
			<div class="like-right">
				<div>我喜欢的音乐</div>
				<div>{{ userLike.trackCount }}首</div>
			</div>
		</div>
		<div class="card play-list-box">
			<div class="play-title">收藏歌单({{ userPlayList.length }}个)</div>
			<div class="play-item" v-for="item in userPlayList" @click="goSongSheet(item.id)">
				<image :src="item.coverImgUrl" mode="aspectFill" class="play-item-img" />
				<div class="play-item-right">
					<div class="play-item-name">{{ item.name }}</div>
					<div class="play-item-bottom">
						{{ item.trackCount }}
						首 , by
						{{ item.creator.nickname }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { $user_playlist } from '../../api/user';
	import navbar from '../../components/navbar.vue';

	let token = uni.getStorageSync('token');
	let userInfo = uni.getStorageSync('userInfo');
	onMounted(() => {
		if (!token) {
			uni.navigateTo({
				url: '/pages/login/index',
			});
		} else {
			getUserPlayList();
		}
	});

	// 获取用户歌单
	let userLike = ref({}); // 用户喜欢歌单
	let userPlayList = ref([]); // 用户歌单
	async function getUserPlayList() {
		try {
			let res = await $user_playlist({ uid: userInfo.userId });
			userLike.value = res.playlist[0];
			userPlayList.value = res.playlist.slice(1);
		} catch (error) {
			console.log(error);
		}
	}

	// 去歌单
	function goSongSheet(id) {
		uni.navigateTo({
			url: `/pages/songSheet/index?id=${id}`,
		});
	}
</script>

<style lang="scss" scoped>
	.page_box {
		height: 100vh;
		justify-content: flex-start;
		padding: 0 30rpx;
		.bgi {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.card {
			background: #fff;
			border-radius: 20rpx;
			padding: 50rpx 30rpx;
		}
		.user-box {
			margin-top: 100rpx;
			position: relative;
			height: 200rpx;
			@extend %c-box-center;
			.user-avatar {
				position: absolute;
				left: 50%;
				top: 0;
				transform: translate(-50%, -50%);
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.user-name {
				margin-top: 50rpx;
				font-size: 32rpx;
				color: #000;
				font-weight: 700;
				@extend %c-box-center;
			}
		}
		.like-play-box {
			margin-top: 50rpx;
			display: flex;
			align-items: center;
			.like-img {
				width: 80rpx;
				height: 80rpx;
				margin-right: 15rpx;
				border-radius: 15rpx;
			}
			.like-right {
				text:nth-child(1) {
					margin-bottom: 5rpx;
					font-size: 26rpx;
				}
				text:nth-child(2) {
					font-size: 22rpx;
					color: #ccc;
				}
			}
		}
		.play-list-box {
			margin-top: 50rpx;
			.play-title {
				margin-bottom: 20rpx;
				font-size: 26rpx;
				color: #ccc;
			}
			.play-item {
				display: flex;
				align-items: center;
				.play-item-img {
					width: 80rpx;
					height: 80rpx;
					margin-right: 15rpx;
					border-radius: 15rpx;
				}
				.play-item-right {
					flex: 1;
					.play-item-name {
						@include feed(1);
						font-size: 32rpx;
						margin-bottom: 6rpx;
					}
					.play-item-bottom {
						font-size: 28rpx;
						color: #ccc;
					}
				}
			}
		}
	}
</style>
