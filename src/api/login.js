// export function login() {
//   return wx.BaaS.login(false)
// }
//
// export function getUserInfo(data) {
//   return wx.BaaS.handleUserInfo(data.mp)
// }
//
// export function logout() {
//   return wx.BaaS.logout()
// }

export function login() {
  return wx.BaaS.auth.loginWithWechat()
}

export function getUserInfo(data) {
  return wx.BaaS.auth.loginWithWechat(data.mp)
}

export function logout() {
  return wx.BaaS.auth.logout()
}
