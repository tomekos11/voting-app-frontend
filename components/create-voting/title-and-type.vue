<template>
  <div>
    <UFormField label="Tytuł głosowania" name="title" required help="Tytuł głosowania będzie pokazany wszystkim użytkownikom">
      <UInput v-model="title" placeholder="Wybierz prezesa spółki" />
    </UFormField>

    <USeparator class="my-3" />

    <UFormField label="Typ głosowania" name="votingType" required description="Typ głosowania ma wpływ na to w jaki sposób i kiedy użytkownicy będą mogli podejrzeć wyniki głosowania.">
      <USelect
        v-model:model-value="votingType"
        :items="[
          { value: 0, label: 'Publiczne' },
          { value: 1, label: 'Prywatne' }
        ]"

        value-key="value"
        label-key="label"
      />

      <template #help>
        <ul class="mt-2 space-y-1">
          <li class="flex items-center gap-2">
            <div class="text-primary text-lg flex justify-center items-center">
              <UIcon name="i-lucide-badge-check" />
            </div>
            <div>
              <b class="text-primary">Głosowanie publiczne</b> oznacza, że wyniki można podejrzeć w każdym momencie trwania głosowania
            </div>
          </li>

          <li class="flex items-center gap-2">
            <div class="text-primary text-lg flex justify-center items-center">
              <UIcon name="i-lucide-badge-check" />
            </div>
            <div>
              <b class="text-primary">Głosowanie prywatne</b> oznacza, że wyniki można sprawdzić dopiero po zakończeniu czasu trwania głosowania.
            </div>
          </li>
        </ul>
      </template>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
const title = defineModel<string>('title', {
  required: true
});

const votingType = defineModel<0 | 1>('votingType', {
  required: true
});

</script>