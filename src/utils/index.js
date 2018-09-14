function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function formatNowTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const time = [year, month, day].map(formatNumber).join('-')

  return `${time}`
}

const cardsBaseURL = 'https://art.hearthstonejson.com/v1/render/latest/zhCN/256x/'
const cardsTileURL = 'https://art.hearthstonejson.com/v1/tiles/'

export function genCardsImageURL(hsId) {
  return cardsBaseURL+hsId+'.png'
}
const faction = [
  {id: 'Druid', name: '德鲁伊'},
  {id: 'Hunter', name: '猎人'},
  {id: 'Mage', name: '法师'},
  {id: 'Paladin', name: '圣骑士'},
  {id: 'Priest', name: '牧师'},
  {id: 'Rogue', name: '潜行者'},
  {id: 'Shaman', name: '萨满'},
  {id: 'Warlock', name: '术士'},
  {id: 'Warrior', name: '战士'}
]

const mode = [
  {id: 'Standard', name: '标准模式'},
  {id: 'Wild', name: '狂野模式'},
]

const rarity = [
  {id: 'free', name: '免费'},
  {id: 'common', name: '普通'},
  {id: 'rare', name: '稀有'},
  {id: 'epic', name: '史诗'},
  {id: 'legendary', name: '传说'}
]

export default {
  formatNumber,
  formatTime,
  formatNowTime,
  genCardsImageURL,
  faction,
  mode,
  rarity
}
