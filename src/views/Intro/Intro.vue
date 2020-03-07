<template>
  <div class="page-container" style="width:99%;margin-top:15px;">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户信息</span>
      </div>
      <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div>
    </el-card>-->
    <!-- <img src="http://193.112.135.244/authorize/attach/getFile?id=04214236ba0a425b92db4243ac40c1fc"> -->
    <el-card class="box-card" v-if="showData.SHOW_USER_TYPE == '0'">
      <div class="box-content">
        <p>{{showData.ORDER_MONEY}}</p>
        <p>订单总额</p>
      </div>
      <div class="box-content">
        <p>{{showData.SUCCESCC_RATE}}</p>
        <p>订单成功率</p>
      </div>
      <div class="box-content">
        <p>{{showData.ORDER_WX_MONEY}}</p>
        <p>微信订单总额</p>
      </div>
      <div class="box-content">
        <p>{{showData.ORDER_ALI_MONEY}}</p>
        <p>支付宝订单总额</p>
      </div>
    </el-card>
    <el-card class="box-card" v-if="showData.SHOW_USER_TYPE == '0'">
      <div class="box-content" style="width:93%">
        <p>{{showData.ORDER_YS_MONEY}}</p>
        <p>订单昨日总额</p>
      </div>
      <div class="box-content">
        <p>{{showData.ORDER_YS_WX_MONEY}}</p>
        <p>微信订单昨日总额</p>
      </div>
      <div class="box-content">
        <p>{{showData.ORDER_YS_ALI_MONEY}}</p>
        <p>支付宝订单昨日总额</p>
      </div>
    </el-card>
    <el-card class="box-card" v-else-if="showData.SHOW_USER_TYPE == '2'">
      <div class="box-content">
        <p>{{showData.COUNT_MONEY}}</p>
        <p>总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.APP_YS_COUNT}}</p>
        <p>昨日总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.WX_MONEY}}</p>
        <p>微信收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.ALI_MONEY}}</p>
        <p>支付宝收款</p>
      </div>
    </el-card>
    <el-card class="box-card" v-else-if="showData.SHOW_USER_TYPE == '1'">
      <div class="box-content" style="width:93%">
        <p>{{showData.COUNT_MONEY}}</p>
        <p>总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.SURPLUS_BOND}}</p>
        <p>剩余保证金</p>
      </div>
      <div class="box-content">
        <p>{{showData.V_YS_RECEIVABLES}}</p>
        <p>昨日总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.WX_MONEY}}</p>
        <p>微信收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.ALI_MONEY}}</p>
        <p>支付宝收款</p>
      </div>
    </el-card>
    <el-card class="box-card" v-if="showData.SHOW_USER_TYPE == '0'">
      <div class="box-content">
        <p>{{showData.APP_TOTAL_COUNT}}</p>
        <p>平台总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.APP_YS_COUNT}}</p>
        <p>平台昨日总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.APP_CASH_COUNT}}</p>
        <p>平台可提现金额</p>
      </div>
      <div class="box-content">
        <p>{{showData.COMMISSION_MONEY}}</p>
        <p>平台已提现金额</p>
      </div>
    </el-card>
    <el-card class="box-card" v-if="showData.SHOW_USER_TYPE == '0'">
      <div class="box-content">
        <p>{{showData.USER_TOTAL_COUNT}}</p>
        <p>用户总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.V_YS_RECEIVABLES}}</p>
        <p>用户昨日总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.USER_TOTAL_SURPLUS}}</p>
        <p>用户剩余保证金</p>
      </div>
      <div class="box-content">
        <p>{{showData.ACCOUNT_TOTAL_COUNT}}</p>
        <p>账户总收款</p>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="box-content">
        <p>{{showData.ALL_COUNT}}</p>
        <p>今日订单总数</p>
      </div>
      <div class="box-content">
        <p>{{showData.SUCCESS_COUNT}}</p>
        <p>今日成功订单</p>
      </div>
      <div class="box-content">
        <p>{{showData.WX_COUNT}}</p>
        <p>微信订单</p>
      </div>
      <div class="box-content">
        <p>{{showData.ALI_COUNT}}</p>
        <p>支付宝订单</p>
      </div>
    </el-card>
    <el-card class="box-card" v-if="showData.SYS_SHOW == 'Y'">
      <div class="close" @click="operate('off')" v-if="showData.SYS_SWITCH == 'N'">
        <span>关闭系统</span>
      </div>
      <div class="match" @click="operate('on')" v-else-if="showData.SYS_SWITCH == 'Y'">
        <span>开启系统</span>
      </div>
    </el-card>
    <el-card class="box-card" style="width:92%">
      <div id="orderStatistics" style="width: 100%;height: 320px;"></div>
    </el-card>
    <el-card class="box-card" style="width:92%">
      <div id="zzt" style="width: 100%;">
          <div>今日付款账户成功率</div>
        <el-table :data="showData.acc" border style="margin: 0 auto" row-class-name="row_padding"
                      header-row-class-name="head_padding">
                <el-table-column fixed prop="V_PAY_NAME" label="付款名" align="center" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="COU_SUM" label="总订单数据"  align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="SUC_SUM" label="成功数"  align="center" show-overflow-tooltip></el-table-column>         
                <el-table-column prop="FAIL_SUM" label="失败数"  align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="RATE" label="成功率"  align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="USER_NAME" label="所属用户"  align="center" show-overflow-tooltip></el-table-column>
            </el-table>
      </div>
    </el-card>
    <el-card class="box-card" v-if="showData.SHOW_MATCH == 'Y'">
      <div class="match" @click="isMatch('开始')" v-if="showData.IS_MATCH == 'N'">
        <span>开始匹配</span>
      </div>
      <div class="close" @click="isMatch('关闭')" v-else-if="showData.IS_MATCH =='Y'">
        <span>关闭匹配</span>
      </div>
    </el-card>
    <!-- <el-card class="box-card" v-if="showData.SYS_SHOW == 'Y'">
      <div class="match" @click="editData()">
        <span>数据回正</span>
      </div>
    </el-card>-->
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  components: {},
  data() {
    return {
      showData: []
    };
  },
  methods: {
    graphical(xData, yData, title) {
      let myChart = echarts.init(document.getElementById("orderStatistics"));
      myChart.setOption({
        title: {
          text: title,
          textStyle: {
            color: "#989898",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 12
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["小时成功率"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "成功率",
            type: "line",
            smooth: true,
            stack: "总量",
            itemStyle: {
              normal: {
                // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#81befd" // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: "#e4f2ff" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ]), // 背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 3,
                  type: "solid",
                  color: "#409EFF" // 折线的颜色
                }
              },
              emphasis: {
                color: "#409EFF",
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 2,
                  type: "dotted",
                  color: "#409EFF"
                }
              }
            }, // 线条样式
            symbolSize: 2, // 折线点的大小
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: yData
          }
        ]
      });
    },
    editData: function() {
      this.$confirm("确认数据回正么？", "提示", {}).then(() => {
        this.$api.send
          .dealErrorData()
          .then(res => {
            if (res.success) {
              this.showHome();
              this.$message({ message: "操作成功", type: "success" });
            } else {
              this.$message({
                message: "操作失败, " + res.result,
                type: "error"
              });
            }
          })
          .catch(res => {
            this.editLoading = false;
            this.$message({
              message: res.message,
              type: "error"
            });
          });
      });
    },
    operate: function(value) {
      let msg = "确认开启系统么？";
      if (value == "off") {
        msg = "确认关闭系统么？";
      }
      this.$confirm(msg, "提示", {}).then(() => {
        let params = {
          VALUE: value
        };
        this.$api.home
          .systemOperate(params)
          .then(res => {
            if (res.success) {
              this.showHome();
              this.$message({ message: "操作成功", type: "success" });
            } else {
              this.$message({
                message: "操作失败, " + res.result,
                type: "error"
              });
            }
          })
          .catch(res => {
            this.editLoading = false;
            this.$message({
              message: res.message,
              type: "error"
            });
          });
      });
    },
    isMatch: function(msg) {
      this.$confirm("确认" + msg + "匹配吗？", "提示", {}).then(() => {
        this.$api.home
          .isMatch()
          .then(res => {
            if (res.success) {
              this.showHome();
              this.$message({ message: "操作成功", type: "success" });
            } else {
              this.$message({
                message: "操作失败, " + res.result,
                type: "error"
              });
            }
          })
          .catch(res => {
            this.editLoading = false;
            this.$message({
              message: res.message,
              type: "error"
            });
          });
      });
    },
    showHome: function() {
      this.$api.home
        .showHome()
        .then(res => {
          this.showData = res.result;
          if (this.showData.SHOW_USER_TYPE == 0) {
            this.initZX();
          }
        })
        .catch(res => {
          this.editLoading = false;
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    initZX() {
      let xData = [];
      let yData = [];
      let title = "";

      title = "今日订单费率统计";
      this.showData.list.forEach((item, index, arr) => {
        xData.push(item.HOUR + "时");
        // yData.push(item.statisticsOrderAmount)
        yData.push({
          value: item.RATE,
          desc: item.HOUR + "时"
        });
      });
      this.graphical(xData, yData, title);
    },
    initZD() {
       let xData = [];
      let data1 = [];
      let data2 = [];
      this.showData.acc.forEach((item, index, arr) => {
        xData.push(item.V_PAY_NAME);
        data2.push(item.SUC_SUM);
        data1.push(item.COU_SUM);
      });
      let myChart = echarts.init(document.getElementById("zzt"));
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["总数", "成功数"]
        },
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: "总数",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: data1
          },
          {
            name: "成功数",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: data2
          }
        ]
      });
    }
  },
  mounted() {
    this.showHome();
  }
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 45%;
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.box-content {
  width: 45%;
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
  background-color: #f0f0f0;
}

.close {
  height: 300px;
  width: 300px;
  border-radius: 300px;
  background-color: red;
  margin: auto;
  text-align: center;
  line-height: 300px;
  font-size: 40px;
  color: #fff;
}
.match {
  height: 300px;
  width: 300px;
  border-radius: 300px;
  background-color: aquamarine;
  margin: auto;
  text-align: center;
  line-height: 300px;
  font-size: 40px;
  color: #fff;
}
</style>