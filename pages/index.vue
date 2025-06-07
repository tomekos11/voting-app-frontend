<template>
  <div class="text-center">

    <div v-if="ethereumStore.balance" class="mt-4 text-white">
      Saldo: {{ ethereumStore.balance }} ETH
    </div>
    <who-am-i />


    <!-- {{ data }} -->
  </div>
</template>

<script setup lang="ts">

const ethereumStore = useEthereumStore();

</script>