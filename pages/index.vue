<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <div v-if="room">
          <div>
            {{ room.id }}
            {{ user }}
            {{ room.status }}
            {{ number }}<br />
            {{ room.number1 }}
            {{ room.number2 }}
          </div>
          <div>
            <v-btn
              v-for="(_, idx) in 10"
              :key="'number-key-' + idx"
              color="indigo"
              :disabled="number.length > 3 || number.includes(idx) || !room.status.includes(user)"
              @click="addNumber(String(idx))"
            >
              {{ idx }}
            </v-btn>
          </div>
          <div>
            <v-btn color="indigo" @click="deleteNumber">back</v-btn>
            <v-btn color="indigo" :disabled="number.length !== 4 || !room.status.includes(user)" @click="send">send</v-btn>

            <v-btn @click="user = 1">1</v-btn>
            <v-btn @click="user = 2">2</v-btn>
          </div>
        </div>
        <div v-else>
          <v-card-actions>
            <v-btn color="primary" @click="createRoom">
              部屋作成
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-text-field v-model="joinId" label="Outlined" outlined></v-text-field>
            <v-btn color="primary" @click="joinRoom">
              参加
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
      <v-row v-if="room">
        <guess-list :key="'guess1'" :guess-list="room.guess1" />
        <guess-list :key="'guess2'" :guess-list="room.guess2" />
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { mapGetters } from 'vuex'
import firebase from 'firebase'
import { db } from '~/plugins/firebase.js'
import GuessList from '~/components/GuessList.vue'

export default {
  components: {
    GuessList
  },
  data() {
    return {
      user: 0,
      joinId: '',
      number: '',
      guess: []
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

      const number = this.number
      this.number = ''

      if (this.room.status === 'select1') {
        return this.updateRoom({ status: 'select2', number1: number })
      }
      if (this.room.status === 'select2') {
        return this.updateRoom({ status: 'guess1', number2: number })
      }

      // guess
      const judgement = [2, 2]
      this.guess.push({ number, judgement })
      if (this.room.status === 'guess1') {
        return this.updateRoom({ status: 'guess2', guess1: this.guess })
      }

      if (this.room.status === 'guess2') {
        return this.updateRoom({ status: 'guess1', guess2: this.guess })
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
      await this.$store.dispatch('room/setRoomRef', db.collection('rooms').doc(this.joinId))

      if (this.room.status === 'waiting') {
        this.updateRoom({ status: 'select1' })
        this.user = 2
      }
    },
    getUniqueStr() {
      const strong = 100000
      const randStr = Math.floor(strong * Math.random()).toString(16)
      const id = new Date().getTime().toString(16) + randStr
      return id
    },
    updateRoom(data) {
      db.collection('rooms')
        .doc(this.room.id)
        .update(data)
    }
  }
}
</script>
