<template>
  <div class="text-center">
    <UButton
      v-if="!address"
      label="Połącz z MetaMask"
      @click="connect"
    />
    <div v-else>
      {{ shortAddress }}
    </div>


    <div v-if="balance" class="mt-4 text-white">
      Saldo: {{ balance }} ETH
    </div>
    <who-am-i />


    {{ data }}
    <!-- <UButton label="Kliknij tutaj" @click="xd" /> -->
  </div>
</template>

<script setup lang="ts">
const { address, shortAddress, balance, connect } = useEthereum();

const { data } = await useFetch('/api/blockchain');

</script>