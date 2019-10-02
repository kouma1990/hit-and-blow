import { firestoreAction } from 'vuexfire'

export const state = () => ({
  room: null
})

export const actions = {
  setRoomRef: firestoreAction(({ bindFirestoreRef }, ref) => {
    bindFirestoreRef('room', ref)
  })
}

export const getters = {
  getRoom: (state) => state.room
}
