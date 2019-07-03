import utils from '@/utils'
import tableID from '@/api/config'
import store from '@/store'

export function checkUserByOpenID(id) {
  let user = new wx.BaaS.User()
  let query = new wx.BaaS.Query()
  query.compare('openid', '=', id)
  return user.setQuery(query).find()
}

export function getRankData(time, mode, limit=20, orderBy='-win_rate') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.rankTableID)
    let query = new wx.BaaS.Query()
    query.compare('report_time', '=', time)
    if (mode) {
      query.compare('game_type', '=', mode)
    }
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).find().then(res => {
      if (!res.data.object) {
        let query = new wx.BaaS.Query()
        query.isNotNull('faction')
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

export function getSeriesData(mode, limit=20, orderBy='-order') {
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

export function getCardsList(params, limit=20, page=0, orderBy='-set_id') {
  //search, mode, cost, cardClass, rarity, type, mechanics, setId, race, ename, page=1, limit=20, orderBy='cost'
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.cardsTableID)
    let removeHeroQuery = new wx.BaaS.Query()
    removeHeroQuery.isNotNull('artist')
    let validQuery = new wx.BaaS.Query()
    validQuery.compare('invalid', '=', 0)
    let collectibleQuery = new wx.BaaS.Query()
    collectibleQuery.compare('collectible', '=', 1)
    let costQuery = new wx.BaaS.Query()
    if (params && params.cost!==null) {
      if (params.cost<7) {
        costQuery.compare('cost', '=', parseInt(params.cost))
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
    let typeQuery = new wx.BaaS.Query()
    if (params.type && params.type.id !== 'all') {
      typeQuery.compare('type', '=', params.type.id.toUpperCase())
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
      searchQuery = wx.BaaS.Query.or(nameQuery, otherQuery)
    }
    let query = wx.BaaS.Query.and(collectibleQuery, validQuery, costQuery, factionQuery, modeQuery, typeQuery, rarityQuery, seriesQuery, searchQuery)
    tableObj.setQuery(query).orderBy(['-set_id', 'cost']).limit(limit).offset(page*limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getArenaCards(params, tableid=tableID.arenaCardsTableID, limit=20, page=0, orderBy='-times_played') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableid)
    let costQuery = new wx.BaaS.Query()
    if (params && params.cost!==null) {
      if (params.cost<7) {
        costQuery.compare('cost', '=', parseInt(params.cost))
      } else {
        costQuery.compare('cost', '>=', params.cost)
      }
    }
    let classificationQuery = new wx.BaaS.Query()
    if (params.faction) {
      classificationQuery.compare('classification', '=', params.faction)
    }

    let searchQuery = new wx.BaaS.Query()
    if (params.search) {
      let nameQuery = new wx.BaaS.Query()
      nameQuery.contains('name', params.search)
      let otherQuery = new wx.BaaS.Query()
      otherQuery.contains('text', params.search)
      searchQuery = wx.BaaS.Query.or(nameQuery, otherQuery)
    }
    tableObj.limit(1).orderBy('-updated_at').find().then(res => {
      let latest_update_date = new Date(res.data.objects[0].updated_at*1000)
      let year = latest_update_date.getFullYear()
      let month = latest_update_date.getMonth()
      let day = latest_update_date.getDate()
      let queryDate = (new Date(year, month, day).getTime())/1000

      let dateQuery = new wx.BaaS.Query()
      dateQuery.compare('updated_at', '>=', queryDate)
      let query = wx.BaaS.Query.and(costQuery, classificationQuery, searchQuery, dateQuery)
      tableObj.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      })
    })
  })
}

export function getCardDetail(params) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.cardsTableID)
    let query = new wx.BaaS.Query()
    console.log(params)
    if (params.dbfId) {
      query.compare('dbfId', '=', params.dbfId)
    } else if (params.hsId) {
      query.compare('hsId', '=', params.hsId)
    } else {
      resolve()
    }
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
    let rankRange = new wx.BaaS.Query()
    if (params && params.rankRange) {
      rankRange.compare('rank_range', '=', params.rankRange)
    }
    let query = wx.BaaS.Query.and(factionQuery, rankRange)
    tableObj.setQuery(query).orderBy(orderBy).find().then(res => {
      resolve(res.data.objects)
    }, err => {
      reject(err)
    })
  })
}

