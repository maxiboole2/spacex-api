<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-2">
        <button
          @click="viewMode = 'grid'"
          class="px-3 py-1 rounded-md"
          :class="{
            'bg-blue-500 text-white': viewMode === 'grid',
            'bg-gray-200': viewMode !== 'grid',
          }"
        >
          All Launches
        </button>
        <button
          @click="viewMode = 'carousel'"
          class="px-3 py-1 rounded-md"
          :class="{
            'bg-blue-500 text-white': viewMode === 'carousel',
            'bg-gray-200': viewMode !== 'carousel',
          }"
        >
          Focus View
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <TransitionGroup
      v-if="viewMode === 'grid'"
      name="disintegrate"
      tag="div"
      class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="launch in visibleLaunches"
        :key="launch.id"
        @click="handleClick(launch)"
        class="bg-gray-800 p-4 rounded-xl shadow-md transform transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-xl hover:bg-gray-700"
        :class="{ 'disintegrate-leave-active': launch.id === disintegratingId }"
        :aria-label="`Open details for ${launch.name}`"
      >
        <div class="flex items-start">
          <img
            v-if="launch.links.patch?.small"
            :src="launch.links.patch.small"
            alt="Mission patch"
            class="h-16 w-16 mr-4 object-contain"
          />
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ launch.name }}</h3>
            <p class="text-sm text-gray-400">
              {{ formatDate(launch.date_utc) }}
            </p>
            <div class="mt-2 flex items-center">
              <span
                class="inline-block w-3 h-3 rounded-full mr-2"
                :class="getStatusColor(launch)"
              ></span>
              <span>{{ getStatusText(launch) }}</span>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Carousel  -->
    <div v-else class="relative h-96">
      <Transition
        :name="transitionDirection === 'next' ? 'slide-next' : 'slide-prev'"
        mode="out-in"
      >
        <div
          v-if="currentLaunch"
          :key="currentLaunch.id"
          @click="handleClick(currentLaunch)"
          class="absolute inset-0 bg-gray-800 p-8 rounded-xl shadow-lg cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <img
            v-if="currentLaunch.links.patch?.small"
            :src="currentLaunch.links.patch.small"
            alt="Mission patch"
            class="h-32 w-32 mb-6 object-contain"
          />
          <h2 class="text-3xl font-bold mb-4">{{ currentLaunch.name }}</h2>
          <p class="text-xl text-gray-400 mb-2">
            {{ formatDate(currentLaunch.date_utc) }}
          </p>
          <div class="mt-4 flex items-center justify-center">
            <span
              class="inline-block w-4 h-4 rounded-full mr-2"
              :class="getStatusColor(currentLaunch)"
            ></span>
            <span class="text-lg">{{ getStatusText(currentLaunch) }}</span>
          </div>
        </div>
      </Transition>

      <button
        @click="prevLaunch"
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        @click="nextLaunch"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { Lancement } from "../types/lancement";

const props = defineProps<{
  launches: Lancement[];
}>();

const emit = defineEmits(["launch-selected"]);

const viewMode = ref<"grid" | "carousel">("grid");
const disintegratingId = ref<string | null>(null);
const visibleLaunches = ref<Lancement[]>([]);
const currentLaunchIndex = ref(0);
const currentLaunch = ref<Lancement | null>(null);
const transitionDirection = ref<"next" | "prev">("next");
let carouselInterval: number | null = null;

onMounted(() => {
  visibleLaunches.value = [...props.launches];
  if (props.launches.length > 0) {
    currentLaunch.value = props.launches[0];
  }
  startCarousel();
});

watch(viewMode, (newVal) => {
  if (newVal === "carousel") {
    startCarousel();
  } else {
    stopCarousel();
  }
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

const getStatusColor = (launch: Lancement): string => {
  if (launch.upcoming) return "bg-blue-500";
  if (launch.success) return "bg-green-500";
  return "bg-red-500";
};

const getStatusText = (launch: Lancement): string => {
  if (launch.upcoming) return "Upcoming";
  if (launch.success) return "Success";
  return "Failed";
};

const handleClick = (launch: Lancement) => {
  if (viewMode.value === "grid") {
    disintegratingId.value = launch.id;
    setTimeout(() => {
      emit("launch-selected", launch);
      disintegratingId.value = null;
    }, 500);
  } else {
    emit("launch-selected", launch);
  }
};

const nextLaunch = () => {
  transitionDirection.value = "next";
  currentLaunchIndex.value =
    (currentLaunchIndex.value + 1) % props.launches.length;
  currentLaunch.value = props.launches[currentLaunchIndex.value];
  resetCarouselTimer();
};

const prevLaunch = () => {
  transitionDirection.value = "prev";
  currentLaunchIndex.value =
    (currentLaunchIndex.value - 1 + props.launches.length) %
    props.launches.length;
  currentLaunch.value = props.launches[currentLaunchIndex.value];
  resetCarouselTimer();
};

const startCarousel = () => {
  if (viewMode.value === "carousel" && props.launches.length > 1) {
    carouselInterval = window.setInterval(nextLaunch, 5000);
  }
};

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
};

const resetCarouselTimer = () => {
  stopCarousel();
  startCarousel();
};

// Clean up interval when component is unmounted
onUnmounted(() => {
  stopCarousel();
});
</script>

<style scoped>
.disintegrate-leave-active {
  animation: disintegrateFade 0.5s forwards;
}

@keyframes disintegrateFade {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.7) rotate(10deg);
    filter: blur(4px);
  }
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.5s ease;
}

.slide-next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
