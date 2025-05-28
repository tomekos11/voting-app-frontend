<template>
  <div class="min-h-screen flex flex-col">
    <custom-navigation />
    
    <main class="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex-grow">
      <slot />
    </main>

    <custom-footer />
  </div>
</template>