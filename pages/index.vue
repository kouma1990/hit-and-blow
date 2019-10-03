<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <div v-if="room">
          <div>
            {{ room.id }}
            {{ room.status }}
            {{ room.status == 'waiting' }}
            {{ number }}
          </div>
          <div>
            <v-btn
              v-for="(_, idx) in 10"
              :key="'number-key-' + idx"
              color="indigo"
              :disabled="number.length > 3 || number.includes(idx)"
              @click="addNumber(String(idx))"
            >
              {{ idx }}
            </v-btn>
          </div>
          <div>
            <v-btn color="indigo" @click="deleteNumber">back</v-btn>
            <v-btn color="indigo" :disabled="number.length !== 4" @click="send"
              >send</v-btn
            >
          </div>
        </div>
        <div v-else>
          <v-card-actions>
            <v-btn color="primary" @click="createRoom">
              部屋作成
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-text-field
              v-model="joinId"
              label="Outlined"
              outlined
            ></v-text-field>
            <v-btn color="primary" @click="joinRoom">
              参加
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { mapGetters } from 'vuex'
import firebase from 'firebase'
import { db } from '~/plugins/firebase.js'

export default {
  data() {
    return {
      user: 0,
      joinId: '',
      number: ''
    }
  },
  computed: {
    ...mapGetters({ room: 'room/getRoom' })
  },
  methods: {
    addNumber(num) {
      this.number += num
    },
    deleteNumber() {
      this.number = this.number.slice(0, -1)
    },
    send() {
      if (this.number.length !== 4) {
        return null
      }
    },
    createRoom() {
      const id = this.getUniqueStr()
      db.collection('rooms')
        .doc(id)
        .set({
          created_at: firebase.firestore.Timestamp.fromDate(new Date()),
          status: 'waiting'
        })

      this.$store.dispatch('room/setRoomRef', db.collection('rooms').doc(id))
      this.user = 1
    },
    async joinRoom() {
      await this.$store.dispatch(
        'room/setRoomRef',
        db.collection('rooms').doc(this.joinId)
      )

      if (this.room.status === 'waiting') {
        db.collection('rooms')
          .doc(this.room.id)
          .update({ status: 'start' })
      }
    },
    getUniqueStr() {
      const strong = 100000
      const randStr = Math.floor(strong * Math.random()).toString(16)
      const id = new Date().getTime().toString(16) + randStr
      return id
    }
  }
}
</script>
