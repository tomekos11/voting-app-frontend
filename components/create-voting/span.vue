<template>
  <div>
    <UFormField label="Czas rozpoczęcia" name="startTime" required help="Przed wybranym czasem, użytkownicy nie będą mogli oddać swojego głosu. Będą natomiast mogli zapoznać się ze szczegółami głosowania.">
      <UInput v-model="startTime" type="datetime-local" />
    </UFormField>
      
    <USeparator class="my-3" />

    <UFormField label="Czas zakończenia" name="endTime" required help="Po upłnięciu tej daty, użytkownicy nie będą mogli oddać swojego głosu. Po tej dacie użytkownicy mogą sprawdzić rezultaty głosowania.">
      <UInput v-model="endTime" type="datetime-local" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
const startTime = defineModel<string>('startTime', {
  required: true
});

const endTime = defineModel<string>('endTime', {
  required: true
});

</script>