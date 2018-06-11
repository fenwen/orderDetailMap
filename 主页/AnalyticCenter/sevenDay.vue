<template>
  <div class="inventory">
    <div class="top">
      <h4>{{msg.title}}</h4>
    </div>
    <div class="body">
      <div id="charts">
        <div id="main" ref="inventoryLine" style="width: 8.35rem;height:3.49rem;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts"
  let getLacation="https://testllservice.56linked.cn/vcloudwood-gateway/vcloudwood/gateway/query.v";


  export default {
    name: "sevenDay",
    props: ["msg"],
    methods:{
      getData(){
        //近七天业务量趋势
        this.$http.get(getLacation+'?serviceName=com.vtradex.fee.server.api.FeeParentService&method=getFeeAndCountReport&sellerUnikey=2fdb81ee5e0b5e8bb488839b10a75cc4').then(response => {

           let res= JSON.parse(response.data.data.data);//todo 当前没有数据,参数名称不对
          //销售额（元）
          let inventoryData,sumData;
          inventoryData=res.inventory?res.inventory:this.msg.inventory.value;
            sumData=res.sum?res.sum:this.msg.sum.value;

          let {inventory, sum, colors} = this.msg;
          let myEchart = echarts.init(this.$refs.inventoryLine);

          let dateValue = [];
          (function () {
            let date = new Date();

            let month = date.getMonth()+1,
              dateDay =date.getDate();
            for (let i = 0; i < 7; i++) {
              if(dateDay>1){
                dateDay--;
                dateValue.unshift(month+"."+dateDay)
              }else if(dateDay=1){
                if(month===3){
                  month=month-1;
                  dateDay=28;
                  dateValue.unshift(month+"."+dateDay)
                }else if(month===(2||4||6||8||9||11)){
                  month=month-1;
                  dateDay=31;
                  dateValue.unshift(month+"."+dateDay)
                }else if( month===1){
                  month=12;
                  dateDay=31;
                  dateValue.unshift(month+"."+dateDay)
                }else{
                  month=month-1;
                  dateDay=30;
                  dateValue.unshift(month+"."+dateDay)
                }
              }
            }
          })();//获取当日之前七天的日期

          myEchart.setOption(
            {
              color: colors,
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross'
                }
              },
              grid: {
                show: true
              },
              legend: {
                data: [inventory.name, sum.name],
                background: "#000",
                textStyle: {
                  color: '#727483'
                }
              },
              xAxis:
                {
                  name: '日期',
                  location: "end",
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
                  boundaryGap:
                    false,
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
                  data: dateValue
                },
              yAxis: [
                {
                  type: 'value',
                  name: '单量',
                  // min: 0,
                  // max: 1500,
                  splitNumber: 6,
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
                },
                {
                  type: 'value',
                  name: '销售额',
                  // min: 0,
                  // max: 15000,
                  splitNumber: 6,
                  position: 'right',
                  offset: 0,
                  splitArea: {
                    show: true
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: "#ddd"
                    }
                  },
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    onZero: true,
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
                }
              ],
              series: [
                {
                  name: inventory.name,
                  type: 'line',
                  symbol: "rect",
                  areaStyle: {normal: {}},
                  size: 6,
                  smooth: 0.3,
                  yAxisIndex: 1,
                  data: inventoryData
                },
                {
                  name: sum.name,
                  type: 'line',
                  symbol: "circle",
                  areaStyle: {normal: {}},
                  size: 6,
                  yAxisIndex: 0,
                  data: sumData
                }
              ]
            }
          )

        }, err => {
          console.log(err);
        });
      }
    },
    mounted() {
      this.getData()
    }
  }

</script>

<style scoped>
  .inventory {
    width: 8.35rem;
    height: 4.00rem;
    margin: 0 0 0 .20rem;
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
    color: #555;
    font-size: .18rem;
    height: .50rem;
    margin: 0;
    padding-left: .20rem;
    line-height: .50rem;
  }
</style>
