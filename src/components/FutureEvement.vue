<template>
  <section
    v-if="nextLaunch"
    class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
  >
    <h2 class="text-2xl font-bold mb-6 text-white">Prochain Lancement</h2>

    <div class="grid md:grid-cols-2 gap-6 items-center">
      <div>
        <h3 class="text-2xl font-bold text-blue-400">
          {{ nextLaunch.name }}
        </h3>
        <p class="mt-2 text-gray-300">
          <span class="font-semibold">📅 Date : </span>
          {{ formatDate(nextLaunch.date_utc) }}
        </p>
        <p class="mt-4 text-lg">
          <span class="font-semibold text-yellow-400"> Compte à rebours :</span>
          <span class="ml-2 text-yellow-300 font-mono">{{ countdown }}</span>
        </p>
      </div>

      <div
        v-if="nextLaunch.links.patch?.large"
        class="flex justify-center items-center"
      >
        <img
          :src="nextLaunch.links.patch.large"
          alt="Mission patch"
          class="h-32 w-32 object-contain drop-shadow-xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Lancement } from "../types/lancement";

const props = defineProps<{
  nextLaunch: Lancement;
}>();

const countdown = ref("");

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Countdown update logic
const updateCountdown = () => {
  if (!props.nextLaunch?.date_utc) return;

  const launchDate = new Date(props.nextLaunch.date_utc);
  const now = new Date();
  const diff = launchDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdown.value = " Lancé !";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countdown.value = `${days}j ${hours}h ${minutes}m ${seconds}s`;
};

let interval: number;

onMounted(() => {
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
