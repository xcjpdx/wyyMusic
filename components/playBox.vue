<template>
	<div class="box" v-if="songStore.song.id">
		<div class="record">
			<image
				:src="songStore.song.al.picUrl"
				mode=""
				:style="{ transform: `rotate(${songStore.rotateAngle}deg)` }"
			></image>
		</div>
		<div class="name">{{ songStore.song.name }}</div>
		<div class="status" @click="playOrPaused">
			<u-icon v-if="songStore.paused" name="play-circle" color="#000" size="60"></u-icon>
			<u-icon v-else name="pause-circle" color="#000" size="60"></u-icon>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, watchEffect } from 'vue';
	import { onLoad, onUnload, onShow } from '@dcloudio/uni-app';
	import { useSongStore } from '../store/song.js';
	let songStore = useSongStore();

	// 点击播放/暂停
	function playOrPaused() {
		if (songStore.paused) {
			songStore.playSong();
		} else {
			songStore.pausedSong();
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		z-index: 5;
		position: absolute;
		bottom: 0;
		left: 0;
		@extend %c-box-space-center;
		padding: 30rpx;
		width: 100%;
		background: #fff;
		.record {
			margin-right: 20rpx;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background: #000;
			@extend %c-box-center;
			image {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}
		}
		.name {
			flex: 1;
			margin-right: 20rpx;
			font-size: 34rpx;
		}
		.status {
			margin-right: 20rpx;
		}
	}
</style>
