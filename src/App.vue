<template>
  <div id="app">
    <div class="tool-bar">
      <ul class="tool-bar-left">
        <li>
          <button type="button" v-on:click="reset"><unicon name="trash-alt" fill="#d3603c" width="12" height="12"></unicon> Reset</button>
        </li>
        <li>
          <button type="button" ><unicon name="image-plus" fill="#d3603c" width="12" height="12"></unicon> Select image</button>
        </li>
      </ul>
      <ul class="tool-bar-right">
        <li>
          <div class="zoom-controls">
            <button v-on:click="zoomOut" type="button" :disabled="(zoomLevel === 10)">
              <unicon name="search-minus" fill="#1f1f1f" width="14" height="14"></unicon>
            </button>
            <span class="text-span">{{ zoomLevel }}%</span>
            <button v-on:click="zoomIn" type="button" :disabled="(zoomLevel === 100)">
              <unicon name="search-plus" fill="#1f1f1f" width="14" height="14"></unicon>
            </button>
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
    <div class="hotspots-container" :style="'width:'+zoomLevel + '%'">
      <img 
          :src="image"
          class="hotspots-image"
          alt="Hotspot image"
          @load="onImageLoaded"
          v-on:click="addHotspot"
          v-on:contextmenu="onContextMenu"
          ref="hotspotImage"
          v-on:dragover="onDragOver"
          v-on:drop="onDragStop"
      >
      <Hotspot 
          if="imageReady"
          v-for="(hotspot, index) in hotspots"
          :key="'hotspot-'+index"
          :hotspot="hotspot"
          :image="$refs.hotspotImage"
          :ref="'hotspot'+index"
          :index="index"
          @onHotspotMove="onHotspotMove"
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
      imageReady: false,
      movingHotspot: null
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
    onHotspotMove(hotspot){
      this.movingHotspot = hotspot;
    },
    onDragOver(event){
      event.preventDefault();
      return false;
    },
    onDragStop(event){
      event.preventDefault();
      const image        = this.$refs.hotspotImage;
      const relativeOffset = image.offsetParent;
      const dropPosition = {
        x: ( ( ( event.pageX - relativeOffset.offsetLeft ) + document.documentElement.scrollLeft ) / image.clientWidth * 100 ),
        y: ( ( ( event.pageY - relativeOffset.offsetTop ) + document.documentElement.scrollTop ) / image.clientHeight * 100 )
      };
      this.movingHotspot.y = dropPosition.y;
      this.movingHotspot.x = dropPosition.x;
      this.$store.dispatch('updateHotspot', this.movingHotspot);
      this.movingHotspot = null;
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
  background-color: #414141;
}
*{
  box-sizing: border-box;
}
#app{
  max-width: 1600px;
  margin:0 auto;
  box-shadow: 0 0 0 1px rgba(0,0,0, .5);
  background-color: #717171;
}
.tool-bar{
  background-color: #e1e1e1;
  display: flex;
  box-shadow: 0 1px 3px rgba(0,0,0, .3);
  z-index: 1;
  position: relative;
  margin-bottom: 5px;
  padding: 0 1em;
  ul{
    padding: 0;
    margin:0;
    list-style: none;
    display: flex;
    &.tool-bar-left{
      margin-right: auto;
      border-left: 1px solid #d1d1d1;
      li{
        border-right: 1px solid #d1d1d1;
      }
    }
    &.tool-bar-right{
      margin-left: auto;
      border-right: 1px solid #d1d1d1;
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
      width: 50px;
      display: inline-block;
      text-align: center;
      border-left: 1px solid #d1d1d1;
      border-right: 1px solid #d1d1d1;
      background-color: #d1d1d1;
    }
    button{
      width: 30px;
      &:disabled{
        opacity: .5;
        pointer-events: none;
      }
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
  transition: width .15s ease;

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
