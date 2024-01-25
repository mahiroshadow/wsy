<template>
  <!-- <div class="p-4">
    <Space direction="vertical" :style="{width:'100%'}" :size="[0, 48]">
      <Layout :style="{height:'80vh'}">
        <Layout>
          <LayoutSider :style="siderStyle" width="350">
            <VisitSpeed :loading="loading" :randomSpeed="speed"></VisitSpeed>
          </LayoutSider>
          <Layout>
          <LayoutContent :style="contentStyle">
            <div class="camera" style="width:100%;height:100%;">
              <video
                id="videoElement"
                controls
                autoplay
                muted
                style="width: 100%; height: 100%; object-fit: fill"
                ></video>
            </div>
           <UnityVue :unity="unityContext" /> 
          </LayoutContent> 
        </Layout>
        </Layout>
        <LayoutFooter :style="footerStyle">
            <Row>
              <Col :span="6">
                <Icon icon="seatr|svg" :size="30"></Icon>
              </Col>
              <Col :span="6">
                <Icon icon="fan|svg" :size="30"></Icon>
              </Col>
              <Col :span="6">
                <Icon icon="seatl|svg" :size="30"></Icon>
              </Col>
              <Col :span="6">
                <Icon icon="music|svg" :size="30"></Icon>
              </Col>
            </Row>
        </LayoutFooter>
      </Layout>
    
    </Space>
     <UnityVue :unity="unityContext" />
    <div class="md:flex enter-y">
      <VisitRadar class="md:w-1/3 w-full" :loading="loading" :randomSpeed="speed"></VisitRadar>
      <VisitSource class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
      <SalesProductPie class="md:w-1/3 w-full" :loading="loading" />
    </div>
  </div> -->
  <div class="p-4">
      <div class="all-container">
          <div class="online-container">
            <VisitSpeed :loading="loading" :randomSpeed="speed"></VisitSpeed>
          </div>
          <div class="video-container">
                <video id="videoElement" controls autoplay muted style=" width: 100%;height: 100%;object-fit: fill">
            </video>
            <div class="unity-screen">
                <UnityVue :unity="unityContext" />
            </div>
          </div>
         </div>
      <div class="footer" >
        <Icon :icon="item" :size="30" v-for="item in iconList"></Icon>
      </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref,onMounted,onUnmounted} from 'vue'
  import VisitSpeed from './components/VisitSpeed.vue'
  import { Icon } from '/@/components/Icon'
  import UnityWebgl from 'unity-webgl'
  import UnityVue from 'unity-webgl/vue';
  import flvjs from 'flv.js'



  const flvPlayer = ref(null)
  const iconList=ref<Array<string>>([
    'car|svg','warmwind|svg','coldwind|svg','seatr|svg','fan|svg','seatl|svg','music|svg'
  ])
  const loading = ref(true)
  const speed=ref(0)

  const ws=ref(null)

  const unityContext=new UnityWebgl({
    loaderUrl: '/Build/Test.loader.js',
    dataUrl: '/Build/Test.data',
    frameworkUrl: '/Build/Test.framework.js',
    codeUrl: '/Build/Test.wasm',
    companyName: 'test',
    productName: 'test',
  })

  // 连接方法
  const onpen=()=>{
    console.log('connection success')
  }

  const onmessage=(message)=>{
    const {data}=message
    const info=JSON.parse(data.replaceAll('\'','\"'))
    console.log(info.speed)
    speed.value=info.speed
  }

  const onclose=()=>{
    console.log('connection close')
  }

  const initWebSocket=(url)=>{
    const websocket=new WebSocket(url)
    websocket.onopen=onpen
    websocket.onmessage=onmessage
    websocket.onclose=onclose
    ws.value=websocket
  }
  



  const createVideo = () => {
    if (flvjs.isSupported()) {
      var videoElement = document.getElementById('videoElement');
      flvPlayer.value = flvjs.createPlayer(
        {
          type: 'flv',
          url: 'http://110.42.207.216/flv?[port=80]&app=live&stream=test', 
          isLive: true,
          hasAudio: false,
          
        }
      );
      flvPlayer.value.attachMediaElement(videoElement);
      flvPlayer.value.load();
      setTimeout(()=>{
        flvPlayer.value.play();
      }, 300);
    }
  }

  const destroy = () => {
    flvPlayer.value.pause() //暂停播放数据流
    flvPlayer.value.unload() //取消数据流加载
    flvPlayer.value.detachMediaElement()//将播放实例从节点中取出
    flvPlayer.value.destroy()//销毁播放实例
    flvPlayer.value = null
  }
  onMounted(()=>{
    // 初始化flv播放器
    createVideo()
    // 初始化websocket
    initWebSocket('ws://192.168.2.4:8270/carSocket/1211')
  })

  setTimeout(() => {
    loading.value = false
  }, 500)
  
  onUnmounted(()=>{
    destroy()
  })

</script>
<style scoped lang="less">
  .camera{
    width:40px;
    height:60px;
    position: absolute;
    right: 0%;
    top: 0%;
    z-index: 999;
  }
  .footer{
    width: 100%;
    height: 50px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    background-color: black;
  }
  .all-container{
    display: flex;
    height: 600px;
    width: 100%;
    .video-container{
      width: 70%;
      height: inherit;
      position: relative;
      .unity-screen{
        width: 30%;
        height: 25%;
        position: absolute;
        top: 0%;
        right: 0%;
        border-radius:0px 0px 0px 10px;
        overflow: hidden;
      }
    }
    .online-container{
      width:30% ;
      height: inherit;
    } 
  }

//   .ant-carousel {
//     width: 100%;
//     height: 100%;
//     :deep(.slick-slide) {
//       overflow: hidden;
//       width: 100%;
//       height: 600px;
//     }
// }
</style>
