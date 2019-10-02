<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-actions>
          <v-btn color="primary" @click="getUniqueStr">
            部屋作成
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="primary" @click="getUniqueStr">
            参加
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { mapGetters } from 'vuex'
import { db } from '~/plugins/firebase.js'

export default {
  computed: {
    ...mapGetters({ room: 'room/getRoom' })
  },
  created() {
    this.$store.dispatch('room/setRoomRef', db.collection('rooms'))
  },
  methods: {
    getUniqueStr() {
      const strong = 100000
      const randStr = Math.floor(strong * Math.random()).toString(16)
      const id = new Date().getTime().toString(16) + randStr
      return id
    }
  }
}
</script>
