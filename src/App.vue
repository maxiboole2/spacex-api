<template>
  <div class="min-h-screen">
    <ThreeBackground />
    <div class="container mx-auto flex items-center justify-center">
      <!-- <img :src="logo" alt="SpaceX Logo" class="w-32 h-32 mr-4" /> -->
      <h1 class="text-3xl font-bold m-10">SpaceX Launch Viewer</h1>
    </div>

    <main class="container mx-auto px-4 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
        ></div>
        <p class="text-xl">Loading launch data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12 text-red-400">
        <p class="text-xl">Failed to load launch data</p>
        <button
          @click="initialize"
          class="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>

      <!-- Content when data is loaded -->
      <template v-else>
        <NextLaunchSection v-if="nextLaunch" :next-launch="nextLaunch" />

        <div class="mt-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold">Recent Launches</h2>
            <select
              v-model="selectedFilter"
              class="bg-gray-800 text-white px-4 py-2 rounded"
              @change="fetchLaunches"
            >
              <option value="tous">All Launches</option>
              <option value="succes">Successful Launches</option>
              <option value="echec">Failed Launches</option>
            </select>
          </div>

          <LaunchList :launches="launches" @launch-selected="openModal" />
        </div>
      </template>
    </main>

    <LaunchModal
      v-if="selectedLaunch"
      :launch="selectedLaunch"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import ThreeBackground from "./Annimation/ThreeBackground.vue";

import { ref, onMounted } from "vue";
import { getProchainLancement, getLancements } from "./services/spacexApi";
import type { Lancement } from "./types/lancement";
import NextLaunchSection from "./components/FutureEvement.vue";
import LaunchList from "./components/EvenementList.vue";
import LaunchModal from "./components/DetaillsModal.vue";
import logo from "./assets/spacex-logo.png";

const nextLaunch = ref<Lancement | null>(null);
const launches = ref<Lancement[]>([]);
const selectedFilter = ref<"tous" | "succes" | "echec">("tous");
const selectedLaunch = ref<Lancement | null>(null);
const loading = ref(true);
const error = ref(false);

async function initialize() {
  try {
    loading.value = true;
    error.value = false;

    // Fetch both in parallel for better performance
    const [next, launchesData] = await Promise.all([
      getProchainLancement(),
      getLancements(selectedFilter.value),
    ]);

    nextLaunch.value = next;
    launches.value = launchesData;
  } catch (err) {
    console.error("Initialization error:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(initialize);

async function fetchLaunches() {
  try {
    loading.value = true;
    launches.value = await getLancements(selectedFilter.value);
  } catch (err) {
    console.error("Error fetching launches:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

function openModal(launch: Lancement) {
  selectedLaunch.value = launch;
}

function closeModal() {
  selectedLaunch.value = null;
}
</script>
