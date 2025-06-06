<template>
  <div class="text-center">

    <div v-if="balance" class="mt-4 text-white">
      Saldo: {{ balance }} ETH
    </div>
    <who-am-i />


    {{ data }}
  </div>
</template>

<script setup lang="ts">
const { address, shortAddress, balance, connect } = useEthereum();

const { data } = await useFetch('/api/blockchain');

</script>