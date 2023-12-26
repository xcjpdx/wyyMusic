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
		<scroll-view
			class="content_box"
			scroll-y
			enable-back-to-top
			refresher-enabled
			:refresher-triggered="refresherTriggered"
			@scrolltolower="onScrolltolower"
			@refresherrefresh="onRefresherrefresh"
			v-if="!isNotData"
		>
			<div class="list-item" v-for="(item, index) in list" :key="index">
				{{ item.name }}
			</div>
		</scroll-view>
		<u-empty mode="car" icon="search" text="暂无数据" marginTop="50" v-else> </u-empty>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { $cloudsearch } from '../../api/search';
	onLoad((res) => {
		searchWord.value = res.searchWord;
		search();
	});

	// 搜索
	let searchWord = ref('');
	let page = ref(1);
	let listFinish = ref(false); // 是否加载完成
	let refresherTriggered = ref(false); // 是否下拉刷新
	let isNotData = ref(false); // 是否没有数据
	let list = ref([]);
	async function search() {
		if (!searchWord.value) {
			uni.showToast({
				title: '搜索关键词不能为空',
				icon: 'none',
			});
			return;
		}
		try {
			let params = {
				keywords: searchWord.value,
				limit: 10,
				offset: page.value,
				type: 1,
			};
			let res = await $cloudsearch(params);
			list.value.push(...res.result.songs);
			list.value.length == res.result.songCount
				? (listFinish.value = true)
				: (listFinish.value = false);
			setTimeout(() => {
				list.value.length === 0 ? (isNotData.value = true) : (isNotData.value = false);
			}, 500);
		} catch (error) {
			console.log(error);
		}
	}
	function onScrolltolower() {
		if (listFinish.value) {
			uni.showToast({
				title: '没有更多数据了',
				icon: 'none',
			});
			return;
		}
		page.value++;
		search();
	}
	async function onRefresherrefresh() {
		refresherTriggered.value = true;
		page.value = 1;
		list.value = [];
		listFinish.value = false;
		await search();
		refresherTriggered.value = false;
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
		}
	}
</style>
