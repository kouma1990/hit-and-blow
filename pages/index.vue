<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div v-if="room">
        <div>
          部屋ID：{{ room.id }} <br />
          <div :class="'c' + user + '--text'" class="headline text-center mt-6">あなたはプレイヤー{{ user }}です</div>
          <v-alert :color="'c' + user" dense style="border-radius: 25px" class="headline text-center mt-6">出題ラウンド</v-alert>
          <div class="">
            あなたの設定ナンバー： {{ enemy }}
            {{ user === 1 ? room.number1 : room.number2 }}
          </div>

          <div v-if="room.status.includes('select') && room.status.slice(-1) !== String(user)">相手がナンバーを設定中です。</div>
          <div v-if="room.status.includes('guess') && room.status.slice(-1) !== String(user)">相手がナンバーを予想中です。</div>
        </div>
        <div>
          <v-btn
            v-for="(_, idx) in 10"
            :key="'number-key-' + idx"
            class="mx-2 subtitle-1"
            :color="'c' + user"
            fab
            small
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
        <div>入力中： {{ number }}</div>
      </div>
      <div v-else>
        <v-card-actions>
          <v-btn color="primary" class="mt-5" @click="createRoom">
            部屋作成
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-text-field v-model="joinId" class="pt-6 mr-2" label="部屋ID" dense outlined></v-text-field>
          <v-btn color="primary" @click="joinRoom">
            参加
          </v-btn>
        </v-card-actions>
      </div>
      <v-row v-if="room">
        <v-col>
          <v-card>
            <v-card-title>プレイヤー1の予想</v-card-title>
            <guess-list :key-name="'guess1'" :guess-list="room.guess1" />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>プレイヤー2の予想</v-card-title>
            <guess-list :key-name="'guess2'" :guess-list="room.guess2" />
          </v-card>
        </v-col>
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
    ...mapGetters({ room: 'room/getRoom' }),
    enemy() {
      return 3 - this.user
    }
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
      if (this.room.status === 'guess1') {
        const judgement = this.judge(this.room.number2, number)
        this.guess.push({ number, judgement })
        return this.updateRoom({ status: 'guess2', guess1: this.guess })
      }

      if (this.room.status === 'guess2') {
        const judgement = this.judge(this.room.number1, number)
        this.guess.push({ number, judgement })
        return this.updateRoom({ status: 'guess1', guess2: this.guess })
      }
    },
    judge(num1, num2) {
      let hit = 0
      let blow = 0
      for (let i = 0; i < 4; i++) {
        if (i === num1.indexOf(num2[i])) {
          hit += 1
        } else if (num1.includes(num2[i])) {
          blow += 1
        }
      }
      return [hit, blow]
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
