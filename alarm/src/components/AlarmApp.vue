<template>
  <div class="alarm-app">
    <h1>Alarm App</h1>
    <div>
      <q-input
        label="Set Alarm Date"
        placeholder="YYYY-MM-DD"
        filled
        v-model="alarmDate"
        mask="date"
        :rules="['date']"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="alarmDate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        filled
        placeholder="HH:MM"
        label="Set Alarm Time"
        v-model="alarmTime"
        mask="fulltime"
        :rules="['fulltime']"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="alarmTime" with-seconds format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <q-btn @click="setAlarm" label="Set Alarm" color="primary" />
    <p class="q-mt-md" v-if="alarmSet">Alarm set for: {{ alarmDate }} {{ alarmTime }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const alarmDate = ref('')
const alarmTime = ref('')
const alarmSet = ref(false)

function setAlarm() {
  if (alarmDate.value && alarmTime.value) {
    const year = alarmDate.value.split('/')[0]
    const month = alarmDate.value.split('/')[1]
    const day = alarmDate.value.split('/')[2]
    const hours = alarmTime.value.split(':')[0]
    const minutes = alarmTime.value.split(':')[1]
    const seconds = alarmTime.value.split(':')[2]
    const alarmDateTime = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)

    alarmSet.value = true
    // alert('Alarm set for:' + alarmDateTime)
    window.electron.scheduleNotification(alarmDateTime)
  }
}
</script>

<style scoped>
.alarm-app {
  text-align: center;
}
</style>
