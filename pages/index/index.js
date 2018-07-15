import bmap from '../../libs/bmap-wx.min.js';
import {
  processData,
  formatDate,
  themeChoose,
  formatTemperature
} from '../../utils/utils.js';
let app = getApp();
let ak = app.globalData.ak;
let BMap = new bmap.BMapWX({
  ak
});

Page({
  data: {
    isLocating: true,
    initialLocate: true,
    currentWeather: {},
    temperature: '',
    tips: [],
    futureWeather: [],
    currentTime: '',
    theme: '',
    pmDesc: '',
    located: false,
    cityChanged: false,
    currentCity: '',
    changedCity: '',
    history: [],
    setting: {
      hideFuture: true,
      hideIndex: true
    }
  },

  init(opt) {
    let _this = this;
    if (this.data.initialLocate) {
      wx.showModal({
        title: '获取位置',
        content: '小程序需要定位您当前所在城市',
        success(res) {
          if (res.confirm) {
            _this.locate(opt);
            _this.setData({
              initialLocate: false
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '获取定位失败',
              icon: 'none'
            })
          }
        },
        fail: _this.fail
      })
    } else {
      this.locate(opt);
    }
  },
  locate(opt) {
    let _this = this;
    BMap.weather({
      location: opt.location,
      fail: _this.fail,
      success: _this.success
    });
  },

  success(data) {
    wx.showLoading({
      title: '正在获取数据...',
    });
    //处理好的最终数据
    let finalData = processData(data);
    //提取温度
    let temperature = formatTemperature(finalData.currentWeather.date);
    //pm2.5等级说明//finalData.currentWeather.pm25
    let pmDesc = this.calcPmLevel(finalData.currentWeather.pm25);
    let futureWeather = this.formatWeekDay(finalData.futureWeather);
    this.setData({
      currentWeather: finalData.currentWeather,
      tips: finalData.tips,
      futureWeather,
      temperature,
      pmDesc
    });
    //获取当前时间
    let currentTime = formatDate(new Date(), 'MM-dd hh:mm');
    this.setData({
      currentTime
    });
    wx.hideLoading();
    //保存当前城市
    let city = finalData.currentWeather.currentCity;
    this.setData({
      currentCity: city
    });
    if (this.data.isLocating) {
      // 在storage中保存当前定位
      wx.setStorage({
        key: 'currentLocation',
        data: this.data.currentCity,
      })
    }

    this.setData({
      isLocating: false,
      located: true
    });
  },

  fail() {
    wx.showToast({
      title: '网络不给力,请稍后再试',
      icon: 'none'
    })
  },

  calcPmLevel(pm) {
    pm = parseInt(pm);
    if (pm >= 0 && pm <= 35) {
      return '优';
    } else if (pm > 35 && pm <= 75) {
      return '良';
    } else if (pm > 75 && pm <= 115) {
      return '轻度';
    } else if (pm > 115 && pm <= 150) {
      return '中度';
    } else if (pm > 150 && pm <= 250) {
      return '重度';
    } else if (pm > 250 && pm <= 500) {
      return '严重';
    } else if (pm > 500) {
      return '能活下来算你命大';
    }
  },

  //对未来数据中的第一天的date值处理
  formatWeekDay(value) {
    value[0].date = value[0].date.substr(0, 2);
    return value;
  },

  bindToSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  getGeocode(city, success) {
    wx.request({
      url: app.setGeocodeUrl(city),
      success: (res) => {
        let data = res.data || {};
        if (!res.status) {
          let location = (data.result || {}).location || {};
          success && success(location);
        }
      }
    })
  },

  search(val) {
    if (val) {
      this.setData({
        cityChanged: true
      });
      this.getGeocode(val, (location) => {
        let cityObj = {
          currentCity: val,
          loc: location
        };
        wx.setStorage({
          key: 'current',
          data: JSON.stringify(cityObj),
        })
        this.init({
          location: `${location.lng},${location.lat}`
        })
      })
    }
  },

  bindToSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },

  onLoad: function(options) {
    if (!this.data.cityChanged) {
      this.init({});
    }
    if (options.city) {
      this.setData({
        changedCity: options.city
      });
    }
  },

  onShow: function() {
    let theme = themeChoose();
    this.setData({
      theme
    });
    let chengedCity = this.data.changedCity;
    this.search(chengedCity);
    let _this = this;
    wx.getStorage({
      key: 'setting',
      success: function(res) {
        res = JSON.parse(res.data);
        _this.setData({
          setting: res
        })
      },
    })
  },

  onHide: function() {
    wx.stopPullDownRefresh()
  },

  onPullDownRefresh: function() {
    //this.init({});
    let current = wx.getStorageSync('current');
    if (current){
      current = JSON.parse(current);
      let loc = current.loc.lng + ',' + current.loc.lat;
      this.locate({location:loc});
    }else{
      this.init({});
    }
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },2000);
  }
})