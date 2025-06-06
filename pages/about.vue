<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold text-center mb-6">
          O aplikacji do głosowań blockchainowych
        </h1>
      </template>
  
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div class="flex-1">
            <h2 class="text-xl font-semibold mb-4">Czym jest nasza aplikacja?</h2>
            <p class="text-gray-700 mb-4">
              To nowoczesna platforma do przeprowadzania bezpiecznych i transparentnych głosowań online, wykorzystująca technologię blockchain Ethereum. Integruje się ze specjalnie zaprojektowanym smart kontraktem <b class="text-cyan-400">{{ contractAddress }}</b>, dzięki czemu każdy głos jest nieodwracalnie zapisywany w sieci.
            </p>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-lock-closed" class="text-green-500" />
              <span class="text-sm text-gray-600">Bezpieczeństwo i niezmienność danych</span>
            </div>
          </div>
          <div class="flex-1">
            <img
              src="https://source.unsplash.com/random/400x300/?blockchain,voting"
              alt="Blockchain voting"
              class="rounded-lg shadow-md w-full"
            >
          </div>
        </div>
  
        <USeparator label="Funkcjonalności" />
  
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
  
        <USeparator label="Technologie" />
  
        <div class="flex flex-wrap gap-4 justify-center">
          <UBadge color="primary" variant="solid">Nuxt 3</UBadge>
          <UBadge color="blue" variant="solid">Ethers.js</UBadge>
          <UBadge color="green" variant="solid">Ethereum</UBadge>
          <UBadge color="purple" variant="solid">IPFS</UBadge>
          <UBadge color="gray" variant="solid">Nuxt UI</UBadge>
        </div>
  
        <div class="text-center mt-8">
          <UButton
            to="/"
            icon="i-heroicons-arrow-left"
            color="primary"
            label="Wróć do głównej"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
  
<script setup lang="ts">
// Tutaj możesz dodać logikę jeśli potrzebujesz

import { contractAddress } from '~/composables/test';
</script>
  