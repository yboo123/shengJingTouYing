<template>
    <div>
        新旧约选择
        <button @click="initBible('old')">旧约</button>
        <button @click="initBible('new')">新约</button>
    </div>

    <div class="parent-container">
        <div class="book-div">
            <button @click="clickMuLuShowChapter(g)" v-for="g in muLu" :key="g[0]">{{ g[6] }}</button>
        </div>

        <div class="chapter-jie-div">
            <button @click="clickChapterShowJieNum(index)" v-for="index in chapterTotal" :key="index">
                第{{ index }}章
            </button>
        </div>

        <div class="chapter-jie-div">
            <div v-for="(jie, index) in jieLieBiao" :key="index">
                <!-- 使用label包裹input和文本，实现点击文本也能触发复选框选中效果 -->
                <label>
                    <input class="jie-div" type="checkbox" :value="jie"
                        @change="clickJieShowText(jie.content, jie.index)"
                        :checked="selectedContentsMap.has(jie.index)" />
                    {{ jie.title }}
                </label>
            </div>
        </div>

        <textarea class="bible-text-container" v-model="selectedContentStr" type="text"></textarea>

        <button class="push-btn" @click="addPushList()"><br />加入推送队列→</button>

        <div class="push-list-container">
            推送队列
            <div v-for="(item, index) in historyList" :key="index">
                <Histroy :text="item" :src="contentSrcMap.get(item) ?? ''" @delete="removeHistory(index)" @up="upHistory(index)" @down="downHistory(index)"
                    @pushSrc="pushSrc(index)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import Histroy from './Histroy.vue'
const contentSrcMap: Map<string, string> = new Map();
/// 定义一个响应式数组来存储历史记录文本内容
const historyList = ref<string[]>([])

function addHistory(text: string) {
    if (!db) {
        console.error('addHistory 执行时 数据库未初始化')
        return
    }
    // 记录出处,从复选框获取内容
    const array = Array.from(selectedContentsMap.values()).sort(
        (a, b) => a.index - b.index,
    )
    const result = db.exec(
        `SELECT * FROM BibleID WHERE SN='${curBook}'`,
    )
    const bookName = result[0].values[0][6];
    console.log('result', bookName);
    console.log('array', array);
    let chuChu = '';
    if (array.length === 1) {
        chuChu = `${bookName} ${curChapter}:${array[0].index}`;

    } else if (array.length > 1) {
        chuChu = `${bookName} ${curChapter}:${array[0].index}-${array[array.length - 1].index}`;
    }
    console.log(chuChu);

    // 这里可以替换成实际获取历史记录文本的逻辑，比如从接口获取等，此处简单模拟添加固定文本
    historyList.value.push(text)
    contentSrcMap.set(text, chuChu);
}

function removeHistory(index: number) {
    const text = historyList.value[index]
    // 通过索引删除对应的历史记录文本，从而实现对应的History组件被移除
    historyList.value.splice(index, 1)
    contentSrcMap.delete(text);
}

function upHistory(index: number) {
    // 向上移动历史记录文本，从而实现对应的History组件顺序变化
    if (index > 0) {
        const temp = historyList.value[index - 1]
        historyList.value[index - 1] = historyList.value[index]
        historyList.value[index] = temp
    }
}
function downHistory(index: number) {
    // 向下移动历史记录文本，从而实现对应的History组件顺序变化
    if (index < historyList.value.length - 1) {
        const temp = historyList.value[index + 1]
        historyList.value[index + 1] = historyList.value[index]
        historyList.value[index] = temp
    }
}
// 推送出处
function pushSrc(index: number) {
    const strKey = historyList.value[index]
    const src: string = contentSrcMap.get(strKey) ?? '';
    console.log('pushSrc', src);
    if (src !== undefined) {
        localStorage.setItem('contentSrc', src);
    } else {
        // 处理未找到的情况，例如抛出错误或记录日志
        console.error(`未找到对应的值，strKey: ${strKey}`);
    }
}

interface Section {
    content: string
    title: string
    index: number
}

const jieLieBiao = ref<Section[]>([])
// 用于存储被选中的内容，通过v-model与复选框绑定
const selectedContentsMap = new Map<number, Section>()
const selectedContentStr = ref('')
localStorage.setItem('setContents', '')

