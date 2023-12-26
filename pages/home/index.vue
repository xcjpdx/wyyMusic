<template>
	<div class="page_box">
		<div class="searvh-box">
			<u-search
				v-model="searchWord"
				:showAction="false"
				:clearabled="false"
				bgColor="#eee"
				height="70"
				disabled
				searchIconSize="30"
				@click="searchClick"
			></u-search>
		</div>
		<div class="content_box">
			<div class="recommended-playlists-box" v-if="recommendResource.length">
				<div class="recommended-playlists-title">每日推荐歌单</div>
				<scroll-view class="scroll-view" scroll-x="true" enable-flex>
					<view class="scroll-item" v-for="item in recommendResource" @click="goSongSheet(item.id)">
						<div class="img-box">
							<image :src="item.picUrl" mode="" />
							<div class="play-num">
								<image src="/static/image/erji.png" mode="" />
								{{ item.playCount }}
							</div>
							<div class="play">
								<image src="/static/image/play.png" mode="" />
							</div>
						</div>

						<div class="name">{{ item.name }}</div>
					</view>
				</scroll-view>
			</div>
			<div class="recommended-playlists-box">
				<div class="recommended-playlists-title">推荐歌单</div>
				<scroll-view class="scroll-view" scroll-x="true" enable-flex>
					<view class="scroll-item" v-for="item in recommandPlaylist" @click="goSongSheet(item.id)">
						<div class="img-box">
							<image :src="item.picUrl" mode="" />
							<div class="play-num">
								<image src="/static/image/erji.png" mode="" />
								{{ item.playCount }}
							</div>
							<div class="play">
								<image src="/static/image/play.png" mode="" />
							</div>
						</div>

						<div class="name">{{ item.name }}</div>
					</view>
				</scroll-view>
			</div>
			<div class="recommended-playlists-box">
				<div class="recommended-playlists-title">网友精选碟</div>
				<scroll-view class="scroll-view" scroll-x="true" enable-flex>
					<view class="scroll-item" v-for="item in topPlaylist" @click="goSongSheet(item.id)">
						<div class="img-box">
							<image :src="item.coverImgUrl" mode="" />
							<div class="play-num">
								<image src="/static/image/erji.png" mode="" />
								{{ item.playCount }}
							</div>
							<div class="play">
								<image src="/static/image/play.png" mode="" />
							</div>
						</div>

						<div class="name">{{ item.name }}</div>
					</view>
				</scroll-view>
			</div>
			<div class="recommended-playlists-box">
				<div class="recommended-playlists-title">精品歌单</div>
				<scroll-view class="scroll-view" scroll-x="true" enable-flex>
					<view
						class="scroll-item"
						v-for="item in topPlaylistHighQuality"
						@click="goSongSheet(item.id)"
					>
						<div class="img-box">
							<image :src="item.coverImgUrl" mode="" />
							<div class="play-num">
								<image src="/static/image/erji.png" mode="" />
								{{ item.playCount }}
							</div>
							<div class="play">
								<image src="/static/image/play.png" mode="" />
							</div>
						</div>

						<div class="name">{{ item.name }}</div>
					</view>
				</scroll-view>
			</div>
		</div>
		<playBox v-if="songStore.song.id"></playBox>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
	import {
		$personalized_list,
		$top_playlist,
		$top_playlist_highquality,
		$recommend_resource,
	} from '../../api/index.js';
	import { $search_hot_detail } from '../../api/search.js';
	import playBox from '../../components/playBox.vue';
	import { useSongStore } from '../../store/song';
	let songStore = useSongStore();

	let userInfo = uni.getStorageSync('userInfo');
	onMounted(() => {
		getRecommandPlaylist();
		getTopPlaylist();
		getTopPlaylistHighQuality();
		searchHotDetail();
		if (userInfo) {
			getRecommendResource();
		}
	});

	// 下拉刷新
	onPullDownRefresh(() => {
		clearInterval(time.value);
		getRecommandPlaylist();
		searchHotDetail();
		uni.stopPullDownRefresh();
	});

	let time = ref(null);

	// 搜索
	let searchWord = ref('');
	let searchHotList = ref([]);
	// 热搜列表
	async function searchHotDetail() {
		try {
			let res = await $search_hot_detail();
			searchHotList.value = res.data;
			searchWord.value = res.data[0].searchWord;
			time.value = setInterval(() => {
				switchSearchKeywords();
			}, 5000);
		} catch (error) {
			console.log(error);
		}
	}
	// 切换搜索关键词
	function switchSearchKeywords() {
		let index = searchHotList.value.findIndex((item) => item.searchWord == searchWord.value);
		if (index == searchHotList.value.length - 1) {
			searchWord.value = searchHotList.value[0].searchWord;
		} else {
			searchWord.value = searchHotList.value[index + 1].searchWord;
		}
	}

	// 点击搜索
	function searchClick() {
		uni.navigateTo({
			url: `/pages/search/index?searchWord=${searchWord.value}`,
		});
	}

	// 推荐歌单
	let recommandPlaylist = ref([]);
	async function getRecommandPlaylist() {
		try {
			let res = await $personalized_list({ limit: 10 });
			recommandPlaylist.value = res.result;
		} catch (error) {
			console.log(error);
		}
	}
	// 歌单 ( 网友精选碟 )
	let topPlaylist = ref([]);
	async function getTopPlaylist() {
		try {
			let res = await $top_playlist({ limit: 10 });
			topPlaylist.value = res.playlists;
		} catch (error) {
			console.log(error);
		}
	}
	// 精品歌单
	let topPlaylistHighQuality = ref([]);
	async function getTopPlaylistHighQuality() {
		try {
			let res = await $top_playlist_highquality({ limit: 10 });
			topPlaylistHighQuality.value = res.playlists;
		} catch (error) {
			console.log(error);
		}
	}
	// 每日推荐歌单
	let recommendResource = ref([]);
	async function getRecommendResource() {
		try {
			let res = await $recommend_resource();
			recommendResource.value = res.recommend;
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
		padding: 30rpx;
		padding-top: 10rpx;
		.searvh-box {
			margin-bottom: 40rpx;
		}
		.recommended-playlists-box {
			overflow: hidden;
			margin-bottom: 50rpx;
			.recommended-playlists-title {
				font-size: 36rpx;
				font-weight: 700;
				color: #000;
				margin-bottom: 10rpx;
			}
			.scroll-view {
				display: flex;
				height: 263rpx;
				.scroll-item {
					margin-right: 11rpx;
					min-width: 220rpx;
					max-width: 220rpx;
					height: 263rpx;
					background: #f5f5f5;
					.img-box {
						margin-bottom: 5rpx;
						border-radius: 20rpx;
						overflow: hidden;
						height: 70%;
						position: relative;
						image {
							width: 100%;
							height: 100%;
						}
						.play-num {
							position: absolute;
							top: 10rpx;
							left: 10rpx;
							display: flex;
							align-items: center;
							image {
								width: 20rpx;
								height: 20rpx;
								margin-right: 5rpx;
							}
							color: #fff;
							font-size: 20rpx;
							font-weight: 700;
						}
						.play {
							position: absolute;
							bottom: 10rpx;
							right: 10rpx;
							width: 40rpx;
							height: 40rpx;
							image {
								width: 100%;
								height: 100%;
							}
						}
					}
					.name {
						padding: 0 5rpx;
						font-size: 24rpx;
						@include feed(2);
					}
				}
			}
		}
	}
</style>
