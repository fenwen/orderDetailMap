<template>
  <div class="map_container">
    <div id="allmap"></div>
    <div class="map_nav">
        <div class="map_nav_top">
          <span class="map_logo_icon">
            <img src="static/trackMap/icon_map_white.png">
          </span>
          <span class="map_top_arrow">
            <img src="static/trackMap/icon_arrow.png">
          </span>
          <p class="tab_title">节点</p>
        </div>
        <div class="map_content">
          <ul class="map_list">
            <li class="active">节点</li>
            <li>定位</li>
            <li>详情</li>
            <li>明细</li>
          </ul>
          <div class="map_r_content">
            <!-- 节点 -->
            <div class="map_item item_dot">
              <ol class="dot_list" v-if="nodeList.length > 0" >
                <li v-for="(item, index) in nodeList" :key="index">
                  <span>{{parseTime(item.finishDate, '{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                  <div class="dot_c clearfix">
							      <p>{{item.name}}</p>
							      <span class="name">{{item.creator}}</span>
						      </div>
                  <p class="address" v-if="item.province || item.city || item.address">
                    <img src="static/trackMap/icon_mark.png">
                    {{item.province}}{{item.city}}{{item.address}}
                  </p>
                </li>
              </ol>
              <p v-else class="no-data">暂无数据</p>
            </div>
            <!-- 定位 -->
            <div class="map_item item_local" style="display:none;">
              <table class="location_tab" cellspacing="0" v-if="locationList.length > 0">
                <tr>
                  <th width="40%">手机采集时间</th>
                  <th width="60%">事件</th>
                </tr>
                <tr v-for="(item, index) in locationList" :key="index">
                  <td>{{item.locationTime}}</td>
                  <td>{{item.position}}</td>
                </tr>
              </table>
              <p v-else class="no-data">暂无数据</p>
              <!-- <div class="m-style M-box"></div> -->
            </div>
            <!-- 详情 -->
            <div class="map_item item_detail" style="display:none;" >
              <div>
                <div class="map_item_row">
                  <span>所属公司：</span>
                  <p id ="company">{{orderDetail.company.name}}</p>
                </div>
                <div class="map_item_row">
                  <span>货主：</span>
                  <p id ="seller">{{orderDetail.seller.name}}</p>
                </div>
                <div class="map_item_row">
                  <span>订单号：</span>
                  <p id ="orderCode">{{orderDetail.code}}</p>
                </div>
                <div class="map_item_row">
                  <span>客户单号：</span>
                  <p id ="customerCode">{{orderDetail.customerCode}}</p>
                </div>
                <div class="map_item_row">
                  <span>订单日期：</span>
                  <p id ="orderDate">{{orderDetail.orderDate}}</p>
                </div>
                <div class="map_item_row">
                  <span>订单类型：</span>
                  <p id ="orderType">{{orderType[orderDetail.type-0+1]}}</p>
                </div>
                <div class="map_item_row">
                  <span>业务类型：</span>
                  <p id ="bizType">{{bizType[orderDetail.bizType-0+1]}}</p>
                </div>
                <div class="map_item_row">
                  <span>发货仓库：</span>
                  <p id ="warehouse">{{orderDetail.warehouse.name}}</p>
                </div>
                <div class="map_item_row">
                  <span>收货人：</span>
                  <p id ="receiver">{{orderDetail.receiver.name}}</p>
                </div>
              </div>
            </div>
            <!-- 明细 -->
            <div class="map_item item_goods" style="display:none;">
              <ol class="goods_list" v-if="goodList.length > 0" >
                <li v-for="(item, index) in goodList" :key="index">
                  <div class="goods_row">
                    <span>货品编号：</span>
                    <p>{{item.goodsCode}}</p>
                  </div>
                  <div class="goods_row">
                    <span>货品名称：</span>
                    <p>{{item.goodsName}}</p>
                  </div>
                  <div class="goods_row">
                    <span>存储方式：</span>
                    <p>{{storageType[item.goodsStorageType-1]}}</p>
                  </div>
                  <div class="goods_row">
                    <span>包装单位：</span>
                    <p>{{item.unit}}</p>
                  </div>
                  <div class="goods_row">
                    <span>件数：</span>
                    <p>{{item.quantity}}</p>
                  </div>
                  <div class="goods_row">
                    <span>重量：</span>
                    <p>{{item.weight}}</p>
                  </div>
                  <div class="goods_row">
                    <span>体积：</span>
                    <p>{{item.volume}}</p>
                  </div>
                  <div class="goods_row">
                    <span>保质期：</span>
                    <p>{{item.expPeriod}}</p>
                  </div>
                </li>
              </ol>
              <p v-else class="no-data">暂无数据</p>
            </div>
          </div>
        </div>
      </div>
      <div class="map_control" v-show="controlX">
        <span id="run" title="开始">
          <img src="static/trackMap/playericon_play.png">
        </span>
        <span id="stop" title="停止">
          <img src="static/trackMap/playericon_stop.png">
        </span>
        <span id="pause" title="暂停">
          <img src="static/trackMap/playericon_pause.png">
        </span>
      </div>
  </div>
</template>

<script>
import BMap from 'BMap';
import $ from 'jquery';
import {util, orgCode} from "../../API"
import {baseUrl} from '@/libs/constant'

export default {
  data(){
    return {
      // c48f8da6841ba09c3096738fa003afd9/638 正
      // 17e35af1cda6c65086e9503f7a304538/1271  测
      unikey: '',
      id: '',
      nodeList: [], // 节点
      goodList: [], // 明细
      locationList: [], // 定位点
      orderDetail: { // 订单详情
        company: { name: '' },
        seller: { name: '' },
        code: '',
        customerCode: '',
        orderDate: '',
        type: '',
        bizType: '',
        warehouse: { name: '' },
        receiver: { name: '' }
      },
      orderType: ['门店要货单', '前置仓调拨', '前置仓收货单', '总仓提货单', 'B2C订单', '自送包裹'],
      bizType: ['极速达', '半日达', '当日达', '次日达'],
      storageType: ['冷冻', '冷藏', '常温'],
      drv: {},
      lushu: {},
      controlX: false
    }
  },
  created(){
    this.unikey = this.$route.params.unikey
    this.id = this.$route.params.id
    document.title = '订单详情';
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap(){
      var map = new BMap.Map("allmap");
      map.centerAndZoom(new BMap.Point(121.487899486, 31.24916171), 13);
      map.enableScrollWheelZoom(true);

      const wareIcon = new BMap.Icon('static/trackMap/icon_zc.png', new BMap.Size(26,21)); // 总仓
      const preWareIcon = new BMap.Icon('static/trackMap/icon_qzc.png', new BMap.Size(26,28)); // 前置仓
      const storeIcon = new BMap.Icon('static/trackMap/icon_store.png', new BMap.Size(26,23)); // 门店
      const drvIcon = new BMap.Icon('static/trackMap/icon_map_track.png', new BMap.Size(32,32), {imageOffset: new BMap.Size(0, 0)}); // 轨迹图

      var pointArr = []
      var labelStyle = { display: 'none', border: 'none', background: 'none' }

      // 打开/关闭侧滑
      $('.map_top_arrow').off('click').on('click', function(){
        if($(this).hasClass('close')){
          $('.map_r_content').show();
          $('.tab_title').show();
          $(this).removeClass('close')
        }else{
          $('.map_r_content').hide();
          $('.tab_title').hide();
          $(this).addClass('close')
        }
      })

      // 切换tab
      $('.map_list li').off('click').on('click', function(){
        var idx = $(this).index();
        $('.tab_title').html($(this).html())
        $('.map_list li').removeClass('active')
        $('.map_item').hide();
        $('.map_list li').eq(idx).addClass('active')
        $('.map_item').eq(idx).show();
      })

      // 获取起始点、订单详情
      util(baseUrl, {
        params: {
          serviceName: 'com.vtradex.order.api.OrderApi',
          method: 'findOrderById',
          orderUnikey: this.unikey
        }
      }).then(response => {
        if(response.data.success){
          var result = JSON.parse(response.data.data.data);
          this.orderDetail = Object.assign({}, this.orderDetail, result)  //订单详情
          // console.log('起始点', result)

          // 门店  type=5 B2C类型 没有收货人
          if(result.type == '5' && result.locationUnikey){
            util(baseUrl, {
              params: {
                serviceName: 'com.vtradex.order.api.LocationApi',
                method: 'getMMLocationByUnikey',
                unikey: result.locationUnikey
              }
            }).then(resp => {
              if(resp.data.success){
                var res = JSON.parse(resp.data.data.data);
                // console.log('store1', res)
                var toPoint = new BMap.Point(res.longitude, res.latitude);
                var toMarker = new BMap.Marker(toPoint, {icon: storeIcon});
                var toLabel = new BMap.Label('<div class="ware_detal"><p>收货人：'+ result.contactName +'</p></div>', { offset: new BMap.Size(34,-10) });
                map.addOverlay(toMarker);
                pointArr.push(toPoint);
                toLabel.setStyle(labelStyle);
                toMarker.setLabel(toLabel);
                wareHoverHandler(toMarker, toLabel)
              }
            })
          }else if(result.receiver.id){
            util(baseUrl, {
              params: {
                serviceName: 'com.vtradex.order.api.ReceiverApi',
                method: 'getReceiverByID',
                id: result.receiver.id
              }
            }).then(resp => {
              if(resp.data.success){
                var res = JSON.parse(resp.data.data.data);
                // console.log('store', res)
                var toPoint = new BMap.Point(res.lng, res.lat);
                var toMarker = new BMap.Marker(toPoint, {icon: storeIcon});
                var toLabel = new BMap.Label('<div class="ware_detal"><p>门店：'+ res.name +'</p></div>', { offset: new BMap.Size(34,-10) });
                map.addOverlay(toMarker);
                pointArr.push(toPoint);
                toLabel.setStyle(labelStyle);
                toMarker.setLabel(toLabel);
                wareHoverHandler(toMarker, toLabel)
              }
            })
          }

          // 发货仓
          if(result.warehouse.id){
            util(baseUrl, {
              params: {
                serviceName: 'com.vtradex.order.api.WarehouseApi',
                method: 'getWarehouseById',
                id: result.warehouse.id
              }
            }).then(resp => {
              if(resp.data.success){
                var res = JSON.parse(resp.data.data.data);
                // console.log('sendWare', res)
                var fromPoint = new BMap.Point(res.lng, res.lat);
                var fromMarker = new BMap.Marker(fromPoint, {icon: res.type == '1' ? wareIcon : preWareIcon});
                var fromName = res.type == '1' ? '总仓：' : '前置仓：';
                var fromLabel = new BMap.Label('<div class="ware_detal"><p>'+ fromName + res.name +'</p></div>', { offset: new BMap.Size(34,-10) });
                map.addOverlay(fromMarker);
                pointArr.push(fromPoint);
                fromLabel.setStyle(labelStyle);
                fromMarker.setLabel(fromLabel);
                wareHoverHandler(fromMarker, fromLabel)
              }
            })
          }

          // 总仓
          util(baseUrl, {
            params: {
              serviceName: 'com.vtradex.order.api.WarehouseApi',
              method: 'findWarehouseList',
              supplierOrgUnikey: result.seller.unikey,
              type: '1'
            }
          }).then(resp => {
            // console.log('总仓', resp)
            if(resp.data.success){
              var res = JSON.parse(resp.data.data.data);
              var zPoint, zMarker, zName, zLabel;
              res.forEach(item => {
                zPoint = new BMap.Point(item.longitude, item.latitude);
                zMarker = new BMap.Marker(zPoint, {icon: item.type == '1' ? wareIcon : preWareIcon});
                zName = item.type == '1' ? '总仓：' : '前置仓：';
                zLabel = new BMap.Label('<div class="ware_detal"><p>'+ zName + item.orgName +'</p></div>', { offset: new BMap.Size(34,-10) });
                map.addOverlay(zMarker);
                pointArr.push(zPoint);
                zLabel.setStyle(labelStyle);
                zMarker.setLabel(zLabel);
                wareHoverHandler(zMarker, zLabel)
              })
            }
          })

          // map.setViewport(pointArr); // 同屏
        }else{
          alert(response.data.message)
          // this.$message({
          //   message: result.message,
          //   type: 'error'
          // });
        }
      })

      // 监听事件
      function wareHoverHandler(marker, label){
        marker.addEventListener("mouseover", function(e){
          label.setStyle({
            display: 'block'
          });
          marker.setTop(true)
        });
        marker.addEventListener("mouseout", function(e){
          label.setStyle({
            display: 'none'
          });
          marker.setTop(false)
        });
      }

      // 轨迹
      util(baseUrl, {
        params: {
          serviceName: 'com.vtradex.tms.server.api.TmsService',
          method: 'getTransportByOrderUnikey',
          orderUnikey: this.unikey
        }
      }).then(response => {
        if(response.data.success){
          var result = !!response.data.data.data ? JSON.parse(response.data.data.data) : '';
            if(result){
            var trackNo = result.code +'.'+ result.gpsNo
            // console.log('trackNo', result)
            if(!!result.gpsNo){
              const content = {
                trackNo: trackNo,
                startTime: '2000-01-01 12:12:12',
                endTime: '2099-09-09 09:09:09',
                pointCount: '9999'
              }

              util(baseUrl, {
                params: {
                  serviceName: 'com.vtradex.ehub.lbs.api.LbsService',
                  method: 'queryTrack',
                  orgKey: orgCode,
                  content: JSON.stringify(content)
                }
              }).then(res => {
                if(res.data.success){
                  const data = JSON.parse(res.data.data.responseBody)
                  var route = data.routeList.length > 0 ? data.routeList[0].point : []
                  var len = route.length;
                  var arr = [], arrLine = [];
                  this.locationList = route
                  // console.log('轨迹', route)

                  if(len > 0){
                    this.controlX = true
                    for(var i=len-1; i>=0; i--){
                      var item = route[i]
                      arr.push({lat: item.latitude, lng: item.longitude})
                      arrLine.push(new BMap.Point(item.longitude, item.latitude))

                      // 起点
                      if(i == len-1){
                        var firstPoint = new BMap.Point(item.longitude, item.latitude)
                        var firstMarker = new BMap.Marker(firstPoint);
                        firstMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        map.addOverlay(firstMarker);
                      }
                    }

                    map.panTo(new BMap.Point(route[len-1].longitude,route[len-1].latitude));
                    var lushu;
                    var drv = new BMap.DrivingRoute('上海', {
                      onSearchComplete: function(res) {
                        if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                          map.addOverlay(new BMap.Polyline(arrLine, {strokeColor: '#3f971d'}));
                          map.setViewport(arrLine);
                          
                          lushu = new BMapLib.LuShu(map, arr, {
                            autoView: true,
                            speed: 4500,
                            icon: drvIcon,
                            landmarkPois: [
                              {lng: 116.314782, lat: 39.913508, html: '加油站', pauseTime: 2}
                            ]
                          });     
                        }
                      }
                    });
                    this.drv = drv
                    this.lushu = lushu  
        
                    var fromPoint = new BMap.Point(route[0].longitude, route[0].latitude);
                    var toPoint = new BMap.Point(route[len-1].longitude, route[len-1].latitude);
                    drv.search(fromPoint, toPoint);

                    //绑定事件
                    $('#run').off('click').on('click', function(){
                      lushu.start();
                    })

                    $('#stop').off('click').on('click', function(){
                      lushu.stop();
                    })
                    $('#pause').off('click').on('click', function(){
                      lushu.pause();
                    })
                  }
                }else{
                  this.controlX = false
                  alert(res.data.message)
                  // this.$message({
                  //   message: result.message,
                  //   type: 'error'
                  // });
                }
              })
            }
          }
        }else{
          alert(res.data.message)
          // this.$message({
          //   message: result.message,
          //   type: 'error'
          // });
        }
      })

      this.getNode()
      this.getGoods()
    },
    /**
     * 订单节点
     */
    getNode(){
      util(baseUrl, {
        params: {
          serviceName: 'com.vtradex.order.api.OrderApi',
          method: 'getOrderTrackByUnikey',
          orderUnikey: this.unikey
        }
      }).then(response => {
        if(response.data.success){
          var result = JSON.parse(response.data.data.data);
          this.nodeList = result
        }
      })
    },
    /**
     * 订单明细
     */
    getGoods(){
      util(baseUrl, {
        params: {
          serviceName: 'com.vtradex.order.api.OrderApi',
          method: 'findOrderDetailPageById',
          pageSize: 999,
          id: this.id
        }
      }).then(response => {
        if(response.data.success){
          var result = JSON.parse(response.data.data.page).result;
          this.goodList = result
          // console.log('订单明细', result)
        }
      })
    },
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    }
  }
}
</script>

<style>
.map_container, #allmap { position: relative; width: 100%; height: 100%; }
.map_container * { margin: 0; padding: 0; font-size: 13px; }

.ware_detal { position: relative; width: 240px; padding: 4px 12px 10px; border-radius: 5px; background: rgba(0,0,0,0.6); }
.ware_detal:before { content: ''; width:0; height:0; overflow:hidden; font-size: 0; line-height: 0; border-width: 8px; border-style: solid; border-color: transparent rgba(0,0,0,0.6) transparent transparent; position: absolute; top: 12px; left: -16px; }
.ware_detal p { white-space: normal; line-height: 20px; margin-top: 6px; color: #fff; }

.map_nav { position: absolute; top: 0; left: 0; bottom: 0; width: 360px; height: 100%;}
.map_nav .map_nav_top { height: 40px; }
.map_nav .map_nav_top .tab_title { margin-left: 40px; padding-right: 40px; height: 40px; line-height: 40px; background: #8da3ba; padding: 0 18px; font-size: 15px; color: #fff; transition: .38s; }
.map_nav .map_nav_top .map_logo_icon { float: left; width: 40px; height: 40px; background: #4ba6f5; text-align: center; }
.map_nav .map_nav_top .map_logo_icon img { margin-top: 6px; width: 28px; height: 28px; }
.map_nav .map_nav_top .map_top_arrow { position: absolute; top: 0; left: 320px; width: 40px; height: 40px; background: #9bb0c3; cursor: pointer; text-align: center; cursor: pointer; }
.map_nav .map_nav_top .map_top_arrow:hover { opacity: 0.8; }
.map_nav .map_nav_top .map_top_arrow.close { left: 40px; }
.map_nav .map_nav_top .map_top_arrow img { margin-top: 10px; width: 20px; height: 20px; }
.map_nav .map_nav_top .map_top_arrow.close img { transform: rotate(180deg); transition: .38s; }

.map_content { height:calc(100% - 40px); overflow: auto; }
.map_content ul.map_list { float: left; width: 40px; height: 100%; overflow: auto; background: #4b4f5a; }
.map_content ul.map_list li { height: 38px; line-height: 38px; font-size: 13px; color: #fff; text-align: center; border-left: 1px solid transparent; }
.map_content ul.map_list li:hover { cursor: pointer; background: #535b66; }
.map_content ul.map_list li.active { background: #535b66; border-left-color: #4ba6f5; }
.map_content .map_r_content { margin-left: 40px; height: 100%; background: #fff; transition: .38s; overflow-y: auto; }
.map_content .map_r_content .map_item { padding-bottom: 12px; display: none; }
.map_content .map_r_content .map_item.item_dot { display: block; }

.item_detail { padding: 8px 20px; }
.map_item_row { min-height: 20px; padding: 2px 0; line-height: 20px; }
.map_item_row span { float: left; color: #373737; }
.map_item_row p { margin-left: 80px; color: #666; }

.map_tip_dialog { position: absolute; top: 12px; right: 12px; width: 200px; background: rgba(255, 255, 255, 0.7); border-radius: 5px; padding: 16px; box-shadow: 0 0 10px #999; }
.map_tip_dialog p { font-size: 13px; line-height: 20px; color: #666; padding: 4px 0; }
.map_control { position: absolute; bottom: 30px; right: 30px; background: rgba(255, 255, 255, 0.7); border-radius: 5px; padding: 8px; box-shadow: 0 0 10px #999; }
.map_control span { display: inline-block; padding: 0 8px; cursor: pointer; } 
.map_control span:hover { opacity: 0.8; }
/* .map_control #run { background:url('static/trackMap/playericon_play.png') center center no-repeat; } */
/* .map_control #stop { background:url(static/trackMap/playericon_stop.png) center center no-repeat; } */
/* .map_control #pause { background:url(static/trackMap/playericon_pause.png) center center no-repeat; } */

/*节点*/
.map_item .no-data { margin-top: 20px; text-align: center; line-height: 28px; font-size: 14px; color: #999; }
.item_dot { padding: 20px 12px; }
.dot_list { margin-left: 30px; padding-left: 20px; border-left: 1px solid #cfcfcd; }
.dot_list li { position: relative; font-size: 13px; color: #666; line-height: 24px; padding-bottom: 16px; }
.dot_list li:after { content: ''; width: 11px; height: 11px; border-radius: 50%; background: #4e963b; position: absolute; top: 0; left: -26px; }
.dot_list li .dot_c p { float: left; width: 140px; }
.dot_list li .dot_c .name { float: right; width: 86px; text-align: right; }
.dot_list li span { display: block; }
.dot_list li .address { clear: both; margin-top: 6px; line-height: 20px; }
/* .dot_list li .address { clear: both; padding-left: 20px; margin-top: 6px; line-height: 20px; background:url(static/trackMap/icon_mark.png) no-repeat; } */

/*定位*/
.location_tab { display: table; border-collapse: separate; width: 100%; }
.location_tab tr { line-height: 20px; }
.location_tab tr:nth-child(2n-1) { background: #f8f8f8; }
.location_tab th { background: #f0f0f0; text-align: left; color: #373737; padding: 4px 8px; }
.location_tab td { color: #666666; padding: 4px 8px;}

.goods_list { padding: 8px 20px; }
/* .goods_list li { padding: 8px 20px; margin-bottom: 12px; border-radius: 5px; box-shadow: 0 0 8px #ccc; } */
.goods_list li { padding: 8px 20px; border-bottom: 1px solid #f8f8f8; }
.goods_list li:last-child { border-bottom: none; }
.goods_list li .goods_row { color: #666; min-height: 20px; padding: 2px 0; line-height: 20px; }
.goods_list li span { float: left; }
.goods_list li p { margin-left: 80px; }
/* .map_item_row { min-height: 20px; padding: 2px 0; line-height: 20px; }
.map_item_row span { float: left; color: #373737; }
.map_item_row p { margin-left: 80px; color: #666; } */

/*影像*/
.item_image { padding: 8px 20px; font-size: 13px; line-height: 24px; }
.item_image title { font-weight: bold; }
.item_image p { color: #666666; }
#photos_cont { margin-top: 12px; }
#photos_cont img { float: left; width: 80px; height: 80px; margin-right: 20px; margin-bottom: 20px; }
#photos_cont img:nth-child(3n) { margin-right: 0 }

</style>

