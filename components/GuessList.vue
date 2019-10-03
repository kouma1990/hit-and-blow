<template>
  <v-list dense :elevation="0">
    <v-list-item v-for="(guess, idx) in guessList" :key="keyName + '-' + idx">
      <v-list-item-content>{{ guess.number }}</v-list-item-content>
      <v-list-item-content> {{ guess.judgement[0] }} Hit {{ guess.judgement[1] }} blow </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    guessList: {
      type: Array,
      default() {
        return []
      }
    },
    keyName: {
      type: String,
      default: 'guess'
    }
  }
}
</script>
