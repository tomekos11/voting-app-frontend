<template>
  <nav class="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-slate-950">
    <UButton
      to="/"
      class="nav-btn"
      :color="$route.fullPath === '/' ? 'neutral' :'success'"
      variant="ghost"
      label="Voting APP"
    />
      
    <div class="flex gap-4 ml-auto">

      <nav-link to="/about" label="O aplikacji" />
      
      <nav-link to="/votings" label="Głosowania" />

      <nav-link to="/your-votes" label="Twoje głosy" />

      <nav-link v-if="votingStore.role === 'admin' || votingStore.role === 'chairman'" to="/create-voting" label="Stwórz głosowanie" />

      <nav-link v-if="votingStore.role === 'admin' || votingStore.role === 'chairman'" to="/adjust-permissions" label="Kontroluj Permisje" />
    </div>

    <div class="ml-10">
      <template v-if="ethereumStore.connection === 'needs_provider_login'">
        <UButton
          v-if="!ethereumStore.address"
          label="Połącz z MetaMask"
          @click="ethereumStore.connect"
        />
      </template>
      <div v-else-if="ethereumStore.connection === 'established'" class="text-sm text-center">
        <div>
          {{ ethereumStore.shortAddress }}
        </div>
        <div class="text-cyan-400">{{ votingStore.role }}</div>
      </div>
      
    </div>
  </nav>
</template>

<script setup lang="ts">
const ethereumStore = useEthereumStore();
const votingStore = useVotingStore();


const isClient = computed(() => import.meta.client);

</script>

<style scoped>


.nav-btn:hover {
  /* box-shadow: 0 4px 20px 0 rgba(160, 160, 160, 0.3); */
  background: var(--color-slate-950) !important;
  color: var(--ui-primary);
  text-decoration: none;
}
</style>
