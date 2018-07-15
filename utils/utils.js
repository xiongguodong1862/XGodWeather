let processData = (data) => {
  //当日天气数据
  let currentWeather = data.currentWeather[0];
  let originalData = data.originalData.results[0];
  //当日指数tips
  let tips = originalData.index;
  let imageSrc = ['/images/clothing.png', '/images/carwashing.png', '/images/pill.png', '/images/running.png', '/images/sun.png'];
  for (let i = 0; i < tips.length; i++) {
    let cur = tips[i];
    cur.img = imageSrc[i];
  }
  //未来几日天气数据
  let futureWeather = originalData.weather_data;
  return {
    currentWeather,
    tips,
    futureWeather,
  };
}

let formatDate = (nDate, date) => {
  if (isNaN(nDate.getTime())) {
    // 不是时间格式
    return '--'
  }
  let o = {
    'M+': nDate.getMonth() + 1,
    'd+': nDate.getDate(),
    'h+': nDate.getHours(),
    'm+': nDate.getMinutes(),
    's+': nDate.getSeconds(),
    // 季度
    'q+': Math.floor((nDate.getMonth() + 3) / 3),
    'S': nDate.getMilliseconds()
  }
  if (/(y+)/.test(date)) {
    date = date.replace(RegExp.$1, (nDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(date)) {
      date = date.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return date
}
let themeChoose = () => {
  let theme = '';
  let bgColor = {
    day: '#1ea7fc',
    night: '#384148'
  };
  let h = new Date().getHours();
  if (h >= 6 && h < 18) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: bgColor.day,
    });
    wx.setTabBarStyle({
      backgroundColor: bgColor.day
    })
    theme = bgColor.day;
  } else {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: bgColor.night,
    });
    wx.setTabBarStyle({
      backgroundColor: bgColor.night
    })
    theme = bgColor.night;
  }
  return theme;
};

let formatTemperature = (str) => {
  let temperature = str.slice(-4, -1);
  return temperature;
}

let isEmptyObj = (obj) => {
  for (let k in obj) {
    return false;
  }
  return true;
}


export {
  processData,
  formatDate,
  themeChoose,
  formatTemperature,
  isEmptyObj
}