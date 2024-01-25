<template>
  <Card :loading="loading" :style="{ width, height,backgroundColor,border}">
    <template #title>
      <canvas ref="trafficLight" width="300" height="80"></canvas>
      <span>{{currentLight}}倒计时:{{ lightTimeLeft }}</span>
    </template>
    <!-- <div style="display: flex;justify-content: space-between;">
    </div> -->
    <div style="display: flex; justify-content: space-between;">
            <Icon icon="warn|svg" :size="30"></Icon>
            <Icon icon="lighth|svg" :size="30"></Icon>
        </div>
        <div>
            <div ref="chartRef" class="chart" style="width: 300px;height: 300px;margin:0 auto;"></div>
        </div>
        <div>
          <Row>
            <Col :span="8">
              <div style="display: flex; justify-content: center;align-items: center;color: black;font-size: 10px;">
                <span style="color: grey;">P&nbsp;</span>   <!-- 停车档 -->
                <span>R&nbsp;</span>   <!-- 空档 -->
                <span>N&nbsp;</span>   <!-- 空档 -->
                <span>D&nbsp;</span>   <!-- 前进档 -->
              </div>
            </Col>
            <Col :span="8">
              <div style="display: flex;justify-content: center;align-items: center;color: black;font-size: 10px;">
                <span>MPH</span>
              </div>
            </Col>
            <Col :span="8">
              <div style="display: flex; justify-content: center;align-items: center;color: black;font-size: 10px;">
                <span>90%&nbsp;</span>
                <Icon icon="berry|svg"></Icon>
              </div>
            </Col>
          </Row>
        </div>
        
  </Card>
</template>
<style>

</style>
<script lang="ts" setup>
  import {Icon} from '/@/components/Icon'
  import { Ref, ref, watch,onMounted,unref} from 'vue'
  import { Card,Row,Col} from 'ant-design-vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { GaugeChart } from 'echarts/charts'
  const props = defineProps({
    loading: Boolean,  
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '100%',
    },
    backgroundColor:{
      type:String as PropType<string>,
      default:'#fff'
    },
    border:{
      type:String as PropType<string>,
      default:'0px'
    },
    randomSpeed:Number
  })
  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions,echarts} = useECharts(chartRef as Ref<HTMLDivElement>)
  const trafficLight=ref(null)
  const ctx=ref(null)
  const currentLight=ref('绿灯')
  const lightTimeLeft=ref(5)
  const timer=ref(null)

  const drawTrafficLight=(currentLight)=>{
    const radius=24
    const gap=10
    const x=trafficLight.value.width
    const y=trafficLight.value.height
    const colorList=['FF0000','0000FF','#00FF00']
    const colorShadowList=['#A20000','#A28600','#007911']
    let ctx1=null
    if (unref(ctx)){
    // 初始化canvas
        ctx1=ctx.value
    }
    else{
        ctx1=trafficLight.value.getContext('2d')
    }
    ctx1.fillStyle='black'
    ctx1.fillRect(0,0,radius*6+2*gap,radius*2)

    let color
    for(var i=1;i<=3;i++){
      color=(i==currentLight?colorList[i-1]:colorShadowList[i-1])
      console.log(color)
      ctx1.beginPath()
      ctx1.arc(radius*(2*i-1)+i*gap,y/2,radius,0,Math.PI*2)
      ctx1.closePath()
      ctx1.fillStyle='grey'
      ctx1.fill()

      ctx1.beginPath()
      ctx1.arc(radius*(2*i-1)+i*gap,y/2,radius-3,0,Math.PI*2)
      ctx1.closePath()
      ctx1.fillStyle=color
      ctx1.fill()
    }
    ctx.value=ctx1
  }
  
  // echarts
  echarts.use([GaugeChart])
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return
      }
      setOptions({
        tooltip: {
          formatter: '{a}<br/>{b} : {c}',
        },

        series: [
          {
            name: '速度',
            type: 'gauge',
            progress: {
              show: true,

              itemStyle: {
                color: '#165DFF',
              },
            },
            pointer: {
              width: 5,
              itemStyle: {
                color: '#165DFF',
              },
            },
            detail: {
              valueAnimation: true,
              formatter: function (value) {
                if (isNaN(value)) {
                  return '加载中';
                } else{
                  return value + '%';
                }
              },
              fontSize: 20,
            },
            data: [
              {
                value: 0,
              },
            ],
          },
        ],
      })
    },
    { immediate: true },
  )
  watch(
    () => props.randomSpeed,
    () => {
      setOptions(
        {
          series: {
            data: [
              {
                value: props.randomSpeed,
              },
            ],
          },
        },
        false,
      );
    },
  )

  onMounted(()=>{
    // 画图
    drawTrafficLight(3)
    timer.value=setInterval(()=>{
      drawTrafficLight(3)
      lightTimeLeft.value--
      if (!lightTimeLeft.value){
        console.log(lightTimeLeft.value)
        drawTrafficLight(-1)
        clearInterval(unref(timer))
      }

    },1000)
  })


</script>
<style>

</style>
