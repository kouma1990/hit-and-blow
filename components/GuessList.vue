<template>
  <v-col>
    <v-card>
      <v-list dense>
        <v-list-item v-for="(guess, idx) in guessList" :key="key + '-' + idx">
          <v-list-item-content>{{ guess.number }}</v-list-item-content>
          <v-list-item-content> {{ guess.judgement[0] }} Hit {{ guess.judgement[1] }} blow </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-col>
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
    key: {
      type: String,
      default: 'guess'
    }
  }
}
</script>
