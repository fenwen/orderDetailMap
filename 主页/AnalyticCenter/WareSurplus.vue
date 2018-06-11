<template>
  <div class="analyze">
    <div class="top"><h4>各货主库存分析</h4></div>
    <div class="body">
      <div class="pie" id="charts">
        <div id="main" ref="analyzePie" style="width: 4.85rem;height:3.49rem;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  let name=[];
  import echarts from "echarts"
  let getLacation="https://testllservice.56linked.cn/vcloudwood-gateway/vcloudwood/gateway/query.v";

  export default {
    name: "WareSurplus",
    props:["msg"],
    methods:{
      getDate(){
        let myEchart = echarts.init(this.$refs.analyzePie);
        let data=[];
        this.$http.get(getLacation+'?serviceName=com.vtradex.wms.api.inventory.InventoryApi&method=orgFontInventoryMessage&orgUnikey=2fdb81ee5e0b5e8bb488839b10a75cc4').then(response => {
          let res=JSON.parse(response.data.data.data).mapList;//todo 没有仓库的总体积
          console.log(res);
          res.forEach(item=>{
           name.push(item.wareHosueName);
           data.push({
             name:item.wareHosueName,
             value:item.volume
           })
         });

          myEchart.setOption({
            legend: {
              top:17,
              left:20,

              emphasis: {
                label: {
                  show: true,
                  formatter: "{b}\n{c} ({d}%)",
                  position: 'center',
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              textStyle: {
                color: "#727581"
              },
              orient: 'vertical',
              data:name
            },
            color: this.msg.colors,
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '60%',
                center: ['50%', '55%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      formatter: '{b}'
                    }
                  },
                  labelLine:{show:true}},
                data: data ,
              }
            ]
          })
        }, err => {
          console.log(err);
        });//仓库库存及饼图数据
      }
    },
    mounted() {
      this.getDate();


    }
  }
</script>

<style scoped>
  .analyze {
    display: inline-block;
    margin:0 0 0 .20rem;
    padding:0;
    float:left;
    width: 4.85rem;
    height: 4.00rem;
    background: #fff;
  }

  .analyze .top {
    width: 100%;
    height: .50rem;
    font-size: .18rem;
    border-bottom: 1px solid #e4e5e9
  }

  .analyze .top h4 {
    height: .50rem;
    font-size: .18rem;
    margin:0;
    padding-left: .20rem;
    line-height: .50rem;
  }

  .pie {
    border-top: 1px solid #5b5f66;
    width: 100%;
    height: 3.08rem;
  }
</style>
