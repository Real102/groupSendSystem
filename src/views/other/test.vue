<template>
  <div style="margin: 100px">
    <div>
      <InputCheckbox v-model="bindValue" @change="changeCheck" :disabled="true" />
    </div>
    <div>
      <div id="chartColumn" style="width: 80%; height: 400px">
        <!--少了option，多了ref，用于调用setOption方法-->
        <Chart ref="chart1" />
      </div>
      <button @click="changeOption">点击改变内容</button>
    </div>

    <div>
      <el-tabs v-model="editableTabsValue" type="card" closable editable>
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :style="{ color: editableTabsValue == item.name ? 'red' : '#000' }"
          style="color: red"
        >
        </el-tab-pane>
      </el-tabs>
      <!-- <router-view /> -->
    </div>

    <div>
      <Tabs v-model="editableTabsValue" :editable-tabs="editableTabs" />
    </div>
    <br />

    <audio id="player" controls autoplay :src="fileSrc" ref="audio" @canplay="getDuration"></audio>
    <button id="btn-start-recording" @click="toStart">录音{{ second }}</button>
    <button id="btn-stop-recording" @click="toStop">停止</button>
    <button id="btn-stop-recording" @click="clearFile">清除</button>
    <button id="btn-play-recording" @click="getFile">获取文件</button>
    <button id="btn-play-recording" @click="playFile">播放</button>
  </div>
</template>
<script>
import { HZRecorder } from '@/scripts/utils/recorder'
let recorder = null

