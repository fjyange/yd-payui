<template>
  <div class="page-container">
	<div id="pieReport" style="width: 400px;height: 300px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
	 name: "",
  data() {
    return {
      charts: "",
      opinion: ["及格人数", "未及格人数"],
      opinionData: [
        { value: 12, name: "及格人数", itemStyle: "#1ab394" },
        { value: 18, name: "未及格人数", itemStyle: "#79d2c0" }
      ]
    };
	},
	methods:{
	drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: this.opinion
        },
        series: [
          {
            name: "状态",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              color: function(params) {
                //自定义颜色
                var colorList = ["#1ab394", "#79d2c0"];
                return colorList[params.dataIndex];
              }
            },
            data: this.opinionData
          }
        ]
      });
    },
	},
	mounted() {
		 this.drawPie("pieReport");
	}
}
</script>

<style scoped>

</style>