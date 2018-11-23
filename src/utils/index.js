const adsOpenFlag = true

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

  // return `${t1} ${t2}`
  return year+'年'+formatNumber(month)+'月'+formatNumber(day)+'日'
}

export function formatNowTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const time = [year, month, day].map(formatNumber).join('-')

  return `${time}`
}

export function ShadeColor(colorMAX,colorMIN,num){
  colorMAX=colorMAX.toLowerCase();
  colorMIN=colorMIN.toLowerCase();
  let RegHex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(RegHex.test(colorMAX)&&/^rgb/.test(colorMAX)){
    colorMAX="rgb(221,221,221)"
  }else if(RegHex.test(colorMIN)&&/^rgb/.test(colorMIN)){
    colorMIN="rgb(116,116,116)"
  }
  if(RegHex.test(colorMAX)){
    colorMAX=colorMAX.colorRgb()
  }
  if(RegHex.test(colorMIN)){
    colorMIN=colorMIN.colorRgb()
  }

  colorMAX=colorMAX.slice(4,-1).split(",")
  colorMIN=colorMIN.slice(4,-1).split(",")
  console.log(colorMIN);
  let colors= [];
  //默认的最深颜色
  let red = colorMAX[0]-0,green = colorMAX[1]-0, blue = colorMAX[2]-0;
  //最浅颜色是239,239,239 比如：最浅颜色的red是 239 则差值为239-134=105
  let maxRed = colorMIN[0]-0,maxGreen = colorMIN[1]-0,maxBlue = colorMIN[2]-0;
  let level = num;
  while(level--) {
    colors.push( 'rgb('+red +','+green+','+blue+')');
    red += parseInt(maxRed/num);
    green += parseInt(maxGreen/num);
    blue += parseInt(maxBlue/num);
  }
  return colors;
}

const cardsBaseURL = 'https://art.hearthstonejson.com/v1/render/latest/zhCN/256x/'
const cardsBaseURL512 = 'https://art.hearthstonejson.com/v1/render/latest/zhCN/512x/'
const cardsTileURL = 'https://art.hearthstonejson.com/v1/tiles/'
const cardsOrigURL = 'https://art.hearthstonejson.com/v1/256x/'
const dustImage = 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g2xiBmlyPDaVLks.png'

export function genCardsImageURL(hsId) {
  return cardsBaseURL+hsId+'.png'
}
export function gen512CardsImageURL(hsId) {
  return cardsBaseURL512+hsId+'.png'
}
export function genOrigImageURL(hsId) {
  return cardsOrigURL+hsId+'.jpg'
}
export function genTileImageURL(hsId) {
  return cardsTileURL+hsId+'.png'
}
export const getComponentByTag = (parent, tag) => {
  for (let c of parent.$children) {
    if (c.$options._componentTag === tag) {
      return c
    }
  }
}
export function translateDeckName(decksList, decksName) {
  for (let index in decksList) {
    if (decksList.hasOwnProperty(index)) {
      let temp = decksName.filter(item => {
        return item.ename === decksList[index].deck_name
      })
      if (temp[0] && temp[0].cname) {
        decksList[index].cname = temp[0].cname
      } else {
        decksList[index].cname = decksList[index].deck_name
      }
    }
  }
  return decksList
}

