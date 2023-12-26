<template>
	<div class="page_box">
		<div class="searvh-box">
			<u-search
				placeholder="请输入歌曲名"
				v-model="searchWord"
				bgColor="#fff"
				height="70"
				searchIconSize="30"
				@search="search"
				@custom="search"
			></u-search>
		</div>
		<div class="content_box">
			<div class="history-box" v-if="historyList.length">
				<div class="history-title">
					<text>搜索历史</text>
					<u-icon name="trash" size="40" @click="deleteHistory"></u-icon>
				</div>
				<div class="history-list" :style="{ height: expandAndCollapse ? 'auto' : '30px' }">
					<div class="history-item" v-for="item in historyList" @click="goSeach(item.searchWord)">{{
						item.searchWord
					}}</div>
					<div class="history-item expandCollapse" @click="expandAndCollapse = !expandAndCollapse">
						<u-icon name="arrow-up" size="40" v-if="expandAndCollapse"></u-icon>
						<u-icon name="arrow-down" size="40" v-else></u-icon>
					</div>
				</div>
			</div>
			<div class="searchSuggest-box" v-if="searchSuggestList.length">
				<div class="searchSuggest-title">搜索建议</div>
				<div class="searchSuggest-list">
					<div
						class="searchSuggest-item"
						v-for="item in searchSuggestList"
						@click="goSeach(item.keyword)"
						>{{ item.keyword }}</div
					>
				</div>
			</div>
			<div class="top-list-box">
				<scroll-view class="scroll-view" scroll-x="true" enable-flex>
					<div class="scroll-item" v-for="item in topList" @click="goSongSheet(item.id)">
						<div class="item-top">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{ item.updateFrequency }}</text>
						</div>
						<div class="item-bottom">
							<div class="bottom-data" v-for="(song, songIndex) in item.tracks">
								{{ songIndex + 1 }}.
								{{ song.name }}
							</div>
						</div>
					</div>
				</scroll-view>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { $search_suggest, $toplist } from '../../api/search';
	import { $playlist_detail } from '../../api/index';
	onLoad((res) => {
		searchWord.value = res.searchWord;
		searchSuggest();
		getTopList();
	});
	onShow(() => {
		historyList.value = uni.getStorageSync('historyList') || [];
	});

	// 搜索
	let searchWord = ref('');
	async function search() {
		if (!searchWord.value) {
			uni.showToast({
				title: '搜索关键词不能为空',
				icon: 'none',
			});
			return;
		}
		addHistoryList();
		uni.navigateTo({
			url: `/pages/search/list?searchWord=${searchWord.value}`,
		});
	}

	// 搜索历史
	let historyList = ref([]);
	function addHistoryList() {
		let index = historyList.value.indexOf(searchWord.value);
		if (index == -1) {
			historyList.value.push({ searchWord: searchWord.value });
		}
		uni.setStorageSync('historyList', historyList.value);
	}
	function deleteHistory() {
		// 先询问再删除
		uni.showModal({
			content: '确定清空全部搜索历史吗?',
			success: (res) => {
				if (res.confirm) {
					uni.removeStorageSync('historyList');
					historyList.value = [];
				}
			},
		});
	}
	let expandAndCollapse = ref(false); // 展开收起

	// 搜索建议
	let searchSuggestList = ref([]);
	async function searchSuggest() {
		try {
			let res = await $search_suggest({ keywords: searchWord.value, type: 'mobile' });
			searchSuggestList.value = res.result.allMatch;
		} catch (error) {
			console.log(error);
		}
	}

	// 所有榜单(前10个)
	let topList = ref([]);
	async function getTopList() {
		try {
			let res = await $toplist();
			let ids = [];
			// 将前10个数据的id放入ids中
			for (let index = 0; index < 10; index++) {
				ids.push({
					id: res.list[index].id,
					updateFrequency: res.list[index].updateFrequency,
				});
			}
			for (let index = 0; index < 10; index++) {
				const data = ids[index];
				let res = await $playlist_detail({ id: data.id });
				res.playlist.tracks = res.playlist.tracks.slice(0, 10);
				topList.value.push({ ...res.playlist, updateFrequency: data.updateFrequency });
			}
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

	// 去搜索
	function goSeach(data) {
		searchWord.value = data;
		search();
	}
</script>

<style lang="scss" scoped>
	.page_box {
		padding: 30rpx;
		padding-top: 10rpx;
		.searvh-box {
			margin-bottom: 20rpx;
		}
		.content_box {
			.history-box {
				margin-bottom: 20rpx;
				.history-title {
					@extend %c-box-space-center;
					margin-bottom: 10rpx;
					text {
						font-size: 30rpx;
						font-weight: 700;
					}
				}
				.history-list {
					display: flex;
					flex-wrap: wrap;
					overflow: hidden;
					padding-right: 30px;
					position: relative;
					.history-item {
						@extend %c-box-center;
						padding: 0 10rpx;
						border-radius: 20rpx;
						background: #fff;
						font-size: 26rpx;
						color: #ccc;
						margin: 0 20rpx 20rpx 0;
						max-width: 250rpx;
						@include feed(1);
						line-height: 2;
					}
					.expandCollapse {
						position: absolute;
						right: 0;
						top: 5rpx;
						margin: 0;
					}
				}
			}
			.searchSuggest-box {
				margin-bottom: 20rpx;
				.searchSuggest-title {
					margin-bottom: 10rpx;
					font-size: 30rpx;
					font-weight: 700;
				}
				.searchSuggest-list {
					display: flex;
					flex-wrap: wrap;
					.searchSuggest-item {
						@extend %c-box-center;
						padding: 0 10rpx;
						border-radius: 20rpx;
						background: #fff;
						font-size: 26rpx;
						color: #ccc;
						margin: 0 20rpx 20rpx 0;
						max-width: 250rpx;
						@include feed(1);
						line-height: 2;
					}
				}
			}
			.top-list-box {
				overflow: hidden;
				.scroll-view {
					display: flex;
					height: 850rpx;
					.scroll-item {
						padding: 25rpx;
						background: #fff;
						border-radius: 20rpx;
						margin-right: 20rpx;
						.item-top {
							width: 320rpx;
							height: 250rpx;
							position: relative;
							image {
								width: 100%;
								height: 100%;
								border-radius: 20rpx;
							}
							text {
								position: absolute;
								left: 10rpx;
								bottom: 10rpx;
								font-size: 18rpx;
								color: #fff;
								font-weight: 700;
							}
						}
						.item-bottom {
							.bottom-data {
								margin: 20rpx 0;
								font-size: 26rpx;
								@include feed(1);
							}
							.bottom-data:last-child {
								margin-bottom: 0;
							}
						}
					}
				}
			}
		}
	}
</style>