export function getDeckName(params, limit=1000) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.deckNameTableID)
    let factionQuery = new wx.BaaS.Query()
    if (params && params.faction) {
      factionQuery.compare('faction', '=', params.faction)
    }
    tableObj.setQuery(factionQuery).limit(limit).find().then(res => {
      resolve(res.data.objects)
    }, err => {
      reject(err)
    })
  })
}

export function getDeckList(params, limit=20, page=0, orderBy='-game_count') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.standDecksTableID)
    if (params.mode && params.mode === 'Wild') {
      tableObj = new wx.BaaS.TableObject(tableID.wildDecksTableID)
    }
    let timeRangeQuery = new wx.BaaS.Query()
    if (params && params.last_30_days!==undefined) {
      // last_30_days为true是返回全部卡组，不做过滤
      if (!params.last_30_days) {
        timeRangeQuery.compare('last_30_days', '=', params.last_30_days)
      }
    }
    let modeQuery = new wx.BaaS.Query()
    if (params && params.mode) {
      modeQuery.compare('mode', '=', params.mode)
    }
    let factionQuery = new wx.BaaS.Query()
    if (params && params.faction) {
      factionQuery.compare('faction', '=', params.faction)
    }
    let archetypeQuery = new wx.BaaS.Query()
    if (params && params.archetype && params.archetype.toLowerCase() !== 'all') {
      archetypeQuery.compare('deck_name', '=', params.archetype)
    }
    let collectionQuery = new wx.BaaS.Query()
    if (params && params.collectList) {
      collectionQuery.in('deck_id', params.collectList)
    }
    let query = wx.BaaS.Query.and(timeRangeQuery, modeQuery, factionQuery, archetypeQuery, collectionQuery)
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getDeckDetail(params, trending_flag=false, collected=false ) {
  return new Promise((resolve, reject) => {
    let id
    if (trending_flag) {
      id = tableID.trendingTableID
    } else if (collected) {
      id = tableID.decksCollectionTableID
    } else {
      if (params.mode !== undefined && params.mode === 'Wild') {
        id = tableID.wildDecksTableID
      } else {
        id = tableID.standDecksTableID
      }
    }
    let tableObj = new wx.BaaS.TableObject(id)
    if (params && params.recordID) {
      tableObj.get(params.recordID).then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      })
    } else if (params && params.deckID) {
      let query = new wx.BaaS.Query()
      query.compare('deck_id', '=', params.deckID)
      tableObj.setQuery(query).find().then(res => {
        resolve(res.data.objects[0])
      }, err => {
        reject(err)
      })
    } else {
      reject('no data')
    }
  })
}

export function getArchetypeList(params, limit=1000, page=0, orderBy='-win_rate') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.tierTableID)
    let factionQuery = new wx.BaaS.Query()
    if (params && params.faction) {
      factionQuery.compare('faction', '=', params.faction)
    }
    let tierQuery = new wx.BaaS.Query()
    if (params && params.tier) {
      tierQuery.compare('tier', '=', params.tier)
    }
    let rankRange = new wx.BaaS.Query()
    if (params && params.rankRange) {
      rankRange.compare('rank_range', '=', params.rankRange)
    }
    let query = wx.BaaS.Query.and(factionQuery, tierQuery, rankRange)
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getArchetypeDetail(params) {
  return new Promise((resolve, reject) => {
    if (params && params.recordID) {
      let tableObj = new wx.BaaS.TableObject(tableID.tierTableID)
      tableObj.get(params.recordID).then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      })
    } else if (params && params.name) {
      let tableObj = new wx.BaaS.TableObject(tableID.archetypeTableID)
      let query = new wx.BaaS.Query()
      query.compare('archetype', '=', params.name)
      tableObj.setQuery(query).find().then(res => {
        resolve(res.data.objects[0])
      }, err => {
        reject(err)
      })
    } else {
      reject('no data')
    }
  })
}

