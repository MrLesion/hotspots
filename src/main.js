import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  created() {
    const data = document.getElementById('hotspotData').value;
    if(data.length){
      const json = JSON.parse(data);
      this.$store.commit('loadData', json);
    }
    document.addEventListener('dragover', event => event.preventDefault(), false);
  }
}).$mount('#app')
