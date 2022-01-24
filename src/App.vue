<template>
  <div>
    <div class="tool-bar">
      <ul class="tool-bar-left">
        <li>
          <button type="button" v-on:click="reset">Reset</button></li>
      </ul>
      <ul class="tool-bar-right">
        <li>
          <div class="zoom-controls">
            <button v-on:click="zoomOut" type="button"> - </button>
            <span class="text-span">{{ zoomLevel }}%</span>
            <button v-on:click="zoomIn" type="button"> + </button>
          </div>
        </li>
        <li>
          <select v-model="activeHotspotId">
            <option value="">No hotspot selected</option>
            <option :value="hotspot.id" v-for="(hotspot, index) in hotspots" :key="'item-'+index">
              Hotspot #{{ index }}
            </option>
          </select>
        </li>
      </ul>
    </div>
    <div id="app" class="hotspots-container" :style="'width:'+zoomLevel + '%'">
      <img 
          :src="image"
          class="hotspots-image"
          alt="Hotspot image"
          @load="onImageLoaded"
          v-on:click="addHotspot"
          v-on:contextmenu="onContextMenu"
          ref="hotspotImage"
      >
      <Hotspot 
          if="imageReady"
          v-for="(hotspot, index) in hotspots"
          :key="'hotspot-'+index"
          :hotspot="hotspot"
          :image="$refs.hotspotImage"
          :ref="'hotspot'+index"
          :index="index"
      />
    </div>
  </div>
</template>

<script>
import Hotspot from './components/Hotspot.vue';

export default {
  name: 'App',
  components: {
    Hotspot
  },
  data(){
    return {
      zoomLevel: 100,
      image: '',
      imageReady: false
    }
  },
  computed: {
    hotspots(){
      return this.$store.getters.hotspots;
    },
    activeHotspotId:{
      get()
      {
        return this.$store.getters.active;
      },
      set(value)
      {
        if(value){
          const hotspot = this.$store.getters.hotspot(value);
          this.$store.dispatch('setActive', hotspot);
        } else{
          this.$store.commit('setActive', '');
        }
        
      }
      
    }
  },
  methods: {
    onImageLoaded(event){
      if (event.target.complete === true) {
        this.imageReady = true
      }
    },
    onContextMenu(event){
      event.preventDefault();
      this.activeHotspotId = ''
    },
    addHotspot(event){
      const relativeX = event.offsetX
      const relativeY = event.offsetY
      const height = this.$refs.hotspotImage.offsetHeight
      const width = this.$refs.hotspotImage.offsetWidth
      const hotspot = {
        id:'',
        type: '',
        x: relativeX / width * 100, 
        y: relativeY / height * 100,
        product: {
          name: '',
          id: '',
          variantId:''
        },
        paragraph: {
          id:''
        },
        content:''
      };
      
      this.$store.dispatch('addHotspot', hotspot);
    },
    zoomIn(){
      if(this.zoomLevel < 100){
        this.zoomLevel += 10;
      }
      
    },
    zoomOut(){
      if(this.zoomLevel > 10){
        this.zoomLevel -= 10;
      }
    },
    reset(){
      if(confirm('Reset will remove all hotspots from the image. Do you want to proceed?')){
        this.$store.dispatch('reset');
      }
    }
  },
  mounted(){
    this.image = this.$store.getters.image;
  }
}
</script>

<style lang="scss">
body,html{
  padding: 0;
  margin:0;
  font-family: Arial;
  background-color: #f1f1f1;
}
*{
  box-sizing: border-box;
}
.tool-bar{
  background-color: #e1e1e1;
  display: flex;
  box-shadow: 0 1px 3px rgba(0,0,0, .3);
  z-index: 1;
  position: relative;
  ul{
    padding: 0;
    margin:0;
    list-style: none;
    display: flex;
    &.tool-bar-left{
      margin-right: auto;
      li{
        border-right: 1px solid #d1d1d1;
      }
    }
    &.tool-bar-right{
      margin-left: auto;
      li{
        border-left: 1px solid #d1d1d1;
      }
    }
    li{
      button, select, span.text-span{
        padding: .5em;
        height: 100%;
        font-size: .85em;
      }
    }
  }
  .zoom-controls{
    .text-span{
      width: 60px;
      display: inline-block;
      text-align: center;
    }
    button{
      width: 20px;
    }
  }
  button, select{
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }
}
.hotspots-container{
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  margin: 0 auto;
  transition: width .25s ease;

  .hotspots-image {
    max-width: 100%;
    width: 100%;
    cursor: copy;
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
}

</style>
