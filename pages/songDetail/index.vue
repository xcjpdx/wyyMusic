<template>
	<div>{{ lyric }} </div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { $playlist_tracks, $song_detail, $lyric } from '../../api/song';
	import { useSongStore } from '../../store/song';
	let songStore = useSongStore();
	onLoad((options) => {
		getLyric();
	});
	// 歌曲详情
	let songDetail = ref({});
	async function getSongDetail() {
		// let res = await $song_detail({ id: songStore.song.id });
		// songDetail.value = res.songs[0];
	}
	// 歌词
	let lyric = ref({});
	async function getLyric() {
		try {
			let res = await $lyric({ id: songStore.song.id });
			lyric.value = res.lrc.lyric;
		} catch (error) {
			console.log(error);
		}
	}
</script>

<style lang="scss" scoped></style>
