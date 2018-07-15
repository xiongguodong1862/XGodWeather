// pages/device/device.js
import {
  themeChoose
} from '../../utils/utils.js';

let app = getApp();
Page({
  data: {
    systemInfo: {},
    network: '',
    brightness: ''
  },

  onShow: function() {
    let theme = themeChoose();
    this.setData({
      systemInfo: app.globalData.systemInfo
    })
    let _this = this;
    wx.getNetworkType({
      success: function(res) {
        _this.setData({
          network: res.networkType
        })
      },
    })
    wx.getScreenBrightness({
      success(res) {
        _this.setData({
          brightness: (parseInt(res.value * 100) + '%')
        })
      }
    });
  }
})