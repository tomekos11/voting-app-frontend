<template>
  <div class="text-center">
    <UButton
      :label="address ? `Połączono: ${shortAddress}` : 'Połącz z MetaMask'"
      @click="connect"
    />
    <div v-if="balance" class="mt-4 text-white">
      Saldo: {{ balance }} ETH
    </div>
    <who-am-i />
  </div>
</template>

<script setup lang="ts">
const { address, shortAddress, balance, connect } = useEthereum();
</script>