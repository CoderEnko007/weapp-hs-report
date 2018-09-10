export function login() {
  return wx.BaaS.login(false)
}

export function getUserInfo(data) {
  return wx.BaaS.handleUserInfo(data.mp)
}

export function logout() {
  return wx.BaaS.logout()
}
