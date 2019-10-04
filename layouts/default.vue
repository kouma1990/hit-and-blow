<template>
  <v-app dark>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
      title: 'Hit & Blow'
    }
  }
}
</script>

<style lang="scss">
.v-application,
.v-application .headline {
  font-family: 'mamelon' !important;
}
</style>
