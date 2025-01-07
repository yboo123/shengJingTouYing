'use strict';
interface Window {
    myAPI: {
        updateUserConfig: (config: string) => void;
        getUserConfig: () => Promise<any>;
    };
}


const content = getElementById('content')
let fontSize = 20
let letterSpacing = 2
let lineHeight = 26
// 上下左右边距
let marginTop = 30
let marginBottom = 30
let marginLeft = 30
let marginRight = 30

onInit();

function onInit() {
    // console.log(window)
    console.log('newWindow.ts')
    //延时加载
    setTimeout(() => {
        initConfig();
    }, 1000)

}


//TODO 增加颜色初始化
// export let fontColor = "#ffeb3c";
// export let backgroundColor = "#164979";

// 获取元素
function getElementById(id: string): HTMLElement {
    const e = document.getElementById(id)
    if (e) {
        return e
    } else {
        console.error(`ID 为 ${id} 的元素未找到`)
        return document.createElement('div')
    }
}

// 监听 storage 事件
window.addEventListener('storage', function (event) {
    // localStorage 发生变化
    console.log('localStorage事件 name:', event.key, 'oldValue:', event.oldValue, 'newValue:', event.newValue)
    if (event.key === 'setContents') {
        const newValue = event.newValue ? event.newValue : ''
        content.innerHTML = newValue
    } else if (event.key === 'addFontSize') {
        fontSize++
        applySpaceAttribute(fontSize, "fontSize");

    } else if (event.key === 'reduceFontSize') {
        fontSize--
        applySpaceAttribute(fontSize, "fontSize");

    } else if (event.key === 'addKerning') {
        letterSpacing += 5
        applySpaceAttribute(letterSpacing, "letterSpacing");

    } else if (event.key === 'reduceKerning') {
        letterSpacing -= 5
        applySpaceAttribute(letterSpacing, "letterSpacing");

    } else if (event.key === 'addLeading') {
        lineHeight += 5
        applySpaceAttribute(lineHeight, "lineHeight");

    } else if (event.key === 'reduceLeading') {
        lineHeight -= 5
        applySpaceAttribute(lineHeight, "lineHeight");

    } else if (event.key === 'fontColor') {
        const newValue = event.newValue ? event.newValue : '#ffeb3c'
        applySpaceAttribute(newValue, event.key);

    } else if (event.key === 'backgroundColor') {
        const newValue = event.newValue ? event.newValue : '#ffeb3c'
        applySpaceAttribute(newValue, event.key);

    } else if (event.key === 'reduceMarginTop') {
        marginTop -= 5
        applySpaceAttribute(marginTop, "marginTop");
    } else if (event.key === 'addMarginTop') {
        marginTop += 5
        applySpaceAttribute(marginTop, "marginTop");
    } else if (event.key === 'reduceMarginDown') {
        marginBottom -= 5
        applySpaceAttribute(marginBottom, "marginBottom");
    } else if (event.key === 'addMarginDown') {
        marginBottom += 5
        applySpaceAttribute(marginBottom, "marginBottom");
    } else if (event.key === 'reduceMarginLeft') {
        marginLeft -= 5
        applySpaceAttribute(marginLeft, "marginLeft");
    } else if (event.key === 'addMarginLeft') {
        marginLeft += 5
        applySpaceAttribute(marginLeft, "marginLeft");
    } else if (event.key === 'reduceMarginRight') {
        marginRight -= 5
        applySpaceAttribute(marginRight, "marginRight");
    } else if (event.key === 'addMarginRight') {
        marginRight += 5
        applySpaceAttribute(marginRight, "marginRight");
    } else if (event.key === 'setBackgroundImage') {
        document.body.style.backgroundImage = event.newValue ? event.newValue : 'none'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundSize = '100% auto'

    } else if (event.key === 'initConfig') {
        initConfig();
    }
})

// 读取用户配置数据
async function initConfig() {
    let userConfig = await window.myAPI.getUserConfig();
    console.log(userConfig);

    fontSize = Number(userConfig.fontSize) || 10;
    content.style.fontSize = fontSize + 'px'
    letterSpacing = Number(userConfig.letterSpacing) || 10;
    content.style.letterSpacing = letterSpacing + 'px'
    lineHeight = Number(userConfig.lineHeight) || 10;
    content.style.lineHeight = lineHeight + 'px'
    marginTop = Number(userConfig.marginTop) || 10;
    content.style.marginTop = marginTop + 'px'
    marginBottom = Number(userConfig.marginBottom) || 10;
    content.style.marginBottom = marginBottom + 'px'
    marginLeft = Number(userConfig.marginLeft) || 10;
    content.style.marginLeft = marginLeft + 'px'
    marginRight = Number(userConfig.marginRight) || 10;
    content.style.marginRight = marginRight + 'px'
    content.style.color = String(userConfig.fontColor) || '#ffffff';
    document.body.style.backgroundColor = String(userConfig.backgroundColor) || '#000000';
}


function updateUserConfig(config: string) {
    window.myAPI.updateUserConfig(config);
}

function applySpaceAttribute(value: string | number, attrName: string) {
    console.log("准备更新用户设置", value, attrName);
    switch (attrName) {
        case "fontSize":
            fontSize = Number(value);
            content.style.fontSize = fontSize + 'px'
            console.log("fontSize:", fontSize);
            break;

        case "letterSpacing":
            letterSpacing = Number(value);
            content.style.letterSpacing = letterSpacing + 'px'
            console.log("letterSpacing:", letterSpacing);
            break;

        case "lineHeight":
            lineHeight = Number(value);
            content.style.lineHeight = lineHeight + 'px'
            console.log("lineHeight:", lineHeight);
            break;

        case "marginTop":
            marginTop = Number(value);
            content.style.marginTop = marginTop + 'px'
            console.log("marginTop:", marginTop);
            break;

        case "marginBottom":
            marginBottom = Number(value);
            content.style.marginBottom = marginBottom + 'px'
            console.log("marginBottom:", marginBottom);
            break;

        case "marginLeft":
            marginLeft = Number(value);
            content.style.marginLeft = marginLeft + 'px'
            console.log("marginLeft:", marginLeft);
            break;

        case "marginRight":
            marginRight = Number(value);
            content.style.marginRight = marginRight + 'px'
            console.log("marginRight:", marginRight);
            break;

        case "fontColor":
            content.style.color = String(value) || '#ffffff';
            break;

        case "backgroundColor":
            document.body.style.backgroundColor = String(value) || '#ffffff';
            break;

        default:
            break;
    }
    updateUserConfig(`${attrName}:${value}`);
}



