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
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}
