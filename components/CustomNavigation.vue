<template>
  <nav class="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-slate-950 relative">
    <UButton
      to="/"
      class="bg-transparent hover:bg-secondary/15 py-1 px-1.5 text-gray-300"
      :color="$route.fullPath === '/' ? 'neutral' :'success'"
      variant="ghost"
      label="Voting APP"
    />

    <!-- Hamburger icon -->
    <button
      class="md:hidden ml-auto flex items-center text-gray-200 focus:outline-none hover:bg-secondary/20 rounded-full cursor-pointer p-1"
      aria-label="Otwórz menu"
      @click="menuOpen = !menuOpen"
    >
      <UIcon :name="menuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-7 h-7" />
    </button>

    <!-- Desktop menu -->
    <div class="hidden md:flex gap-4 ml-auto">
      <nav-link to="/votings" label="Głosowania" />
      <!-- <nav-link to="/your-votes" label="Twoje głosy" /> -->
      <nav-link v-if="votingStore.hasAdminPermissions" to="/create-voting" label="Stwórz głosowanie" />
      <nav-link v-if="votingStore.hasAdminPermissions" to="/adjust-permissions" label="Kontroluj Permisje" />
    </div>

    <!-- Login/metamask & kolorystyka -->
    <div class="ml-4 hidden md:flex items-center space-x-4">
      <UButtonGroup>
        <div class="bg-secondary/10 rounded-l-md p-1">
          <img
            src="/public/metamask.png"
            alt="MetaMask"
            class="w-5 h-5"
          >
        </div>

        <ClientOnly v-if="isClient">
          <UButton
            v-if="!ethereumStore.address || ethereumStore.connection !== 'established'"
            class="flex items-center p-1 px-3 bg-secondary/10 disabled:bg-secondary/10 hover:bg-secondary/15  text-gray-300"
            label="Połącz"
            :loading="!ethereumStore.connection"
            @click="ethereumStore.connect"
          />

          <div v-else-if="ethereumStore.connection === 'established'" class="text-sm text-center">
            <div class="bg-secondary/10 rounded-r-md p-1 text-gray-300">
              {{ ethereumStore.shortAddress }}
            </div>
          <!-- <div class="text-cyan-400">{{ votingStore.role }}</div> -->
          </div>
        </ClientOnly>

        <UButton
          v-else
          class="flex items-center p-1 px-3 bg-secondary/10 disabled:bg-secondary/10 hover:bg-secondary/15 text-gray-300"
          label="Połącz"
          :loading="true"
        />

      </UButtonGroup>
      <ClientOnly>
        <UButton
          class="p-1 rounded text-gray-100 transition cursor-pointer dark:hover:text-yellow-600 hover:text-blue-500 bg-transparent hover:bg-secondary/15 py-1 px-1.5"
          variant="link"
          @click="toggleColorMode"
        >
          <UIcon
            :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            class="w-5 h-5"
          />
        </UButton>
      </ClientOnly>
    </div>

    <!-- Mobile menu -->
    <transition name="fade">
      <div
        v-if="menuOpen"
        class="absolute top-full left-0 w-full bg-slate-950 border-b border-gray-700 flex flex-col items-center gap-3 py-4 md:hidden z-50"
      >
        <nav-link to="/votings" label="Głosowania" @click="menuOpen = false" />
        <!-- <nav-link to="/your-votes" label="Twoje głosy" @click="menuOpen = false" /> -->
        <nav-link v-if="votingStore.hasAdminPermissions" to="/create-voting" label="Stwórz głosowanie" @click="menuOpen = false" />
        <nav-link v-if="votingStore.hasAdminPermissions" to="/adjust-permissions" label="Kontroluj Permisje" @click="menuOpen = false" />

        <UButton
          v-if="!ethereumStore.address"
          label="Połącz z MetaMask"
          color="secondary"
          variant="soft"
          @click="ethereumStore.connect"
        />
        
        <ClientOnly>

          <UButton
            class="p-1 rounded text-gray-100 transition cursor-pointer dark:hover:text-yellow-600 hover:text-blue-500 bg-transparent hover:bg-secondary/15 py-1 px-1.5"
            variant="link"
            @click="toggleColorMode"
          >
            <UIcon
              :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              class="w-5 h-5"
            /> Zmień motyw strony
          </UButton>
        </ClientOnly>
      </div>
    </transition>


    <UModal v-model:open="showAlreadyProcessingModal" title="Problem z połączeniem" @after:leave="ethereumStore.errorCode = null">
      <template #body>
        Masz już aktywne połączenie z portfelem. Zabezpieczenia Metamaska ograniczają możliwosć wielu prób połączeń. Z uwagi na to, wejdź w rozszerzenia i tam zaloguj się do rozszerzenia.
      </template>
    </UModal>

    <UModal v-model:open="showNotMetamaskDetectedModal" title="Problem z połączeniem" @after:leave="ethereumStore.errorCode = null">
      <template #body>
        <div class="flex flex-col items-center">
          <img
            src="/public/metamask.png"
            alt="MetaMask"
            class="w-[50%]"
          >
          <div>
            Nie wykryto wymaganego rozszerzenia Metamask.
          </div>
        </div>
      </template>
    </UModal>
  </nav>
</template>


<script setup lang="ts">
const ethereumStore = useEthereumStore();
const votingStore = useVotingStore();

const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const menuOpen = ref(false);
const showAlreadyProcessingModal = ref(false);
const showNotMetamaskDetectedModal = ref(false);

const isClient = computed(() => import.meta.client);

watch(() => ethereumStore.errorCode, (nv) => {
  console.log(nv);
   
  if (nv === -32002) {
    showAlreadyProcessingModal.value = true;
  }

  else if( nv === 2137) {
    showNotMetamaskDetectedModal.value = true;
  }

});

</script>

<style scoped>

</style>