const faction = {
  'Druid': { name: '德鲁伊', shortName: '德', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFc20lKfIhjC.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpltcxS8QuoF.png', image: '/static/heroIcons/druid.png', image1: '/static/heroIcons/druid-1.jpg', image2: '/static/heroIcons/druid-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jbHYTxXEHZT.png' },
  'Hunter': { name: '猎人', shortName: '猎', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFgjRrvyMTUs.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpssc3FfPpb9.png', image: '/static/heroIcons/hunter.png', image1: '/static/heroIcons/hunter-1.jpg', image2: '/static/heroIcons/hunter-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jHdZrCYiZiB.png' },
  'Mage': { name: '法师', shortName: '法', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaNBmsQn1UY6Z.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpZZbM5Wg2rZ.png', image: '/static/heroIcons/mage.png', image1: '/static/heroIcons/mage-1.jpg', image2: '/static/heroIcons/mage-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jAjReEqnPWw.png' },
  'Paladin': { name: '圣骑士', shortName: '骑', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFUHziUqK4kL.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpNrmopXuBrw.png', image: '/static/heroIcons/paladin.png', image1: '/static/heroIcons/paladin-1.jpg', image2: '/static/heroIcons/paladin-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jmzEBqiaOAm.png' },
  'Priest': { name: '牧师', shortName: '牧', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFIo6rAizi9c.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEp0ZaS5tmS0t.png', image: '/static/heroIcons/priest.png', image1: '/static/heroIcons/priest-1.jpg', image2: '/static/heroIcons/priest-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jWqcYCRHuMK.png' },
  'Rogue': { name: '潜行者', shortName: '贼', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFaOXMWKfYI6.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpmjMvZ0t7Va.png', image: '/static/heroIcons/rogue.png', image1: '/static/heroIcons/rogue-1.jpg', image2: '/static/heroIcons/rogue-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jrIogSSyDse.png' },
  'Shaman': { name: '萨满', shortName: '萨', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFo845cbDc3f.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpVruPt5OpaH.png', image: '/static/heroIcons/shaman.png', image1: '/static/heroIcons/shaman-1.jpg', image2: '/static/heroIcons/shaman-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jMNbWFmTvqa.png' },
  'Warlock': { name: '术士', shortName: '术', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFLBpAfNQ9Z3.jpg',bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEpATFeYS3XPb.png', image: '/static/heroIcons/warlock.png', image1: '/static/heroIcons/warlock-1.jpg', image2: '/static/heroIcons/warlock-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jhkIYpkPlEM.png' },
  'Warrior': { name: '战士', shortName: '战', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFdMDI6ZB2X1.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCgEp4aLjlesJNW.png', image: '/static/heroIcons/warrior.png', image1: '/static/heroIcons/warrior-1.jpg', image2: '/static/heroIcons/warrior-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jlljaMZFJFc.png' }
}

const mode = [
  {id: 'Standard', name: '标准模式'},
  {id: 'Wild', name: '狂野模式'},
]

const rarity = {
  'free': {name: '基础', color: '#5e5e5e'},
  'common': {name: '普通', color: '#5e5e5e'},
  'rare': {name: '稀有', color: '#1768c6'},
  'epic': {name: '史诗', color: '#705dc7'},
  'legendary': {name: '传说', color: '#f5a623'}
}

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

const gameMode = [
  {mode: 'standard', icon: '/static/icons-v2/standard.png', active_icon: '/static/icons-v2/standard_active.png', text: '标准'},
  {mode: 'wild', icon: '/static/icons-v2/wild.png', active_icon: '/static/icons-v2/wild_active.png', text: '狂野'},
  {mode: 'arena', icon: '/static/icons-v2/arena.png', active_icon: '/static/icons-v2/arena_active.png', text: '竞技场'}
]

const rankMode = [
  {mode: 'Standard', icon: '/static/icons-v2/standard.png', active_icon: '/static/icons-v2/standard_active.png', text: '标准'},
  {mode: 'Wild', icon: '/static/icons-v2/wild.png', active_icon: '/static/icons-v2/wild_active.png', text: '狂野'},
]

const factionColors = ['#ff7d0a', '#abd473', '#69ccf0', '#f58cba', '#ccc', '#fff569', '#0070de', '#9482c9', '#c79c6e']

export default {
  adsOpenFlag,
  formatNumber,
  formatTime,
  formatNowTime,
  genCardsImageURL,
  getComponentByTag,
  translateDeckName,
  faction,
  mode,
  rarity,
  type,
  race,
  factionColors,
  image: {
    dustImage
  },
  gameMode,
  rankMode
}
