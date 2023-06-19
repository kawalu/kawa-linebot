import fs from 'fs'

/**
 * @param {string} data - 資料陣列或物件
 * @param {string} file - 印出的 json 檔名
 */
export default (data, file) => {
    if (process.env.DUMP !== 'true') return

    if (!fs.existsSync('./dump')) {
        fs.mkdirSync('./dump')
    }
    fs.writeFileSync(`./dump/${file}.json`, JSON.stringify(data, null, 2))
}
