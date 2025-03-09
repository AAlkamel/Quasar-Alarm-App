import { Notification } from 'electron'
import schedule from 'node-schedule/index.js'

export function scheduleNotification(dateTime) {
  schedule.scheduleJob(dateTime, function () {
    new Notification({
      title: 'Alarm',
      body: 'Your alarm is ringing!',
      sound: true,
    }).show()
  })
}
