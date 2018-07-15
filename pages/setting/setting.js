import {
  themeChoose
} from '../../utils/utils.js';
Page({
  data: {
    setting: {
      hideFuture: true,
      hideIndex: true
    },
    theme: ''
  },

  bindSwitch(e) {
    let pages = getCurrentPages();
    let homePage = pages[pages.length - 2];
    let switchStatus = e.detail.value;
    let dataset = e.currentTarget.dataset.switch
    if (dataset === 'hideFuture') {
      homePage.setData({
        hideFuture: e.detail.value
      });
      this.setData({
        setting: {
          hideFuture: e.detail.value,
          hideIndex: this.data.setting.hideIndex
        }
      });
    } else if (dataset === 'hideIndex') {
      homePage.setData({
        hideIndex: e.detail.value
      });
      this.setData({
        setting: {
          hideFuture: this.data.setting.hideFuture,
          hideIndex: e.detail.value
        }
      })
    }
    wx.setStorage({
      key: 'setting',
      data: JSON.stringify(this.data.setting),
    })
  },

  restore() {
    wx.showModal({
      title: '清除&还原',
      content: '确认清除所有数据及缓存并还原设置么?',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage();
          this.setData({
            setting: {
              hideFuture: true,
              hideIndex: true
            }
          });
          wx.setStorage({
            key: 'setting',
            data: JSON.stringify(this.data.setting)
          });
          let pages = getCurrentPages();
          let homePage = pages[pages.length - 2];
          homePage.setData({
            setting: {
              hideFuture: true,
              hideIndex: true
            }
          })
          wx.showToast({
            title: '成功',
            icon: 'none'
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '取消',
            icon: 'none'
          })
        }
      }
    })
  },

  bindToDevice() {
    wx.navigateTo({
      url: '/pages/device/device',
    })
  },

  bindToFeedback(){
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },

  onLoad: function(options) {
    let theme = themeChoose();
    this.setData({
      theme
    })
  },

  onShow: function() {
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
  }
})