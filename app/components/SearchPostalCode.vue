<script setup lang="ts">
import Districts from "~/utils/mock-data/districts";

const searchQuery = ref("");
const copiedId = ref<string | null>(null);

// High-performance filtering
const filteredDistricts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return Districts;

  return Districts.filter(
    (d) =>
      d.name_en.toLowerCase().includes(query) ||
      d.name_la.includes(query) ||
      d.name_th.includes(query) ||
      d.postCode.includes(query) ||
      d.provinceId.name_en.toLowerCase().includes(query)
  );
});

// Copy postal code to clipboard
const copy = async (postCode: string, id: number) => {
  try {
    await navigator.clipboard.writeText(postCode);
    copiedId.value = String(id);
    setTimeout(() => {
      copiedId.value = null;
    }, 1000);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    <header class="bg-blue-600 pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 text-center">
      <h1
        class="text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight"
      >
        Laos Postal Code
      </h1>
      <p class="text-sm sm:text-base text-blue-100 opacity-90">
        The fastest postal code finder
      </p>
    </header>

    <main class="max-w-3xl mx-auto px-3 sm:px-4 -mt-8 sm:-mt-12">
      <div class="relative group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search District, Province, Code..."
          class="w-full p-4 sm:p-6 pl-11 sm:pl-14 text-base sm:text-lg bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border-none focus:ring-4 focus:ring-blue-400/20 transition-all outline-none"
        />
        <span
          class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <Icon name="mdi:magnify" size="20" />
        </span>
      </div>

      <div
        class="mt-4 sm:mt-6 mb-4 px-2 text-xs sm:text-sm text-slate-500 flex justify-between"
      >
        <span>Showing {{ filteredDistricts.length }} results</span>
        <span v-if="searchQuery" class="animate-pulse text-blue-600 font-medium"
          >Searching...</span
        >
      </div>

      <div
        class="space-y-3 pb-20"
        v-if="searchQuery || filteredDistricts.length > 0"
      >
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
        >
          <div
            v-for="item in filteredDistricts"
            :key="item.id"
            class="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm flex items-start sm:items-center justify-between hover:border-blue-300 transition-colors group gap-2"
          >
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-1 sm:gap-2">
                <h3
                  class="font-noto-lao font-bold text-base sm:text-lg text-slate-800 truncate"
                >
                  {{ item.name_la }}
                </h3>
                <span class="hidden sm:inline text-slate-300">|</span>
                <h3
                  class="font-roboto font-medium text-xs sm:text-sm text-slate-600 truncate"
                >
                  {{ item.name_en }}
                </h3>
                <span class="hidden sm:inline text-slate-300">|</span>
                <h3
                  class="hidden sm:block font-medium text-xs sm:text-sm text-slate-600 truncate"
                >
                  {{ item.name_th }}
                </h3>
              </div>
              <p
                class="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-1"
              >
                <Icon name="mdi:map-marker" size="12" class="shrink-0" />
                <span class="truncate">{{ item.provinceId.name_en }}</span>
                <span
                  class="mx-1 inline-block w-1 h-1 bg-slate-300 rounded-full shrink-0"
                ></span>
                <span
                  :class="
                    item.type === 'Urban'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-green-600 bg-green-50'
                  "
                  class="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  {{ item.type }}
                </span>
              </p>
            </div>

            <div class="text-right ml-2 shrink-0">
              <div
                class="text-xl sm:text-2xl font-black text-blue-600 tracking-wider group-hover:scale-110 transition-transform"
              >
                {{ item.postCode }}
              </div>
              <button
                @click="copy(item.postCode, item.id)"
                class="mt-1 inline-flex items-center justify-center w-8 h-8 rounded hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation"
                :title="
                  copiedId === String(item.id) ? 'Copied!' : 'Copy postal code'
                "
              >
                <Icon
                  v-if="copiedId !== String(item.id)"
                  name="mdi:content-copy"
                  size="16"
                  class="text-slate-400"
                />
                <Icon
                  v-else
                  name="mdi:check-all"
                  size="16"
                  class="text-green-500"
                />
              </button>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="filteredDistricts.length === 0" class="text-center py-20">
          <p class="text-slate-400">No results found for "{{ searchQuery }}"</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* body {
  @apply bg-slate-50;
} */
</style>
