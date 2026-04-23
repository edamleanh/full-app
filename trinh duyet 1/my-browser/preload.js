const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserAPI', {
    getMediaSourceId: (wcId) => ipcRenderer.invoke('get-media-source-id', wcId)
});