const option1 = {
  color: ['#EE6666', '#FAC858', '#73C0DE', '#5470C6', '#91CC75'],
  hoverAnimation: false,
  title: {
    text: '折线图堆叠',
  },
  tooltip: {
    // 提示框组件，包括提示框浮层和 axisPointer
    trigger: 'axis',
    confine: true, //是否将 tooltip 框限制在图表的区域内
    // symbolSize: 0,
    axisPointer: {
      type: 'line',
    },
    backgroundColor: null,
    borderRadius: 0,
    formatter: function(params) {
      let str = ''
      params.forEach(item => {
        const str1 =
          '<span class="tooltip-title-left">' +
          item.seriesName +
          '</span> <span class="tooltip-title-right">' +
          item.data +
          '</span><br/>'
        str += str1
      })
      // var name1 = params[0].name
      // var inner = '<div class="tooltip">\
      //           <div class="tooltip-title note-circle-blue">' + ' 数据增量 ' + '</div>\
      //           <div class="tooltip-content"> +\
      //           <span class="tooltip-title-left">' + name1 + '</span> <sapn class="tooltip-title-right"> ' + params[0].data + ' </sapn>\
      //         </div>\
      //         </div>';
      const res = `<div class="tooltip"><div class="tooltip-title note-circle-blue">数据增量</div><div class="tooltip-content">${str}</div></div>`
      return res
    },
  },
  legend: {
    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
    bottom: '0%',
    selectedMode: false,
    itemHeight: 8,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '6%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四周四', '周五', '周六', '周日'],
    axisLabel: {
      rotate: 56,
      margin: 10,
    },
  },
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          opacity: 0,
        },
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: '邮件营销',
      type: 'line',
      stack: '总量',
      symbol: 'emptyCircle', //设定为实心点circle
      hoverAnimation: false, //设置鼠标放上去动作
      // animation: false,//显示时动画
      // symbolSize: 12,
      itemStyle: {
        emphasis: {
          symbol: 'emptyCircle',
          symbolSize: 12,
        },
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '联盟广告',
      type: 'line',
      stack: '总量',
      // symbol: 'circle', //设定为实心点
      hoverAnimation: false, //设置鼠标放上去动作
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '视频广告',
      type: 'line',
      stack: '总量',
      // symbol: 'circle', //设定为实心点
      hoverAnimation: false, //设置鼠标放上去动作
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: '直接访问',
      type: 'line',
      stack: '总量',
      // symbol: 'circle',
      hoverAnimation: false, //设置鼠标放上去动作
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: '搜索引擎',
      type: 'line',
      stack: '总量',
      // symbol: 'circle',
      hoverAnimation: false, //设置鼠标放上去动作
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
}
const data = [
  { value: 235, name: '视频广告' },
  { value: 274, name: '联盟广告' },
  { value: 310, name: '邮件营销' },
  { value: 335, name: '直接访问' },
  { value: 400, name: '搜索引擎' },
  { value: 100, name: '哈哈哈哈' },
  { value: 50, name: '你好' },
  { value: 10, name: '大家好' },
]
export default {
  name: 'Test',
  data: function() {
    return {
      // area: 'province',
      // recorder: null,
      // temp: null,
      file: null,
      fileSrc: null,
      // isVoice: false,

      second: '',

      bindValue: true,

      editableTabsValue: '2',
      editableTabs: [
        {
          title: '新建模板',
          name: '1',
          content: 'Tab 1 content',
        },
        {
          title: '新建模板',
          name: '2',
          content: 'Tab 2 content',
        },
        {
          title: '新建模板',
          name: '3',
          content: 'Tab 2 content',
        },
        {
          title: '新建模板',
          name: '4',
          content: 'Tab 2 content',
        },
        // {
        //   title: '新建模板',
        //   name: '5',
        //   content: 'Tab 2 content',
        // },
        // {
        //   title: '新建模板',
        //   name: '6',
        //   content: 'Tab 2 content',
        // },
        // {
        //   title: '新建模板',
        //   name: '7',
        //   content: 'Tab 2 content',
        // },
        // {
        //   title: '新建模板',
        //   name: '8',
        //   content: 'Tab 2 content',
        // },
        // {
        //   title: '新建模板新建模板',
        //   name: '9',
        //   content: 'Tab 2 content',
        // },
        // {
        //   title: '新建模板新建模板',
        //   name: '10',
        //   content: 'Tab 2 content',
        // },
        // {
        //   title: '新建模板',
        //   name: '11',
        //   content: 'Tab 2 content',
        // },
      ],
    }
  },
  watch: {
    bindValue(val) {
      console.log(val)
    },
    editableTabsValue(val) {
      if (val) this.$router.push({ path: '/home1' })
    },
  },
  created() {},
  beforeDestroy() {
    if (recorder !== null) {
      recorder.stop()
      recorder = null
    }
  },
  mounted() {
    this.$nextTick(() => {
      try {
        //  <!-- 检查是否能够调用麦克风 -->
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        window.URL = window.URL || window.webkitURL

        const audio_context = new AudioContext()
        console.log(
          'navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'),
        )
      } catch (e) {
        alert('No web audio support in this browser!')
      }
      navigator.getUserMedia(
        { audio: true },
        function(stream) {
          recorder = new HZRecorder(stream)
          console.log('初始化完成')
        },
        function(e) {
          console.log('No live audio input: ' + e)
        },
      )
    })

    this.$refs.chart1.setOption(option1)
  },
  methods: {
    toStart() {
      recorder && recorder.start()
    },
    toStop() {
      recorder && recorder.stop()
    },
    getFile() {
      const file = recorder && recorder.getBlob()
      this.file = file
      recorder.play(this.file)
      console.log(file)
    },
    clearFile() {
      recorder && recorder.clear()
    },
    playFile() {
      this.fileSrc = recorder.play(this.file)
    },

    getDuration() {
      console.log(this.$refs.audio.duration) //此时可以获取到duration秒数
      this.duration = this.$refs.audio.duration
    },

    changeCheck(val) {
      console.log(val)
    },

    changeOption() {
      const r = Math.floor(Math.random() * 3)
      const d = data.slice(r, r + 6)
      option1.series[0].data = d
      this.$refs.chart1.setOption(option1)
    },
  },
}
</script>
<style lang="less" scoped>
button {
  margin-right: 20px;
}
.sidebar {
  position: relative;
  width: 20%;
  max-width: 206px;
  background-color: #fff;
  overflow: auto;
  overflow-x: hidden;
  // box-shadow: -4px 0 8px 0 rgba(0,0,0,0.5);
  box-shadow: 2px 0 6px 0 rgba(0, 21, 41, 0.12);
  z-index: 1000;
}
</style>

<style>
.tooltip {
  border-radius: 4px;
  box-shadow: 2px 4px 6px 6px rgba(0, 0, 0, 0.2);
  background: #fff;
}

.tooltip-title {
  padding: 0 5px;
  width: 170px;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #ebf0f5;
  color: #333;
}

.tooltip-content {
  padding: 5px 10px;
  min-height: 50px;
}

.tooltip-title-right {
  float: right;
  padding-right: 10px;
  font-size: 16px;
  color: #30a8e7;
}

.tooltip-title-left {
  padding-left: 10px;
  color: #333;
}
</style>
