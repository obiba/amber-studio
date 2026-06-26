<template>
  <div>
    <q-card>
      <q-card-section class="text-h6">
        Guage Chart

        <q-btn icon="fa fa-download" class="float-right" @click="SaveImage" flat dense>
          <q-tooltip>Download PNG</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <div ref="guagechart" id="guageChart" style="height: 250px;"></div>
      </q-card-section>
      <q-resize-observer @resize="onResize"/>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import * as echarts from 'echarts'

const $q = useQuasar()

const model = ref(false)
const options = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [{
    name: 'Pressure',
    type: 'gauge',
    progress: {
      show: true
    },
    detail: {
      valueAnimation: true,
      formatter: '{value}'
    },
    data: [{
      value: 50,
      name: 'SCORE'
    }]
  }]
}
let gaugeChart = null

function SaveImage () {
  const linkSource = gaugeChart.getDataURL()
  const downloadLink = document.createElement('a')
  document.body.appendChild(downloadLink)
  downloadLink.href = linkSource
  downloadLink.target = '_self'
  downloadLink.download = 'GuageChart.png'
  downloadLink.click()
}

function init () {
  const guageChart = document.getElementById('guageChart')
  echarts.dispose(guageChart)
  const theme = model.value ? 'dark' : 'light'
  gaugeChart = echarts.init(guageChart, theme)
  gaugeChart.setOption(options)
}

function onResize () {
  if (gaugeChart) {
    gaugeChart.resize()
  }
}

onMounted(() => {
  init()
})

watch(() => $q.dark.isActive, () => {
  init()
})
</script>

<style scoped>
</style>
