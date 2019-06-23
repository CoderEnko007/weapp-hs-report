import md5 from 'js-md5';
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

export function getCardPicture(_this, id, golden, fbigameFlag, version, key) {
  if (!fbigameFlag) {
    return gen512CardsImageURL(id)
  }
  // const version = 'v9'
  // const key = "Fbigame"
  const now = new Date()
  const baseURL = "https://res.fbigame.com"
  let time = [now.getFullYear(), now.getMonth()+1, now.getDate()].join('-')
  let formatTime = new Date(time).getTime()/1000 + 365 * 24 * 60 * 60;
  let filename = ''
  if (golden) {
    filename = `/hs/${version}_premium/${id}_premium.png`
  } else {
    filename = `/hs/${version}/${id}.png`
  }
  let str = `${filename}-${formatTime}-0-0-${key}`
  let md5 = _this.$md5(str)
  let auth_key = `${formatTime}-0-0-${md5}`
  return `${baseURL}${filename}?auth_key=${auth_key}`
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
const iFanrCardsTileURL = 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/'
const cardsOrigURL = 'https://art.hearthstonejson.com/v1/256x/'
// const dustImage = 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g2xiBmlyPDaVLks.png'
const dustImage = '/static/icons-v2/dust.png'

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
export function iFanrTileImageURL(tile) {
  return iFanrCardsTileURL+tile
}
export function deckModeImg(mode) {
  if (mode.toLowerCase() === 'standard') {
    return '/static/icons-v2/standard_dragon_1.png'
  } else if (mode.toLowerCase() === 'wild') {
    return '/static/icons-v2/wild_1.png'
  } else {
    return ''
  }
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

export function getImageInfoAsync(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/*
// startColor：开始颜色hex
// endColor：结束颜色hex
// step:几个阶级（几步）
*/
export function gradientColor(startColor,endColor,step){
  let startRGB = colorToRgb(startColor);//转换为rgb数组模式
  let startR = startRGB[0];
  let startG = startRGB[1];
  let startB = startRGB[2];

  let endRGB = colorToRgb(endColor);
  let endR = endRGB[0];
  let endG = endRGB[1];
  let endB = endRGB[2];

  let sR = (endR-startR)/step;//总差值
  let sG = (endG-startG)/step;
  let sB = (endB-startB)/step;

  let colorArr = [];
  for(let i=0;i<step;i++){
    //计算每一步的hex值
    let hex = colorToHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
    colorArr.push(hex);
  }
  return colorArr;
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
function colorToRgb(sColor){
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  sColor = sColor.toLowerCase();
  if(sColor && reg.test(sColor)){
    if(sColor.length === 4){
      let sColorNew = "#";
      for(let i=1; i<4; i+=1){
        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for(let i=1; i<7; i+=2){
      sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
    }
    return sColorChange;
  }else{
    return sColor;
  }
};

// 将rgb表示方式转换为hex表示方式
function colorToHex(rgb){
  let _this = rgb;
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(/^(rgb|RGB)/.test(_this)){
    let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
    let strHex = "#";
    for(let i=0; i<aColor.length; i++){
      let hex = Number(aColor[i]).toString(16);
      hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
      if(hex === "0"){
        hex += hex;
      }
      strHex += hex;
    }
    if(strHex.length !== 7){
      strHex = _this;
    }

    return strHex;
  }else if(reg.test(_this)){
    let aNum = _this.replace(/#/,"").split("");
    if(aNum.length === 6){
      return _this;
    }else if(aNum.length === 3){
      let numHex = "#";
      for(let i=0; i<aNum.length; i+=1){
        numHex += (aNum[i]+aNum[i]);
      }
      return numHex;
    }
  }else{
    return _this;
  }
}

function deepCopy(o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;

  } else if (o instanceof Object) {
    let n = {}
    for (let i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

const faction = {
  'Druid': { name: '德鲁伊', shortName: '德', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFc20lKfIhjC.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3sefMPt98jtBI.png', image: '/static/heroIcons/druid.png', image1: '/static/heroIcons/druid-1.jpg', image2: '/static/heroIcons/druid-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jbHYTxXEHZT.png' },
  'Hunter': { name: '猎人', shortName: '猎', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFgjRrvyMTUs.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3sehq2jqVVx4M.png', image: '/static/heroIcons/hunter.png', image1: '/static/heroIcons/hunter-1.jpg', image2: '/static/heroIcons/hunter-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jHdZrCYiZiB.png' },
  'Mage': { name: '法师', shortName: '法', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaNBmsQn1UY6Z.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3sepeTWxpekMe.png', image: '/static/heroIcons/mage.png', image1: '/static/heroIcons/mage-1.jpg', image2: '/static/heroIcons/mage-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jAjReEqnPWw.png' },
  'Paladin': { name: '圣骑士', shortName: '骑', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFUHziUqK4kL.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3seA9v7pRwUSU.png', image: '/static/heroIcons/paladin.png', image1: '/static/heroIcons/paladin-1.jpg', image2: '/static/heroIcons/paladin-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jmzEBqiaOAm.png' },
  'Priest': { name: '牧师', shortName: '牧', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFIo6rAizi9c.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3se9jjLZDxUoe.png', image: '/static/heroIcons/priest.png', image1: '/static/heroIcons/priest-1.jpg', image2: '/static/heroIcons/priest-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jWqcYCRHuMK.png' },
  'Rogue': { name: '潜行者', shortName: '贼', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFaOXMWKfYI6.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3seEDmyUXQe8E.png', image: '/static/heroIcons/rogue.png', image1: '/static/heroIcons/rogue-1.jpg', image2: '/static/heroIcons/rogue-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jrIogSSyDse.png' },
  'Shaman': { name: '萨满', shortName: '萨', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFo845cbDc3f.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3seyO6YKO9GRz.png', image: '/static/heroIcons/shaman.png', image1: '/static/heroIcons/shaman-1.jpg', image2: '/static/heroIcons/shaman-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jMNbWFmTvqa.png' },
  'Warlock': { name: '术士', shortName: '术', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFLBpAfNQ9Z3.jpg',bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3sek57kmcpcvH.png', image: '/static/heroIcons/warlock.png', image1: '/static/heroIcons/warlock-1.jpg', image2: '/static/heroIcons/warlock-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jhkIYpkPlEM.png' },
  'Warrior': { name: '战士', shortName: '战', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gCFaFdMDI6ZB2X1.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1hX3sefYCnvu9JML.png', image: '/static/heroIcons/warrior.png', image1: '/static/heroIcons/warrior-1.jpg', image2: '/static/heroIcons/warrior-2.jpg', deckIcon: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g1O4jlljaMZFJFc.png' }
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
  {mode: 'standard', icon: '/static/icons-v2/standard_dragon.png', active_icon: '/static/icons-v2/standard_dragon_active.png', text: '标准'},
  {mode: 'wild', icon: '/static/icons-v2/wild.png', active_icon: '/static/icons-v2/wild_active.png', text: '狂野'},
  {mode: 'arena', icon: '/static/icons-v2/arena.png', active_icon: '/static/icons-v2/arena_active.png', text: '竞技场'}
]

const rankMode = [
  {mode: 'Standard', icon: '/static/icons-v2/standard_dragon.png', active_icon: '/static/icons-v2/standard_dragon_active.png', text: '标准'},
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
  deckModeImg,
  getCardPicture,
  deepCopy,
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
