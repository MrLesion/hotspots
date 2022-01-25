import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Unicon from 'vue-unicons/dist/vue-unicons-vue2.umd'
import { uniAlignLeft, uniFileAlt, uniShoppingCart, uniExclamationTriangle, uniSearchPlus, uniSearchMinus, uniTrashAlt} from 'vue-unicons/dist/icons'

Vue.config.productionTip = false

Unicon.add([uniAlignLeft, uniFileAlt, uniShoppingCart, uniExclamationTriangle, uniSearchPlus, uniSearchMinus, uniTrashAlt])
Vue.use(Unicon)

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
