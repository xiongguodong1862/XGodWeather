App({
  onLaunch(){
    let _this=this;
    wx.getSystemInfo({
      success: function(res) {
        _this.globalData.systemInfo=res;
      },
    })
  },
  onHide(){
    wx.clearStorage();
  },
  globalData: {
    ak: 'AEdCY0ZwFdrVAdGrX2XGTy2gd37UxOfQ',
    systemInfo:{}
  },
  setGeocodeUrl(address) {
    return `https://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${this.globalData.ak}`;
  }
});
