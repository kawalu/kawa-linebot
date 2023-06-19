// 引用 dotenv 讀取 .env
import 'dotenv/config'
// 引用 linebot
import linebot from 'linebot'
import axios from 'axios'
import template from './templates/parkinglot.js'
import writeJSON from './utils/writeJSON.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const { data } = await axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json')
      for (const info of data.data.park) {
        if (info.address.includes(event.message.text)) {
          const bubble = JSON.parse(JSON.stringify(template))
          bubble.body.contents[0].text = info.name
          bubble.body.contents[1].contents[0].contents[1].text = info.address
          bubble.body.contents[1].contents[1].contents[1].text = info.summary
          
          const result = event.reply(
            {
              type: 'flex',
              altText: 'bubble',
              contents: bubble
            }
          )

          writeJSON(bubble, 'bubble')

          if (result.message) {
            throw new Error(result.message)
          }
          return
        }
      }
      event.reply('找不到')
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
