<template>
  <div class="text-center">

    <div v-if="ethereumStore.balance" class="mt-4 text-white">
      Saldo: {{ ethereumStore.balance }} ETH
    </div>
    <who-am-i />


    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <h1 class="text-3xl font-bold text-center mb-6">
        O aplikacji do głosowań blockchainowych
      </h1>

      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="flex-1">
          <h2 class="text-xl font-semibold mb-4 text-start">Czym jest aplikacja?</h2>
          
          <p class="text-gray-700 mb-4 text-start">
            To nowoczesna platforma do przeprowadzania bezpiecznych i transparentnych głosowań online, wykorzystująca technologię blockchain Ethereum. Integruje się ze specjalnie zaprojektowanym smart kontraktem <b class="text-cyan-400">{{ contractAddress }}</b>, dzięki czemu każdy głos jest nieodwracalnie zapisywany w sieci.
          </p>

          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-lock-closed" class="text-green-500" />
            <span class="text-sm text-gray-600">Bezpieczeństwo i niezmienność danych</span>
          </div>

        </div>
        <div class="flex-1 flex justify-center">
          <img
            src="/public/blockchain.png"
            alt="Blockchain voting"
            class="w-[250px] h-[250px]"
          >
        </div>
      </div>

      <USeparator
        :ui="{
          border: 'border-blue-500 dark:border-purple-500'
        }"
        label="Funkcjonalności"
        class="mt-4 mb-2"
      />
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <h3 class="font-medium text-lg flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="text-blue-500" />
              Tworzenie głosowań
            </h3>
          </template>
          <p class="text-gray-700">
            Administratorzy mogą tworzyć nowe głosowania, ustawiać ich terminy oraz dodawać kandydatów.
          </p>
        </UCard>
        <UCard>
          <template #header>
            <h3 class="font-medium text-lg flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="text-purple-500" />
              Zarządzanie uprawnieniami
            </h3>
          </template>
          <p class="text-gray-700">
            Możliwość dodawania i usuwania głosujących oraz administratorów.
          </p>
        </UCard>
        <UCard>
          <template #header>
            <h3 class="font-medium text-lg flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="text-green-500" />
              Podgląd wyników
            </h3>
          </template>
          <p class="text-gray-700">
            Transparentne i natychmiastowe wyświetlanie wyników głosowań.
          </p>
        </UCard>
        <UCard>
          <template #header>
            <h3 class="font-medium text-lg flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="text-red-500" />
              Bezpieczeństwo
            </h3>
          </template>
          <p class="text-gray-700">
            Każdy głos jest potwierdzany cyfrowo i zapisywany w blockchainie.
          </p>
        </UCard>
      </div>
  
      <USeparator
        :ui="{
          border: 'border-blue-500 dark:border-purple-500'
        }"
        label="Technologie"
        class="mt-4 mb-2"
      />

      <div class="flex flex-wrap gap-3 justify-center items-center">
        <UBadge
          :ui="{
            base: 'bg-blue-500/10 text-blue-400  dark:bg-purple-500/10 dark:text-purple-500'
          }" variant="soft" color="secondary" size="lg">Nuxt 3</UBadge>

        <UBadge
          :ui="{
            base: 'bg-blue-500/10 text-blue-400  dark:bg-purple-500/10 dark:text-purple-500'
          }" variant="soft" color="secondary" size="lg">Ethers.js</UBadge>

        <UBadge
          :ui="{
            base: 'bg-blue-500/10 text-blue-400  dark:bg-purple-500/10 dark:text-purple-500'
          }" variant="soft" color="secondary" size="lg">Ethereum</UBadge>

        <UBadge
          :ui="{
            base: 'bg-blue-500/10 text-blue-400  dark:bg-purple-500/10 dark:text-purple-500'
          }" variant="soft" color="secondary" size="lg">IPFS</UBadge>

        <UBadge
          :ui="{
            base: 'bg-blue-500/10 text-blue-400  dark:bg-purple-500/10 dark:text-purple-500'
          }" variant="soft" color="secondary" size="lg">Nuxt UI</UBadge>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

const ethereumStore = useEthereumStore();

</script>