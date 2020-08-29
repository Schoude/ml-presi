<template lang="pug">
.hello
  h1 {{ msg }}
  h3 {{ getMyState }}
  h3 {{ value }}
  h3 {{ helloWorldSetup.myCFunctionString.value }}
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import useHelloWorld from "./compositions/helloWorld";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  computed: {
    ...mapGetters(["getMyState"]),
    ...mapGetters("myModule", ["value"]),
  },
  setup() {
    const helloWorldSetup = useHelloWorld("TEST PARAM");

    return { helloWorldSetup };
  },
});
</script>

<style scoped lang="sass">
h3
  margin: 40px 0 0

ul
  list-style-type: none
  padding: 0

li
  display: inline-block
  margin: 0 10px

a
  color: #42b983
</style>
