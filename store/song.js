import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getPlayer } from '../utils';
import { $song_url } from '../api/index';
export const useSongStore = defineStore('song', () => {
	let song = ref({});
	let songList = ref([]);
	let rotateAngle = ref(0);
	let rotateInterval = ref(null);
	let duration = ref(0); // 当前音频的长度 单位是s
	let currentTime = ref(0); // 当前音频的播放位置 单位是s
	let paused = ref(false); // 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放

	// 改变歌曲
	async function changeSong(data) {
		song.value = data;
		let url = await getSongUrl(data.id);
		let player = getPlayer();
		player.src = url;
		playSong();
	}
	// 播放歌曲
	function playSong() {
		paused.value = false;
		let player = getPlayer();
		player.play();
		player.onTimeUpdate(() => {
			duration.value = player.duration;
			currentTime.value = player.currentTime;
		});
		rotateSong();
	}
	// 暂停歌曲
	function pausedSong() {
		paused.value = true;
		let player = getPlayer();
		player.pause();
		rotateSong();
	}
	// 让唱片旋转
	function rotateSong() {
		if (paused.value) {
			clearInterval(rotateInterval.value);
		} else {
			rotateInterval.value = setInterval(() => {
				rotateAngle.value += 1;
				if (rotateAngle.value >= 360) {
					rotateAngle.value = 0;
				}
			}, 20);
		}
	}
	// 改变歌曲列表
	function changeSongList(list) {
		songList.value = songList;
	}
	// 获取歌曲 url
	async function getSongUrl(id) {
		try {
			let res = await $song_url({ id, level: 'jymaster' });
			return res.data[0].url;
		} catch (error) {
			console.log(error);
		}
	}

	return {
		song,
		songList,
		duration,
		currentTime,
		paused,
		rotateAngle,
		changeSong,
		changeSongList,
		playSong,
		pausedSong,
	};
});
