<template>
  <div>
    <q-card flat>
      <q-card-section class="text-h6">
        {{ title }}
      </q-card-section>
      <q-card-section>
        <div ref="piechart" :id="chartId" :style="`height: ${height}`"></div>
      </q-card-section>
      <q-resize-observer @resize="onResize"/>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'PieChart',
  props: {
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
      default: '400px'
    }
  },
  setup () {
    return {
      chart: ref(null)
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    frequencies () {
      this.init()
    }
  },
  methods: {
    init () {
      const elem = document.getElementById(this.chartId)
      this.chart = echarts.init(elem)

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
            data: this.frequencies
          }
        ]
      }

      this.chart.setOption(option)
    },
    onResize () {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
})
</script>

<style scoped>
</style>
