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
    <el-card class="box-card" v-else-if="showData.SHOW_USER_TYPE == '2'">
      <div class="box-content" style="width:93%">
        <p>{{showData.COUNT_MONEY}}</p>
        <p>总收款</p>
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
      <div class="box-content">
        <p>{{showData.COUNT_MONEY}}</p>
        <p>总收款</p>
      </div>
      <div class="box-content">
        <p>{{showData.SURPLUS_BOND}}</p>
        <p>剩余保证金</p>
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
      <div class="box-content" style="width:93%">
        <p>{{showData.APP_TOTAL_COUNT}}</p>
        <p>平台总收款</p>
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
      <div class="box-content" style="width:93%">
        <p>{{showData.USER_TOTAL_COUNT}}</p>
        <p>用户总收款</p>
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
    <el-card class="box-card" v-if="showData.SHOW_MATCH == 'Y'">
      <div class="match" @click="isMatch('开始')" v-if="showData.IS_MATCH == 'N'">
        <span>开始匹配</span>
      </div>
      <div class="close" @click="isMatch('关闭')" v-else-if="showData.IS_MATCH =='Y'">
        <span>关闭匹配</span>
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
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showData: []
    };
  },
  methods: {
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
      this.$confirm("确认"+msg+"匹配吗？", "提示", {}).then(() => {
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
        })
        .catch(res => {
          this.editLoading = false;
          this.$message({
            message: res.message,
            type: "error"
          });
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