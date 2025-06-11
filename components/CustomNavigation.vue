<template>
  <nav class="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-slate-950 relative">
    <UButton
      to="/"
      class="nav-btn"
      :color="$route.fullPath === '/' ? 'neutral' :'success'"
      variant="ghost"
      label="Voting APP"
    />

    <!-- Hamburger icon -->
    <button
      class="md:hidden ml-auto text-gray-200 focus:outline-none"
      aria-label="Otwórz menu"
      @click="menuOpen = !menuOpen"
    >
      <UIcon :name="menuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-7 h-7" />
    </button>

    <!-- Desktop menu -->
    <div class="hidden md:flex gap-4 ml-auto">
      <nav-link to="/votings" label="Głosowania" />
      <nav-link to="/your-votes" label="Twoje głosy" />
      <nav-link v-if="votingStore.hasAdminPermissions" to="/create-voting" label="Stwórz głosowanie" />
      <nav-link v-if="votingStore.hasAdminPermissions" to="/adjust-permissions" label="Kontroluj Permisje" />
    </div>

    <!-- Login/metamask & kolorystyka -->
    <div class="ml-4 hidden md:flex items-center space-x-4">
      <template v-if="ethereumStore.showLoginButton">
        <UButton
          v-if="!ethereumStore.address"
          label="Połącz z MetaMask"
          color="secondary"
          variant="soft"
          @click="ethereumStore.connect"
        />
      </template>
      <div v-else-if="ethereumStore.connection === 'established'" class="text-sm text-center">
        <div>
          {{ ethereumStore.shortAddress }}
        </div>
        <div class="text-cyan-400">{{ votingStore.role }}</div>
      </div>
      <ClientOnly>
        <UButton
          class="px-4 py-2 rounded bg-gray-800 text-gray-100 transition"
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
        <nav-link to="/your-votes" label="Twoje głosy" @click="menuOpen = false" />
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
            class="px-4 py-2 rounded bg-gray-800 text-gray-100 transition"
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
</script>

<style scoped>


.nav-btn:hover {
  /* box-shadow: 0 4px 20px 0 rgba(160, 160, 160, 0.3); */
  background: var(--color-slate-950) !important;
  color: var(--ui-primary);
  text-decoration: none;
}
</style>
