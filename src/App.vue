<template lang="pug">
#app
  #nav
    router-link(to="/") Intro
    router-link(to="/linreg") Linear Regression
    router-link(to="/logreg") Logistic Regression
    router-link(to="/cat") Categorization
  router-view.view
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
});
</script>

<style lang="sass">
@import './sass/_variables'

#nav
  display: flex
  height: 56px
  padding: 0 16px
  align-items: center
  background-color: $color-nav-background
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2)
  font-size: 18px

  a
    color: white
    margin-right: 20px

    &:last-child
      margin-right: 0

    &:hover
      color: lighten($color-tfjs, 15)

    &.router-link-exact-active
      color: $color-tfjs

.view
  padding: 0 24px
</style>
