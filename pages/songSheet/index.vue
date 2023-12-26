<template>
	<div class="page_box">
		<navbar title="歌单" :type="2" bgColor="transparent" color="#fff"></navbar>
		<div class="bgi">
			<image :src="info.coverImgUrl" mode="aspectFill" />
		</div>
		<div class="content_box">
			<div class="top-box">
				<div class="up-down" @click="status = !status">
					<u-icon name="arrow-up" color="#fff" size="24" v-if="status"></u-icon>
					<u-icon name="arrow-down" color="#fff" size="24" v-else></u-icon>
				</div>
				<template v-if="status">
					<div class="relatedPlay-box">
						<div class="relatedPlat-title">喜欢这个歌单的用户也听了</div>
						<scroll-view class="scroll-view" scroll-x="true" enable-flex>
							<view
								class="scroll-item"
								v-for="item in relatedPlaylist"
								@click="goSongSheet(item.id)"
							>
								<image :src="item.coverImgUrl" mode="" />
								<text>{{ item.name }}</text>
							</view>
						</scroll-view>
					</div>
				</template>
				<template v-else>
					<div class="top-box-info">
						<div class="info-left">
							<image :src="info.coverImgUrl" mode="aspectFill" />
							<div class="info-bf">
								<image src="../../static/image/songSheet/bf1.png" mode="aspectFill" />
								<text>{{ getNumText(info.playCount) }}</text>
							</div>
						</div>
						<div class="info-right">
							<div class="right-name">{{ info.name }}</div>
							<div class="right-box" v-if="info.creator">
								<image :src="info.creator.avatarUrl" mode="aspectFill" />
								<text>{{ info.creator.nickname }}</text>
							</div>
							<div class="right-tags" v-if="info.tags && info.tags.length">
								<div class="tags-item" v-for="tag in info.tags">{{ tag }}</div>
							</div>
						</div>
					</div>
				</template>
			</div>
			<div class="description">{{ info.description }}</div>
			<div class="btn-box">
				<div class="btn-item">
					<image src="../../static/image/songSheet/fx.png" mode="aspectFill" />
					{{ getNumText(info.commentCount) }}</div
				>
				<div class="btn-item">
					<image src="../../static/image/songSheet/pl.png" mode="aspectFill" />
					{{ getNumText(info.shareCount) }}</div
				>
				<div class="btn-item" style="background: #da0019" @click="collectPlaylists">
					<image
						v-if="info.subscribed"
						src="../../static/image/songSheet/ydy.png"
						mode="aspectFill"
					/>
					<image v-else src="../../static/image/songSheet/dy.png" mode="aspectFill" />
					{{ getNumText(info.subscribedCount) }}</div
				>
			</div>
			<div class="play-box" @click="clickPlayAll">
				<image src="../../static/image/songSheet/bf2.png" mode="aspectFill" />
				播放全部
				<text
					>( 共{{ info.trackCount }}首{{
						info.trackCount > 100 ? ',由于某些问题仅展示前100首' : ''
					}}
					)</text
				>
			</div>
			<div class="play-list">
				<div class="list-item" v-for="(song, songIndex) in info.tracks" @click="clickPlay(song)">
					<div class="item-left">
						<div class="item-index">{{ songIndex + 1 }}</div>
						<div class="item-box">
							<div class="box-name">{{ song.name }}</div>
							<div class="box-author">
								{{ song.arText }}
								-
								{{ song.al.name }}
							</div>
						</div>
					</div>
					<image src="/static/image/songSheet/bf3.png" mode="aspectFill" class="item-bf" />
				</div>
			</div>
		</div>
		<playBox v-if="songStore.song.id"></playBox>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { $playlist_detail, $related_playlist } from '../../api/index';
	import { $playlist_subscribe } from '../../api/user';
	import navbar from '../../components/navbar.vue';
	import playBox from '../../components/playBox.vue';
	import { useSongStore } from '../../store/song';
	let songStore = useSongStore();

	onLoad((res) => {
		id.value = res.id;
		getData();
		getRelatedPlaylist();
	});
	let id = ref('');

	// 根据数量返回文字
	function getNumText(num) {
		if (num > 99999999) {
			return Math.floor(num / 100000000) + '亿';
		} else if (num > 9999999) {
			return Math.floor(num / 10000000) + '千万';
		} else if (num > 999999) {
			return Math.floor(num / 1000000) + '百万';
		} else if (num > 99999) {
			return Math.floor(num / 10000) + '万';
		} else if (num > 9999) {
			return Math.floor(num / 1000) + '万';
		} else {
			return num;
		}
	}

	// 歌单信息
	let info = ref({});
	async function getData() {
		try {
			let res = await $playlist_detail({ id: id.value });
			info.value = res.playlist;
			info.value.tracks = res.playlist.tracks.slice(0, 100);
			info.value.tracks.forEach((item) => {
				item.arText = [];
				for (let i = 0; i < item.ar.length; i++) {
					item.arText.push(item.ar[i].name);
				}
				item.arText = item.arText.join('/');
			});
		} catch (error) {
			console.log(error);
		}
	}

	// 收藏歌单/取消收藏歌单
	async function collectPlaylists() {
		try {
			let res = await $playlist_subscribe({
				id: id.value,
				t: info.value.subscribed ? 2 : 1,
			});
			uni.showToast({
				title: info.value.subscribed ? '已取消收藏' : '收藏成功',
				icon: 'none',
			});
			info.value.subscribed = !info.value.subscribed;
		} catch (error) {
			console.log(error);
		}
	}

	// 相关歌单推荐
	let status = ref(false); // 下拉按钮状态
	let relatedPlaylist = ref([]);
	async function getRelatedPlaylist() {
		try {
			let res = await $related_playlist({ id: id.value });
			relatedPlaylist.value = res.playlists;
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

	// 点击播放
	function clickPlay(song) {
		if (song.id == songStore.song.id) {
			return;
		}
		songStore.changeSong(song);
		songStore.changeSongList(info.value.tracks);
		// uni.navigateTo({
		// 	url: '/pages/songDetail/index',
		// });
	}
	// 点击播放全部
	function clickPlayAll() {
		songStore.changeSong(info.value.tracks[0]);
		songStore.changeSongList(info.value.tracks);
		// uni.navigateTo({
		// 	url: '/pages/songDetail/index',
		// });
	}
</script>

<style lang="scss" scoped>
	.page_box {
		justify-content: flex-start;
		.bgi {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			// 设置滤镜模糊
			filter: blur(150px);
			overflow: hidden;
			transform: scale(4);
			image {
				width: 100%;
				height: 100%;
			}
		}
		.content_box {
			position: relative;
			padding-bottom: 100rpx;
			.top-box {
				padding: 30rpx;
				padding-right: 80rpx;
				position: relative;
				.up-down {
					position: absolute;
					right: 20rpx;
					top: 40rpx;
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.2);
					@extend %c-box-center;
				}
				.relatedPlay-box {
					overflow: hidden;
					.relatedPlat-title {
						font-size: 26rpx;
						color: #fff;
						margin-bottom: 20rpx;
					}
					.scroll-view {
						display: flex;
						height: 250rpx;
						.scroll-item {
							margin-right: 15rpx;
							min-width: 200rpx;
							max-width: 200rpx;
							height: 250rpx;
							image {
								width: 100%;
								height: 70%;
								margin-bottom: 5rpx;
								border-radius: 20rpx;
								overflow: hidden;
							}
							text {
								font-size: 22rpx;
								color: #fff;
								@include feed(2);
							}
						}
					}
				}
				.top-box-info {
					display: flex;
					.info-left {
						width: 270rpx;
						height: 270rpx;
						position: relative;
						margin-right: 20rpx;
						border-radius: 20rpx;
						overflow: hidden;
						image {
							width: 100%;
							height: 100%;
						}
						.info-bf {
							position: absolute;
							top: 5rpx;
							right: 10rpx;
							display: flex;
							align-items: center;
							image {
								width: 20rpx;
								height: 20rpx;
								margin-right: 5rpx;
							}
							text {
								font-size: 22rpx;
								color: #fff;
								font-weight: 700;
							}
						}
					}
					.info-right {
						flex: 1;
						padding-top: 10rpx;
						.right-name {
							margin-bottom: 30rpx;
							font-size: 26rpx;
							font-weight: 700;
							color: #fff;
						}
						.right-box {
							display: flex;
							align-items: center;
							margin-bottom: 30rpx;
							image {
								margin-right: 10rpx;
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
							}
							text {
								font-size: 24rpx;
								color: #fff;
								@include feed(1);
							}
						}
						.right-tags {
							display: flex;
							flex-wrap: wrap;
							.tags-item {
								margin: 0 10rpx 10rpx 0;
								background: rgba(255, 255, 255, 0.2);
								font-size: 20rpx;
								color: #fff;
								padding: 10rpx;
								@extend %c-box-center;
								border-radius: 10rpx;
							}
						}
					}
				}
			}
			.description {
				padding: 0 30rpx;
				margin-bottom: 20rpx;
				font-size: 26rpx;
				color: #fff;
				@include feed(2);
			}
			.btn-box {
				padding: 0 30rpx;
				@extend %c-box-space-center;
				margin-bottom: 20rpx;
				.btn-item {
					@extend %c-box-center;
					width: 30%;
					padding: 30rpx 0;
					background: rgba(255, 255, 255, 0.2);
					border-radius: 50rpx;
					image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 10rpx;
					}
					font-size: 28rpx;
					color: #fff;
				}
			}
			.play-box {
				position: sticky;
				top: 0;
				border-radius: 32rpx 32rpx 0rpx 0rpx;
				background: #fff;
				padding: 30rpx;
				display: flex;
				align-items: center;
				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
				}
				font-size: 30rpx;
				text {
					margin-left: 10rpx;
					font-size: 30rpx;
					color: #ccc;
				}
			}
			.play-list {
				flex: 1;
				background: #fff;
				padding: 30rpx;
				.list-item {
					@extend %c-box-space-center;
					margin-bottom: 30rpx;
					.item-left {
						flex: 1;
						display: flex;
						align-items: center;
						.item-index {
							width: 65rpx;
							font-size: 34rpx;
							color: #ccc;
						}
						.item-box {
							flex: 1;
							.box-name {
								margin-bottom: 10rpx;
								@include feed(1);
								font-size: 34rpx;
							}
							.box-author {
								@include feed(1);
								font-size: 28rpx;
							}
						}
					}
					.item-bf {
						width: 40rpx;
						height: 40rpx;
						margin-left: 50rpx;
					}
				}
			}
		}
	}
</style>