export function getTrendingList(parmas, limit=20, page=0, orderBy='-win_rate') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.trendingTableID)
    let query = new wx.BaaS.Query()
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
      let result = {
        date: res.data.objects[0].create_time,
        list: res.data.objects
      }
      resolve(result)
    }, err => {
      reject(err)
    })
  })
}

export function getUserCollectionDecks(userID, limit=9999, page=0, orderBy='-created_at') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.decksCollectionTableID)
    let query = new wx.BaaS.Query()
    query.compare('user_id', '=', userID)
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function setUserCollection(data) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.decksCollectionTableID)
    let record = tableObj.create()
    if (data.deckDetail.write_perm) {
      delete data.deckDetail.write_perm
    }
    data.deckDetail.user_id = data.query.user_id
    data.deckDetail.dust_cost = data.deckDetail.dust_cost.toString()
    record.set(data.deckDetail).save().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function cancelUserCollection(data) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.decksCollectionTableID)
    let query = new wx.BaaS.Query()
    query.compare('user_id', '=', data.user_id)
    query.compare('id', '=', data.collection_id)
    tableObj.delete(query).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getBanners(limit=10, orderBy='index') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.bannerTableID)
    let query = new wx.BaaS.Query()
    query.isNotNull('name')
    query.compare('show', '=', true)
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getNotice() {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.noticeTableID)
    let query = new wx.BaaS.Query()
    tableObj.setQuery(query).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getAboutDescription() {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.aboutTableID)
    let query = new wx.BaaS.Query()
    query.compare('display', '=', true)
    tableObj.setQuery(query).orderBy('order').find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getSetting() {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.settingTableID)
    tableObj.find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getArenaConfig() {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.arenaConfigTableID)
    tableObj.find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getCustomerSetting(userID) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.customerSettingTableID)
    let userObj = new wx.BaaS.User()
    let query = new wx.BaaS.Query()
    query.compare('user', '=', userObj.getWithoutData(userID))
    tableObj.setQuery(query).expand('user').find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function addCustomerSetting(params, userID) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.customerSettingTableID)
    let user = new wx.BaaS.User().getWithoutData(userID)
    let record = tableObj.create()
    record.set('user', user)
    for (let param in params) {
      if (params.hasOwnProperty(param)) {
        record.set(param, params[param])
      }
    }
    record.save().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function updateCustomerSetting(params, recordID) {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.customerSettingTableID)
    let record = tableObj.getWithoutData(recordID)
    for (let param in params) {
      if (params.hasOwnProperty(param)) {
        record.set(param, params[param])
      }
    }
    record.update().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getArticleList(params, limit=10, page=0, orderBy='-created_at') {
  return new Promise((resolve, reject) => {
    let MyContentGroup = new wx.BaaS.ContentGroup(params.contentGroupID)
    let query = new wx.BaaS.Query()
    query.compare('show', '=', true)
    if (params && params.categoryID) {
      query.arrayContains('categories', [params.categoryID])
    }
    if (params && params.mainArticle) {
      query.isNull('main_article')
    }
    if (params && params.mainArticleId) {
      query.compare('main_article', '=', params.mainArticleId)
    }
    console.log('orderBy', orderBy)
    MyContentGroup.setQuery(query).orderBy(orderBy).limit(limit).offset(page*limit).find().then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

export function getArticleDetail(params) {
  console.log(params)
  return new Promise((resolve, reject) => {
    let MyContentGroup = new wx.BaaS.ContentGroup(params.groupID)
    MyContentGroup.getContent(params.contentID).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}
