<template>
  <nav class="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-slate-950">
    <UButton
      to="/about"
      class="nav-btn"
      :color="$route.fullPath === '/' ? 'neutral' :'success'"
      variant="ghost"
      label="Voting APP"
    />
      
    <div class="flex gap-4 ml-auto">
      <UButton
        to="/about"
        class="nav-btn"
        :color="$route.fullPath === '/about' ? 'success' :'neutral'"
        variant="link"
        label="O aplikacji"
      />
      <UButton
        to="/votings"
        class="nav-btn"
        :color="$route.fullPath === '/votings' ? 'success' :'neutral'"
        variant="link"
        label="Głosowania"
      />
      <UButton
        to="/your-votes"
        class="nav-btn"
        :color="$route.fullPath === '/your-votes' ? 'success' :'neutral'"
        variant="link"
        label="Twoje głosy"
      />
    </div>


    <UButton 
      v-if="address"
      :label="address ? `Połączono: ${shortAddress}` : 'Połącz z MetaMask'" 
      @click="connect" 
    />
  </nav>
</template>

<script setup lang="ts">
const { address, shortAddress, connect } = useEthereum();

</script>

<style scoped>


.nav-btn:hover {
  /* box-shadow: 0 4px 20px 0 rgba(160, 160, 160, 0.3); */
  background: var(--color-slate-950) !important;
  color: var(--ui-primary);
  text-decoration: none;
}
</style>
