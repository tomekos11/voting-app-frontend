<template>
  <div class="min-h-screen flex flex-col">
    <custom-navigation />
    
    <main
      class="
        bg-gradient-to-br
        from-slate-100 via-slate-200 to-cyan-100
        dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950
        flex-grow
      "
    >
      <slot />
    </main>

    <custom-footer />
  </div>
</template>
