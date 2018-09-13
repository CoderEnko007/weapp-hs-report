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

const faction = [
  {id: 'druid', name: '德鲁伊'},
  {id: 'hunter', name: '猎人'},
  {id: 'mage', name: '法师'},
  {id: 'paladin', name: '圣骑士'},
  {id: 'priest', name: '牧师'},
  {id: 'rogue', name: '潜行者'},
  {id: 'shaman', name: '萨满'},
  {id: 'warlock', name: '术士'},
  {id: 'warrior', name: '战士'}
]

const mode = [
  {id: 'standard', name: '标准模式'},
  {id: 'wild', name: '狂野模式'},
]

const rarity = [
  {id: 'free', name: '免费'},
  {id: 'common', name: '普通'},
  {id: 'rare', name: '稀有'},
  {id: 'epic', name: '史诗'},
  {id: 'legend', name: '传说'}
]

export default {
  formatNumber,
  formatTime,
  formatNowTime,
  faction,
  mode,
  rarity
}
