<template>
  <div>
    <q-card>
      <q-card-section>
        <div ref="chart" id="chartId" style="height: 400px"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'RecordsChart',
  props: {
    aggregations: {
      type: Object,
      required: false
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
  methods: {
    init () {
      this.chart = echarts.init(document.getElementById('chartId'))
      const valuesByDate = {}
      for (const agg of this.aggregations) {
        valuesByDate[`${agg._id.year}-${agg._id.month}-${agg._id.day}`] = agg.count
      }
      const start = this.aggregations[0]
      let baseDate = +new Date(start._id.year, start._id.month - 1, start._id.day)
      const end = this.aggregations[this.aggregations.length - 1]
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
        console.debug(currKey + ' ~ ' + endStr)
        isEnd = curr.getTime() > now || currKey === endStr
      }
      const option = {
        tooltip: {
          trigger: 'axis',
          position: (pt) => [pt[0], '10%']
        },
        title: {
          left: 'center',
          text: this.$t('chart.cumulated_records')
        },
        animation: false,
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              title: {
                zoom: this.$t('chart.zoom'),
                back: this.$t('chart.reset_zoom')
              }
            },
            restore: {
              title: this.$t('chart.restore')
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
      this.chart.setOption(option)
    }
  }
})
</script>

<style scoped>
</style>
