<template>
  <q-card flat bordered class="q-mb-sm">
    <div class="q-pa-sm">
      <div class="text-caption text-center text-weight-bold q-mb-md">{{ title }}</div>
      <div ref="piechart" :id="chartId" :style="`height: ${height}`"></div>
    </div>
    <q-resize-observer @resize="onResize"/>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  frequencies: {
    type: Object,
    required: false
  },
  height: {
    type: String,
    required: false,
    default: '250px'
  }
})

let chart = null

function init() {
  const elem = document.getElementById(props.chartId)
  chart = echarts.init(elem)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom',
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '35%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: props.frequencies
      }
    ]
  }

  chart.setOption(option)
}

function onResize() {
  if (chart) {
    chart.resize()
  }
}

onMounted(() => {
  init()
})

watch(() => props.frequencies, () => {
  init()
})
</script>

<style scoped>
</style>
