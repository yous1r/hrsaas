<template>
  <div ref="chart" class="radar-echart">雷达图</div>
</template>

<script>
// 全局引入
// import * as echarts from 'echarts'
import * as echarts from 'echarts/core'
import {
  RadarChart
} from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
// 引入canvas渲染器
import { CanvasRenderer } from 'echarts/renderers'

echarts.use(
  [RadarChart, TitleComponent, CanvasRenderer, TooltipComponent, LegendComponent]
)
export default {
  // 必须使用mounted钩子函数
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.chart)
    // 绘制图表
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      tooltip: {},
      // 图例
      legend: {
        data: ['平均水平', '北京平均', '上海平均']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [{
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [80, 80, 80, 80, 80, 80],
            name: '平均水平'
          },
          {
            value: [95, 40, 50, 90, 90, 85],
            name: '北京平均'
          },
          {
            value: [100, 90, 85, 90, 90, 85],
            name: '上海平均'
          }
        ]
      }]
    })
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 500px;
}
</style>
