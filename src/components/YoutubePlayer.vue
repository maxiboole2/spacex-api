<template>
  <div class="mt-4">
    <label class="flex items-center space-x-2 mb-2">
      <input type="checkbox" v-model="visible" />
      <span>Afficher la vidéo du lancement</span>
    </label>

    <div v-show="visible">
      <div class="relative w-full pb-[56.25%]">
        <div
          id="youtube-player"
          class="absolute top-0 left-0 w-full h-full"
        ></div>
      </div>

      <div class="flex items-center gap-4 mt-2">
        <button
          @click="playVideo"
          class="px-4 py-2 bg-green-600 text-white rounded"
        >
          Play
        </button>
        <button
          @click="pauseVideo"
          class="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Pause
        </button>
        <button
          @click="stopVideo"
          class="px-4 py-2 bg-red-600 text-white rounded"
        >
          Stop
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
});

const visible = ref(false);
let player = null;

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => resolve();
    }
  });
}

async function initPlayer() {
  await loadYouTubeAPI();

  player = new YT.Player("youtube-player", {
    height: "390",
    width: "640",
    videoId: props.videoId,
    playerVars: {
      playsinline: 1,
      controls: 1,
    },
  });
}

function playVideo() {
  if (player) player.playVideo();
}
function pauseVideo() {
  if (player) player.pauseVideo();
}
function stopVideo() {
  if (player) player.stopVideo();
}

watch(visible, (val) => {
  if (val && !player) initPlayer();
});

onMounted(() => {
  if (visible.value) initPlayer();
});
</script>
