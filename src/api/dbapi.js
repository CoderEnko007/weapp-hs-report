import utils from '@/utils'
import tableID from '@/api/config'
import store from '@/store'

export function checkUserByOpenID(id) {
  let user = new wx.BaaS.User()
  let query = new wx.BaaS.Query()
  query.compare('openid', '=', id)
  return user.setQuery(query).find()
}

export function getRankData(time, mode, limit=20, orderBy='name') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.rankTableID)
    let query = new wx.BaaS.Query()
    query.compare('report_time', '=', time)
    if (mode) {
      query.compare('mode', '=', mode)
    }
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).find().then(res => {
      if (!res.data.object) {
        let query = new wx.BaaS.Query()
        query.isNotNull('name')
        tableObj.setQuery(query).orderBy(orderBy).limit(limit).find().then(res => {
          let result = {
            date: res.data.objects[0].report_time,
            list: res.data.objects
          }
          resolve(result)
        }, err => {
          reject(err)
        })
      } else {
        let result = {
          date: res.data.objects[0].get('report_time'),
          list: res.data.objects
        }
        resolve(result)
      }
    }, err => {
      reject(err)
    })
  })
}

export function getSeriesData(mode, limit=20, orderBy='-setId') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.seriesTableID)
    let query = new wx.BaaS.Query()
    if (mode) {
      query.compare('mode', '=', mode)
    }
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).find().then(res => {
      resolve(res.data.objects)
    }, err => {
      reject(err)
    })
  })
}

export function getCardsList(params, limit=20, page=0, orderBy='cost') {
  //search, mode, cost, cardClass, rarity, type, mechanics, setId, race, ename, page=1, limit=20, orderBy='cost'
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.cardsTableID)
    let removeHeroQuery = new wx.BaaS.Query()
    removeHeroQuery.isNotNull('artist')
    let costQuery = new wx.BaaS.Query()
    if (params.cost) {
      if (params.cost<7) {
        costQuery.compare('cost', '=', params.cost)
      } else {
        costQuery.compare('cost', '>=', params.cost)
      }
    }
    let factionQuery = new wx.BaaS.Query()
    if (params.faction && params.faction.id !== 'all') {
      factionQuery.compare('cardClass', '=', params.faction.id)
    }
    let modeQuery = new wx.BaaS.Query()
    if (params.mode && params.mode.id !== 'all') {
      let temp = []
      if (params.mode.id === utils.mode[1].id) {
        // 标准模式
        for (let item of store.state.cards.series) {
          if (item.mode === utils.mode[1].id) {
            temp.push(item.id)
          }
        }
        modeQuery.in('set_id', temp)
      } else if (params.mode.id === utils.mode[2].id) {
        // 狂野模式
        // let wildSetQuery = new wx.BaaS.Query()
        // for (let item of store.state.cards.series) {
        //   if (item.mode === utils.mode[2].id) {
        //     temp.push(item.id)
        //   }
        // }
        // wildSetQuery.in('set_id', temp)
        // let nullSetQuery = new wx.BaaS.Query()
        // nullSetQuery.isNull('set_id')
        // modeQuery = wx.BaaS.Query.or(wildSetQuery, nullSetQuery)
      }
    }
    let rarityQuery = new wx.BaaS.Query()
    if (params.rarity && params.rarity.id !== 'all') {
      rarityQuery.compare('rarity', '=', params.rarity.id.toUpperCase())
    }
    let seriesQuery = new wx.BaaS.Query()
    if (params.series && params.series.id !== 'all') {
      seriesQuery.compare('set_id', '=', params.series.id)
    }
    let searchQuery = new wx.BaaS.Query()
    if (params.search) {
      let nameQuery = new wx.BaaS.Query()
      nameQuery.contains('name', params.search)
      let raceQuery = new wx.BaaS.Query()
      for (let item in utils.race) {
        if(utils.race.hasOwnProperty(item)) {
          if (utils.race[item].name === params.search) {
            raceQuery.compare('race', '=', item)
          }
        }
      }
      let otherQuery = new wx.BaaS.Query()
      otherQuery.contains('text', params.search)
      searchQuery = wx.BaaS.Query.or(nameQuery, raceQuery, otherQuery)
    }
    let query = wx.BaaS.Query.and(removeHeroQuery, costQuery, factionQuery, modeQuery, rarityQuery, seriesQuery, searchQuery)
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getCardDetail(id) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.cardsTableID)
    let query = new wx.BaaS.Query()
    query.compare('dbfId', '=', id)
    tableObj.setQuery(query).find().then(res => {
      resolve(res.data.objects)
    }, err => {
      reject(err)
    })
  })
}

export function getWinRateData(params, orderBy='games') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.winrateTableID)
    let factionQuery = new wx.BaaS.Query()
    if (params.faction) {
      factionQuery.compare('faction', '=', params.faction)
    }
    tableObj.setQuery(factionQuery).orderBy(orderBy).find().then(res => {
      resolve(res.data.objects)
    }, err => {
      reject(err)
    })
  })
}
