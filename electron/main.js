import { app, BrowserWindow, ipcMain } from "electron"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)
import fs from 'fs';
//创建窗口
function createWindow() {
    createNewWindow(0);
    createNewWindow(1);
}

function createNewWindow(number) {

    //监听信道/事件
    ipcMain.on('updateUserConfig', updateUserConfig);
    if (number === 0) {
        ipcMain.handle('getUserConfig', getUserConfig);
        ipcMain.handle('getUserBackgroundImg', getUserBackgroundImg);
    }
    const window = new BrowserWindow({
        width: 1000, //设置窗口宽度(单位:像素)
        height: 800, //设置窗口高度
        x: number === 1?100:200,  // 窗口初始横坐标位置，这里设置为距离屏幕左侧100像素
        y: number === 1?100:200,   // 窗口初始纵坐标位置，这里设置为距离屏幕顶部100像素
        icon: "electron/resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: true, //隐藏菜单栏
        devTools: true, // 开发者工具，包括控制台
        webPreferences: { //网页偏好设置
            nodeIntegration: true, //允许在渲染进程中直接使用 Node.js API
            // contextIsolation: true, //启用上下文隔 (提高安全性)
            preload: path.resolve(__dirname, "preload.mjs"), //预加载脚本
        },
        webSecurity: false
    })
    //开发环境
    if (process.env['VITE_DEV_SERVER_URL']) {
        if (number === 0) {
            window.loadURL(process.env['VITE_DEV_SERVER_URL'])
            console.log('开发环境主窗口', number)
        } else {
            window.loadURL(process.env['VITE_DEV_SERVER_URL'] + '/newWindowTest.html')
            // window.loadFile(__dirname, "newWindow.html");
            console.log('开发环境副窗口newWindow', number)
        }
    } else {//生产环境
        if (number === 0) {
            window.loadFile('dist/index.html');
        } else {
            window.loadFile('dist/newWindowTest.html');
        }
        //mainWindow.loadFile(path.resolve(__dirname,"../dist/index.html"))
    }
    window.webContents.on('did-finish-load', () => {
        if (process.env['VITE_DEV_SERVER_URL']) { window.webContents.openDevTools(); }
    });

    // 监听窗口1的关闭事件
    window.on('close', (event) => {
        app.quit();
    });
}



async function updateUserConfig(_, configStr) {
    let parts = configStr.split(":");
    if (parts.length < 2) {
        console.error("错误的配置字符串", configStr);
        return;
    }
    let key = parts[0];
    let value = parts[1];
    const jsonObject = getUserConfig()
    // console.log(jsonObject);

    // console.log("updateUserConfig123", configStr);
    jsonObject[key] = value;

    const updatedJsonData = JSON.stringify(jsonObject, null, 2);
    fs.writeFile('userConfig.json', updatedJsonData, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            return;
        }
        console.log('文件已成功更新');
    });

}

function getUserConfig() {
    try {
        // const jsonPath = path.join(__dirname, 'dist', 'userConfig.json');
        const data = fs.readFileSync('userConfig.json', 'utf8');
        // 使用fs.readFileSync同步读取JSON文件
        // const data = fs.readFileSync('dist/userConfig.json', 'utf8');
        // 解析JSON数据
        const jsonObject = JSON.parse(data);
        console.log("获取用户配置", jsonObject);
        return jsonObject;  // 返回JSON对象
    } catch (err) {
        console.error("错误", err);
    }
}

function getUserBackgroundImg() {
    try {
        const data = fs.readFileSync('bj.png');
        const base64Data = data.toString('base64');
        return base64Data;  // 返回JSON对象
    } catch (err) {
        console.error("错误", err);
    }
}



//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createWindow()
    //在 mac 系统内,若没有已开启的窗口,点击托盘图标时会重新创建一个新窗口
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
            log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'app.log');
        }
    })
})

//若不是在 mac 上运行,则关闭所有窗口时退出应用
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

