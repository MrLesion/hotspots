import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const saveData = (state) =>{
  document.getElementById('hotspotData').value = JSON.stringify(
      {
        hotspots: state.hotspots,
        image: state.image
      }
  );
};

export default new Vuex.Store({
  state: {
    active: '',
    hotspots:[],
    image: ''
  },
  getters:{
    image(state){
      return state.image;
    },
    hotspots(state){
      return state.hotspots;
    },
    active(state){
      return state.active;
    },
    hotspot: (state) => (hotspotId) =>{
      return state.hotspots.find(h => h.id === hotspotId);
    }
  },
  mutations: {
    loadData(state, json){
      if(json.hotspots){
        state.hotspots = json.hotspots;
      }
      if(json.image){
        state.image = json.image;
      }
    },
    setActive(state, hotspotId){
      state.active = hotspotId;
    },
    setImage(state, imagePath){
      state.image = imagePath;
      saveData(state);
    },
    addHotspot(state, hotspot){
      state.hotspots.push(hotspot);
      saveData(state);
    },
    updateHotspot(state, hotspotData){
      state.hotspots[hotspotData.hotspotToUpdateIndex] = hotspotData.hotspot;
      saveData(state);
    },
    deleteHotspot(state, hotspotData){
      state.hotspots.splice(hotspotData.hotspotToDeleteIndex, 1);
      state.active = '';
      saveData(state);
    },
    reset(state){
      state.active = '';
      state.hotspots = [];
      saveData(state);
    }
  },
  actions: {
    setActive(store, hotspot){
      store.commit('setActive', hotspot.id);
    },
    setImage(store, imagePath){
      store.commit('setImage', imagePath);
    },
    addHotspot(store, hotspot){
      hotspot.id =   '';
      let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      for ( let i = 0; i < 16; i++ ) {
        hotspot.id += characters.charAt(Math.floor(Math.random() * 62));
      }
      store.commit('addHotspot', hotspot);
    },
    updateHotspot(store, hotspot){
      const hotspotToUpdateIndex = store.getters.hotspots.findIndex(h => h.id === hotspot.id);
      store.commit('updateHotspot', { hotspotToUpdateIndex, hotspot });
    },
    deleteHotspot(store, hotspot){
      const hotspotToDeleteIndex = store.getters.hotspots.findIndex(h => h.id === hotspot.id);
      store.commit('deleteHotspot', { hotspotToDeleteIndex, hotspot });
    },
    reset(store){
      store.commit('reset');
    }
  }
})
