<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    @click.self="close"
  >
    <div
      ref="modalRef"
      class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">{{ launch.name }}</h2>
          <button @click="close" class="text-gray-400 hover:text-white">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Launch Details</h3>
              <p>
                <span class="font-medium">Date:</span>
                {{ formatDate(launch.date_utc) }}
              </p>
              <p v-if="launch.launchpad">
                <span class="font-medium">Launch Site:</span>
                {{ launch.launchpad.name }}
              </p>
              <p v-if="launch.rocket?.name">
                <span class="font-medium">Rocket:</span>
                {{ launch.rocket.name }}
              </p>
              <p v-if="launch.success !== null">
                <span class="font-medium">Status:</span>
                <span
                  :class="launch.success ? 'text-green-400' : 'text-red-400'"
                >
                  {{ launch.success ? "Success" : "Failed" }}
                </span>
              </p>
            </div>

            <div v-if="launch.details" class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Mission Description</h3>
              <p class="text-gray-300">{{ launch.details }}</p>
            </div>

            <div v-if="launch.payloads.length > 0" class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Payloads</h3>
              <ul class="list-disc pl-5">
                <li v-for="payload in launch.payloads" :key="payload.id">
                  {{ payload.name }}
                  <span v-if="payload.customers?.length">
                    (Customers: {{ payload.customers.join(", ") }})
                  </span>
                </li>
              </ul>
            </div>

            <div
              v-if="launch.links.article || launch.links.wikipedia"
              class="mb-4"
            >
              <h3 class="text-lg font-semibold mb-2">Links</h3>
              <div class="flex flex-wrap gap-2">
                <a
                  v-if="launch.links.article"
                  :href="launch.links.article"
                  target="_blank"
                  class="text-blue-400 hover:text-blue-300 underline"
                >
                  Article
                </a>
                <a
                  v-if="launch.links.wikipedia"
                  :href="launch.links.wikipedia"
                  target="_blank"
                  class="text-blue-400 hover:text-blue-300 underline"
                >
                  Wikipedia
                </a>
              </div>
            </div>

            <YoutubePlayer
              v-if="launch.links.youtube_id"
              :videoId="launch.links.youtube_id"
            />
          </div>

          <div>
            <img
              v-if="launch.links.flickr?.original?.length"
              :src="launch.links.flickr.original[0]"
              alt="Launch photo"
              class="w-full h-auto rounded-lg mb-4"
            />
            <img
              v-else-if="launch.links.patch?.large"
              :src="launch.links.patch.large"
              alt="Mission patch"
              class="w-full h-auto max-w-xs mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import YoutubePlayer from "./YoutubePlayer.vue";
import type { Lancement } from "../types/lancement";

defineProps<{
  launch: Lancement;
}>();

const emit = defineEmits(["close"]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

const close = () => {
  emit("close");
};
</script>
