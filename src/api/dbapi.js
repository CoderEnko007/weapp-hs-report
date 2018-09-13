import tableID from '@/api/config'

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

export function getSeriesData(mode, limit=20, orderBy='id') {
  return new Promise((resolve, reject) => {
    let tableObj = new wx.BaaS.TableObject(tableID.seriesTableID)
    let query = new wx.BaaS.Query()
    if (mode) {
      query.compare('mode', '=', mode)
    }
    tableObj.setQuery(query).orderBy(orderBy).limit(limit).find().then(res => {
      console.log(res.data.objects)
      resolve(result)
    }, err => {
      reject(err)
    })
  })
}
