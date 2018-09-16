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
const cardsBaseURL512 = 'https://art.hearthstonejson.com/v1/render/latest/zhCN/512x/'
const cardsTileURL = 'https://art.hearthstonejson.com/v1/tiles/'
const cardsOrigURL = 'https://art.hearthstonejson.com/v1/256x/'

export function genCardsImageURL(hsId) {
  return cardsBaseURL+hsId+'.png'
}
export function gen512CardsImageURL(hsId) {
  return cardsBaseURL512+hsId+'.png'
}
export function genOrigImageURL(hsId) {
  return cardsOrigURL+hsId+'.jpg'
}
// const faction = [
//   {id: 'Druid', name: '德鲁伊', image: '/static/heroIcons/druid'},
//   {id: 'Hunter', name: '猎人', image: '/static/heroIcons/hunter'},
//   {id: 'Mage', name: '法师', image: '/static/heroIcons/mage'},
//   {id: 'Paladin', name: '圣骑士', image: '/static/heroIcons/paladin'},
//   {id: 'Priest', name: '牧师', image: '/static/heroIcons/priest'},
//   {id: 'Rogue', name: '潜行者', image: '/static/heroIcons/rogue'},
//   {id: 'Shaman', name: '萨满', image: '/static/heroIcons/shaman'},
//   {id: 'Warlock', name: '术士', image: '/static/heroIcons/warlock'},
//   {id: 'Warrior', name: '战士', image: '/static/heroIcons/warrior'}
// ]
const faction = {
  'Druid': { name: '德鲁伊', image: '/static/heroIcons/druid.png', image1: '/static/heroIcons/druid-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jbHYTxXEHZT.png' },
  'Hunter': { name: '猎人', image: '/static/heroIcons/hunter.png', image1: '/static/heroIcons/hunter-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jHdZrCYiZiB.png' },
  'Mage': { name: '法师', image: '/static/heroIcons/mage.png', image1: '/static/heroIcons/mage-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jAjReEqnPWw.png' },
  'Paladin': { name: '圣骑士', image: '/static/heroIcons/paladin.png', image1: '/static/heroIcons/paladin-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jmzEBqiaOAm.png' },
  'Priest': { name: '牧师', image: '/static/heroIcons/priest.png', image1: '/static/heroIcons/priest-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jWqcYCRHuMK.png' },
  'Rogue': { name: '潜行者', image: '/static/heroIcons/rogue.png', image1: '/static/heroIcons/rogue-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jrIogSSyDse.png' },
  'Shaman': { name: '萨满', image: '/static/heroIcons/shaman.png', image1: '/static/heroIcons/shaman-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jMNbWFmTvqa.png' },
  'Warlock': { name: '术士', image: '/static/heroIcons/warlock.png', image1: '/static/heroIcons/warlock-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jhkIYpkPlEM.png' },
  'Warrior': { name: '战士', image: '/static/heroIcons/warrior.png', image1: '/static/heroIcons/warrior-1.png', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jlljaMZFJFc.png' }
}

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

const type = {
  'MINION': {name: '随从'},
  'SPELL': {name: '法术'},
  'WEAPON': {name: '武器'},
  'HERO': {name: '英雄'},
}

const race = {
  'DRAGON': {name: '龙'},
  'DEMON': {name: '恶魔'},
  'PIRATE': {name: '海盗'},
  'BEAST': {name: '野兽'},
  'TOTEM': {name: '图腾'},
  'MURLOC': {name: '鱼人'},
  'ELEMENTAL': {name: '元素'},
  'MECHANICAL': {name: '机械'}
}

export default {
  formatNumber,
  formatTime,
  formatNowTime,
  genCardsImageURL,
  faction,
  mode,
  rarity,
  type,
  race
}
