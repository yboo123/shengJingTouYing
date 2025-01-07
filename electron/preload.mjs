import { contextBridge, ipcRenderer } from 'electron';

console.log('preload.js loaded')
contextBridge.exposeInMainWorld('myAPI', {
  updateUserConfig: (string) => {
    console.log('preload.js updateUserConfig')
    ipcRenderer.send('updateUserConfig', string)
  },
  async getUserConfig() {
    console.log('preload.js getUserConfig')
    // 返回的是一个 promise
    return ipcRenderer.invoke('getUserConfig')
  }, 
  async getUserBackgroundImg() {
    console.log('preload.js getUserBackgroundImg')
    // 返回的是一个 promise
    return ipcRenderer.invoke('getUserBackgroundImg')
  },
});


