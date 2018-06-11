<template>
  <div class="inventory">
    <div class="top">
      <h4>{{msg.title}}</h4>
    </div>
    <div class="body">
      <div id="charts">
        <div id="main" ref="inventoryLine" style="width: 6.60rem;height:3.29rem;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts"
  let getLacation="https://testllservice.56linked.cn/vcloudwood-gateway/vcloudwood/gateway/query.v";

  export default {
    name: "TopTen_month",
    props: ["msg"],
    methods:{
      getData(){
        this.$http.get(getLacation+'?serviceName=com.vtradex.fee.server.api.FeeParentService&method=getSellerHotGoods&sellerUnikey=d6106b0f9cb5a88a58bfa68807148d5a').then(response => {
          let res = JSON.parse(response.data.data.data);
          let {company} = this.msg;
          let value;
          res.value?value=res.value:value= [1200, 600, 350, 80, 70, 1100, 1300];//todo 动态获取的值赋值给图像(目前无数据)
          res.company?company=res.company:null;//todo 动态获取的横轴数据赋值给图像（目前无数据）
          let myEchart = echarts.init(this.$refs.inventoryLine);
          myEchart.setOption(
            {
              color: ["#2ec8ca"],
              legend: {
                right: "10%",
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '8%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                name: '公司',
                right:"10%",
                nameLocation: "end",
                nameGap:10,
                splitArea: {
                  show: true
                },
                nameTextStyle: {
                  color: "#333",
                  fontSize: 14,
                  verticalAlign: "bottom",

                },
                axisLabel: {
                  color: "#a8a8a8",

                },
                type: 'category',
                axisLine: {
                  show: "true",
                  lineStyle:
                    {
                      color: "#eeeeee",
                      width:
                        2,
                      type:
                        'solid',
                      opacity:
                        1,
                    }
                },
                axisTick: {
                  show: true,
                  alignWithLabel:
                    true
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#ddd"
                  }
                },
                data: company
              },
              yAxis: [
                {
                  type: 'value',

                  name: '金额',
                  // min: 0,
                  // max: 1200,
                  splitNumber: 5,
                  position: 'left',
                  splitArea: {
                    show: true
                  },
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#008acd"
                    }
                  },
                  nameTextStyle: {
                    color: "#333",
                    fontSize: 14,
                    verticalAlign: "bottom",

                  },
                  axisLabel: {
                    color: "#727483",

                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: "#ddd"
                    }
                  },
                }
              ],
              series: [{
                itemStyle: {
                  barBorderRadius: [5,5,0,0],
                },

                barWidth: '60%',
                data:value,
                type: 'bar'
              }]
            }
          )
        }, err => {
          console.log(err);
        });
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<style scoped>
  .inventory {
    width: 6.60rem;
    height: 3.80rem;
    margin: .20rem 0 0 .20rem;
    display: inline-block;
    float: left;
    background: #fff;
  }

  .inventory .top {
    width: 100%;
    height: .50rem;
    border-bottom: 1px solid #e4e5e9
  }

  .inventory .top h4 {
    height: .50rem;
    font-size:.18rem;
    margin: 0;
    padding-left: .20rem;
    line-height: .50rem;
  }
</style>
