import axios from '@/lib/axios';
const baseUrl = 'https://api.baoleme.andiedie.cn/';
// const baseUrl = 'http://127.0.0.1:8520/';

export default {
  loginAction ({ commit }, data) {
    return axios.post(baseUrl + 'restaurant/session', {
      email: data.username.trim(),
      password: data.password.trim()
    }).then((value) => {
      commit('LOGIN');
      console.log('Login succeed!');
      return false;
    }, (error) => {
      console.log(error.response.data.message);
      return error.response.data.message;
    });
  },
  getRestInfo ({ commit }) {
    return axios.get(baseUrl + 'restaurant/self').then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        commit('GET_SELF_INFO', res.data);
        return false;
      }
    });
  },
  registerAction ({ commit }, data) {
    let fd = new FormData();
    fd.append('email', data.username.trim());
    fd.append('password', data.password.trim());
    fd.append('name', data.restname.trim());
    fd.append('license', data.license);
    return axios.post(baseUrl + 'restaurant', fd).then((value) => {
      commit('LOGIN');
      return false;
    }, (error) => {
      console.log(error.response.data.message);
      return error.response.data.message;
    });
  },
  sendConfirmEmail ({ commit }) {
    axios.post(baseUrl + 'restaurant/emailConfirm')
      .then((value) => { return false; },
        (error) => { return error.response.data.message; });
  },
  restaurantSelfOrder ({ commit }, data) {
    commit('UPDATE_FILTERS', data.stateArr);
    axios.get(baseUrl + 'restaurant/self/order?page=' + data.page + '&number=10&state=' + data.stateArr.join(',')).then((res) => {
      if (res.status === 200) {
        // console.log(res.data);
        commit('UPDATE_ORDER_LIST', res.data);
        return false;
      }
    });
  },
  dealOrder ({ commit }, data) {
    axios.put(baseUrl + 'order/' + data.id, {
      state: data.state
    }).then((value) => { return false; },
      (error) => {
        console.log('dealOrder', error.response.data.message);
        return error.response.data.message;
      });
  },
  getDish ({ commit }, data) {
    axios.get(baseUrl + 'dish').then((res) => {
      if (res.status === 200) {
        commit('UPDATE_DISH_LIST', res.data);
        return false;
      }
    });
  }
};
