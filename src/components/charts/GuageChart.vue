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

<script>
import * as echarts from 'echarts';

export default {
  name: "GuageChart",
  data() {
    return {
      model: false,
      options: {
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
      },
      guage_chart: null
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    '$q.dark.isActive': function () {
      this.init();
    }
  },
  methods: {
    SaveImage() {
      const linkSource = this.guage_chart.getDataURL();
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = 'GuageChart.png';
      downloadLink.click();
    },
    init() {
      let guageChart = document.getElementById('guageChart');
      echarts.dispose(guageChart);
      let theme = this.model ? 'dark' : 'light';
      this.guage_chart = echarts.init(guageChart, theme);
      this.guage_chart.setOption(this.options)
    },
    onResize() {
      if (this.guage_chart) {
        this.guage_chart.resize();
      }
    }
  }
}
</script>

<style scoped>
</style>
