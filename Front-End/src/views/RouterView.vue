<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
      <template #fallback>
        <h1>Loading...</h1>
      </template>
    </Suspense>
  </RouterView>
</template>
