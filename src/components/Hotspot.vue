<template>
  <div 
      :class="hotspot.type === '' ? 'hotspots-point is-empty' : 'hotspots-point'"
      :style="`top: ${hotspot.y}%; left: ${hotspot.x}%;`"
      :data-type="hotspot.type"
      :title="'hotspot #'+index"
      draggable="true"
      v-on:click="setActive"
      v-on:dragend="onDragStop"
  >
    <div class="type-icon">
      <unicon v-if="hotspot.type === ''" name="exclamation-triangle" fill="white" width="14" height="14"></unicon>
      <unicon v-else-if="hotspot.type === 'content'" name="align-left" fill="#1f1f1f" width="14" height="14"></unicon>
      <unicon v-else-if="hotspot.type === 'paragraph'" name="file-alt" fill="#1f1f1f" width="14" height="14"></unicon>
      <unicon v-else-if="hotspot.type === 'product'" name="shopping-cart" fill="#1f1f1f" width="14" height="14"></unicon>
    </div>
    <div v-if="isActive" class="hotspot-point-popover">
      <div class="hotspot-point-popover-form">
        <div class="hotspot-point-popover-row">
          <select v-model="hotspot.type">
            <option value="">Select type</option>
            <option value="content">Content</option>
            <option value="product">Product</option>
            <option value="paragraph">Paragraph</option>
          </select>
        </div>
        <div v-if="hotspot.type === 'content'" class="hotspot-point-popover-row">
          <textarea v-model="hotspot.content" v-on:keyup="debounceInput"></textarea>
        </div>
        <div v-if="hotspot.type === 'product'" class="hotspot-point-popover-row">
          <input type="hidden" v-model="hotspot.product.id">
          <input type="hidden" v-model="hotspot.product.variantId">
          <input type="hidden" v-model="hotspot.product.name">
          <p>Product: {{ hotspot.product.name || 'none' }}</p>
          <button v-on:click="showProductSelector">Select product</button>
        </div>
        <div v-if="hotspot.type === 'paragraph'" class="hotspot-point-popover-row">
          <input type="hidden" v-model="hotspot.paragraph.id">
          <p>Paragraph: {{ hotspot.paragraph.id || 'none' }}</p>
          <button v-on:click="showParagraphSelector">Select paragraph</button>
        </div>
        <div class="hotspot-point-popover-row">
          <button type="button" class="delete-btn" v-on:click="deleteHotspot">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

import utils from '../utils';
let vm;

export default {
  name: 'Hotspot',
  props: ['hotspot', 'index', 'image'],
  data() {
    return {
      isTyping: false,
      isDragging: false
    }
  },
  computed:{
    isActive(){
      return this.hotspot.id === this.$store.getters.active;
    }
  },
  methods: {
    debounceInput: utils.debounce( () => {
        vm.update();
      }, 250, false),
    update(){
      this.$store.dispatch('updateHotspot', this.hotspot);
    },
    deleteHotspot(){
      if(confirm('Delete hotspot?')){
        this.$store.dispatch('deleteHotspot', this.hotspot);
      }
    },
    setActive(){
      this.$store.dispatch('setActive', this.hotspot);
    },
    
    showProductSelector(){
      alert('Pop DW product selector');
      const productDialogueCaller = 'window.opener.document.forms.paragraph_edit.DW_REPLACE_ProductID' + this.hotspot.product.id;
      let productDialog = window.open( '/Admin/Module/eCom_Catalog/dw7/Edit/EcomGroupTree.aspx?CMD=ShowProd&AddCaller=1&caller=' + productDialogueCaller, '', 'displayWindow,width=460,height=400,scrollbars=no' );
      let isProductDialogClosedInterval = setInterval( () => {
        if ( productDialog.closed === true ) {
          clearInterval( isProductDialogClosedInterval );
          console.log('update');
        }
      }, 50 );
    },
    showParagraphSelector(){
      alert('Pop DW product selector');
    },
    onDragStop(event){
      event.preventDefault();
      const image        = this.image;
      const relativeOffset = image.offsetParent;
      const dropPosition = {
        x: ( ( ( event.pageX - relativeOffset.offsetLeft ) + document.body.scrollLeft ) / image.clientWidth * 100 ),
        y: ( ( ( event.pageY - relativeOffset.offsetTop ) + document.body.scrollTop ) / image.clientHeight * 100 )
      };
      this.hotspot.y = dropPosition.y;
      this.hotspot.x = dropPosition.x;
      this.update();
    }
  },
  created() {
    this.setActive();
    vm = this;
  }
}
</script>
s
<style scoped lang="scss">
.hotspots-point {
  height: 20px;
  width: 20px;
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  z-index: 200;
  margin-left: -10px;
  margin-top: -10px;
  background-color:#EEE;
  box-shadow: 0 0 2px 1px rgba(0,0,0,.3);
  font-size: .75em;
  &::after{
    content: attr(title);
    top: 100%;
    margin-top: 3px;
    position: absolute;
    margin-left: 50%;
    transform: translateX(-50%);
    color: #555;
    font-size: .85em;
    background-color: rgba(255,255,255, .75);
    padding: 3px;
    text-transform: capitalize;
    white-space: nowrap;
  }
  .type-icon{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 3px;
  }
  &.is-empty{
    background-color: #d3603c;
  }
  .hotspot-point-popover{
    position: absolute;
    height:auto;
    width: 200px;
    background: rgba(255,255,255,.8);
    bottom: 28px;
    margin-left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    *{
      width: 100%;
    }
    p{
      margin-bottom: 3px;
      margin-top:0;
    }
    &::after{
      content:'';
      display: block;
      position: absolute;
      left: 50%;
      bottom: -10px;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-bottom: 5px solid transparent;
      border-top: 5px solid rgba(255,255,255,.8);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }
    .hotspot-point-popover-form{
      .hotspot-point-popover-row:not(:first-child){
        margin-top: 5px;
      }
      button{
        border: 1px solid #e1e1e1;
        border-radius: 0;
        background-color: white;
        color: #1f1f1f;
        padding: 5px;
        font-size: .95em;
        cursor: pointer;
      }
      .delete-btn{
        border: 1px solid #a13810;
        background-color: #d3603c;
        color: #f1f1f1;
      }
    }
  }
}
</style>
