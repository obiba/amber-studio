<template>
  <q-card class="q-mb-sm">
    <div class="q-pa-sm">
      <div class="text-caption text-center text-weight-bold">{{ title }}</div>
      <div ref="chart" :id="chartId" :style="`height: ${height}`"></div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'

const { t } = useI18n()

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  aggregations: {
    type: Object,
    required: false
  },
  height: {
    type: String,
    required: false,
    default: '300px'
  }
})

let chart = null

function init() {
  chart = echarts.init(document.getElementById(props.chartId))
  const valuesByDate = {}
  for (const agg of props.aggregations) {
    valuesByDate[`${agg._id.year}-${agg._id.month}-${agg._id.day}`] = agg.count
  }
  const start = props.aggregations[0]
  let baseDate = +new Date(start._id.year, start._id.month - 1, start._id.day)
  const end = props.aggregations[props.aggregations.length - 1]
  const endStr = `${end._id.year}-${end._id.month}-${end._id.day}`
  const oneDay = 24 * 3600 * 1000
  const data = [[baseDate, start.count]]
  let isEnd = false
  let acc = start.count
  const now = new Date().getTime()
  while (!isEnd) {
    const curr = new Date((baseDate += oneDay))
    const currKey = curr.getFullYear() + '-' + (curr.getMonth() + 1) + '-' + curr.getDate()
    if (valuesByDate[currKey]) {
      acc = acc + valuesByDate[currKey]
    }
    data.push([+curr, acc])
    // console.debug(currKey + ' ~ ' + endStr)
    isEnd = curr.getTime() > now || currKey === endStr
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      position: (pt) => [pt[0], '10%']
    },
    animation: false,
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: {
            zoom: t('chart.zoom'),
            back: t('chart.reset_zoom')
          }
        },
        restore: {
          title: t('chart.restore')
        }
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '10%']
    },
    dataZoom: [
      {
        type: 'slider'
      },
      {
        type: 'inside'
      }
    ],
    series: [
      {
        name: 'N',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: data
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  init()
})

watch(() => props.aggregations, () => {
  init()
})
</script>

<style scoped>
</style>
