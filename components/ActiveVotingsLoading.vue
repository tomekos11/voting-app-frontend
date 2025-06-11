<template>
  <section>
    <h2 class="text-2xl font-bold mb-4">Aktywne głosowania</h2>
    <div class="flex ps-4">
      <UCard v-for="i in 3" :key="i" class="h-full mx-2 basis-full md:basis-1/2 lg:basis-1/3">
        <template #header>
          <USkeleton class="h-3" />
        </template>

        <div>
          <USkeleton class="h-3" />
        </div>

        <div class="mt-2">
          <USkeleton class="h-3" />
        </div>

        <div class="space-y-4">
          <UProgress 
            :model-value="null"
            :min="0"
            :max="100"
            status
            :ui="{ size: 'md', rounded: 'rounded-full' }"
            class="mt-2"
          />
            
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
            <span class="font-medium w-full flex items-center gap-2">
              Zaczęte: <USkeleton class="h-3 grow" />
            </span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
            <span class="font-medium w-full flex items-center gap-2">
              Kończy się: <USkeleton class="h-3 grow" />
            </span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
            <span class="font-medium w-full flex items-center gap-2">
              Do zakończenia: <USkeleton class="h-3 grow" />
            </span>
          </div>
        </div>

      </UCard>
    </div>
  </section>
</template>