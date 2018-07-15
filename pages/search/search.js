import cityData from '../../data/cityData.js';
let app = getApp();
import {
  themeChoose,
  isEmptyObj
} from '../../utils/utils.js';
Page({
  data: {
    sortedCityObj: {},
    cityInput: '',
    filteredCity: null,
    cityHistory: []
  },

  sortCity() {
    //先按字母排序
    cityData.sort((a, b) => {
      if (a.firstLetter > b.firstLetter) return 1;
      if (a.firstLetter < b.firstLetter) return -1;
      return 0
    });
    let obj = {};
    cityData.forEach((item, index) => {
      let letter = item.firstLetter;
      if (!obj[letter]) {
        obj[letter] = [];
      }
      obj[letter].push(item);
    })
    for (let k in obj) {
      obj[k].sort((a, b) => {
        return a.name.localeCompare(b.name, 'zh')
      })
    }
    let sortedCityObj = obj;
    this.setData({
      sortedCityObj,
      filteredCity: sortedCityObj
    });
  },

  filterCity(e) {
    let cities = this.data.sortedCityObj;
    let filteredCity = {};
    //取到输入的value并去空格
    let value = e.detail.value;
    value = value.replace(/\s+/g, '');
    if(value.length){
      for (let key in cities) {
        let group = cities[key];
        for (let i = 0, len = group.length; i < len; i++) {
          let curCity = group[i];
          if (curCity.name.indexOf(value) !== -1) {
            if (isEmptyObj(filteredCity[key])) {
              filteredCity[key] = [];
            }
            filteredCity[key].push(curCity);
          }
        }
      }
      this.setData({
        filteredCity,
      });
    }else{
      this.setData({
        filteredCity: cities,
      })
    }
  },


  clearInput(e) {
    this.setData({
      cityInput: ''
    });
    this.setData({
      filteredCity: this.data.sortedCityObj,
      cityChoose: this.data.sortedCityObj
    });
  },

  selectCity(e) {
    let _this = this;
    this.e=e;
    let cityName = e.target.dataset.city;
    let pages = getCurrentPages();
    let homePage = pages[pages.length - 2];
    homePage.setData({
      cityChanged: true,
      changedCity: cityName
    })
    wx.navigateBack({})
  },

  onLoad: function(options) {
    themeChoose();
    this.sortCity();
  }
})