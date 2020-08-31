<template lang="pug">
.lin-reg-full-model
  h1 HALLO {{ resolved }}
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

async function fakePromise(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 3000);
  });
}

export default defineComponent({
  name: "LinRegFullModel",
  async setup() {
    const resolved = ref("");
    resolved.value = await fakePromise();
    return { resolved };
  },
});
</script>

<style lang="sass" scoped>
.lin-reg-full-model

</style>