import CustomDimensions from './CustomDimensions';
import {Dimensions, Platform} from 'react-native';
import I18n from 'ex-react-native-i18n';

export default class Analytics {
  constructor(trackingId, clientId, version, userAgent, appName, packageName, appVersion) {
    this.version = version || 1;
    this.trackingId = trackingId;
    this.clientId = clientId;
    this.userAgent = userAgent || null;
    this.customDimensions = new CustomDimensions();
    this.deviceProperties = {
      sr: Dimensions.get('screen').width + 'x' + Dimensions.get('screen').height,
      vp: Dimensions.get('window').width + 'x' + Dimensions.get('window').height,
      ul: I18n.currentLocale(),
      an: appName,
      aid: packageName,
      av: appVersion,
    };
    if (!userAgent) {
      throw new Error('You must specify a user agent in order for Google Analytics to accept the event. Use DeviceInfo.getUserAgent() from react-native-device-info for this.');
    }
  }

  addDimension(index, name) {
    this.customDimensions.addDimension(index, name);
  }

  removeDimension(index) {
    this.customDimensions.removeDimension(index);
  }

  send(hit) {

    hit.set(Object.assign({}, this.deviceProperties, {
      v: this.version,
      tid: this.trackingId,
      cid: this.clientId
    }));

    let options = {
      method: 'get',
      headers: {
        'User-Agent': this.userAgent
      }
    }

    return fetch(`https://www.google-analytics.com/collect?${hit.toQueryString()}&${this.customDimensions.toQueryString()}&z=${Math.round(Math.random() * 1e8)}`, options);
  }
}