function addPushList() {
    addHistory(selectedContentStr.value)
}

const clickJieShowText = (content: string, index: number, title: string = `第${index}节`) => {
    // console.log('点击节', content, index, title)
    if (selectedContentsMap.has(index)) {
        selectedContentsMap.delete(index)
    } else {
        selectedContentsMap.set(index, { content, title, index })
    }
    // 计算并更新combinedContent
    // 按照key排序
    const sortedSelectedContents = Array.from(selectedContentsMap.values()).sort(
        (a, b) => a.index - b.index,
    )
    selectedContentStr.value = sortedSelectedContents
        .map((item) => item.index + ' ' + item.content)
        .join('')
}

import { onMounted, ref, shallowRef } from 'vue'
import { type Database } from 'sql.js'
import databaseSingleton from '.././database.ts';

const muLu = shallowRef()
const chapterTotal = ref(0)
const jieTotal = ref(0)
// const jieText = ref('')
// 当前是哪一卷,哪一章
let curBook = 0
let curChapter = 0

/**
 * 点击卷按钮，显示章
 * @param book [1, 1, 50, 0, 'CSJ', '创', '创世记']
 * 卷编号，xx，卷总章数，卷序号，卷名缩写，卷名全拼，卷名全文
 */
function clickMuLuShowChapter(book: never[]) {
    chapterTotal.value = book[2]
    curBook = book[0]
    jieTotal.value = 0
    jieLieBiao.value = []
    selectedContentStr.value = ''
    selectedContentsMap.clear()
}

// 点击章节按钮，显示节,需要到bible表里查
function clickChapterShowJieNum(chapter: number) {
    if (!db) {
        console.error('数据库未初始化')
        return
    }
    // curChapter = chapter
    jieLieBiao.value = []
    const result = db.exec(
        `SELECT * FROM Bible WHERE VolumeSN='${curBook}' AND ChapterSN='${chapter}'`,
    )
    curChapter = chapter;

    jieTotal.value = result[0].values.length
    selectedContentStr.value = ''
    selectedContentsMap.clear()
    console.log("显示节数量", result[0]);

    jieLieBiao.value = result[0].values.map((v) => ({
        title: `第${v[3]}节`,
        content: typeof v[4] === 'string' ? v[4] : v[4] === null ? '' : v[4].toString(),
        index: Number(v[3]),
    }))
}

/**
 *
 * @param index 节序号
 * VolumeSN 卷编号
 * ChapterSN 章编号
 * VerseSN 节编号
 * Lection 节内容
 */

let db: Database | null = null
onMounted(async () => {
    await databaseSingleton.init();
    db = databaseSingleton.instance;
    if (!db) {
        console.error('数据库未初始化')
        return
    }

    const result = db.exec("SELECT * FROM BibleId WHERE NewOrOld='0'")
    muLu.value = result[0].values
})

// 读取圣经目录
function initBible(type: string) {
    if (!db) {
        console.error('数据库未初始化')
        return
    }
    if (type === 'old') {
        const result = db.exec("SELECT * FROM BibleId WHERE NewOrOld='0'")
        muLu.value = result[0].values
    } else if (type === 'new') {
        const result = db.exec("SELECT * FROM BibleId WHERE NewOrOld='1'")
        muLu.value = result[0].values
    }
    chapterTotal.value = 0
    jieTotal.value = 0
    selectedContentStr.value = ''
    jieLieBiao.value = []
    selectedContentsMap.clear()
}
</script>

<style scoped>
.parent-container {
    display: flex;
    justify-content: flex-start;
    width: 100%;
}

.book-div {
    display: flex;
    flex-direction: column;
    width: 8%;
}

.chapter-jie-div {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    width: 8%;
    margin-left: 10px;
}

.jie-div {
    /* width: 150%; */
}

.bible-text-container {
    width: 35%;
    font-size: 16px;
}

.push-btn {
    width: 2%;
    height: 300px;
}

.push-list-container {
    text-align: center;
    width: 50%;
    /* 左边距 */
    /* margin-right: 10px; */
    /* float: left; */
}
</style>
