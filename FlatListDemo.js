import React, { Component } from 'react';
import {
  WebView,
  View,
  StyleSheet,
  Platform,
  Text,
  Linking,
  Dimensions,
  ScrollView,
} from 'react-native';

const isAndroid = Platform.OS === 'android';
const WEBVIEW_REF = 'WEBVIEW_REF';

export default class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      ad: false,
      adSense: false,
      canGoBack: false,
      adClick: false,
      adSenseClick: false,
      webViewStyle: {
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        height: 300,
      },
      autoHeight: true,
      defaultAdSenseheight: 0,
    };
  }

  
   lapsList(pos) {
     const targeting = `pos:${pos}|fullscreen:NON`;

     const content = targeting.split('|').map((data) =>
     `adSlot1.setTargeting("${data.split(':')[0]}","${data.split(':')[1]}");`
    );
   return content.join('');
  }


  onReceiveAdSenseMessageEvent = height => {
    const { webViewStyle } = this.state;

    return this.setState({
      webViewStyle: {
        ...webViewStyle,
        height,
      },
    });
  };


  
  handleNavigationStateChange = event => {
    const isAndroid = Platform.OS === 'android';
    if (isAndroid && event.loading && event.url && event.url.startsWith('tel')) {
      Linking.openURL(event.url)
        .then(() => this.webview.stopLoading())
        .then(() => this.webview.goBack());
    } else if (event.loading && (event.url.startsWith('http://') || event.url.startsWith('https://'))) {
      Linking.openURL(event.url).then(() => this.webview.stopLoading());
    } else if (
      event.canGoBack &&
      event.url !== 'file:///android_asset/adSense.html' &&
      event.url !== './widget/adSense.html'
    ) {
      this.webview.goBack();
    }
  };


  setAdSenseHeight(height) {
    const newHeight = height.replace('px', '');
    this.setState({
      webViewStyle: {
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        height: parseInt(newHeight),
      },
    });
  }

  parseAdSenseMessageEvent = e => {
    const unitLessHeight = parseInt(e.nativeEvent.data.replace('px', ''), 10);
    if (Number.isNaN(unitLessHeight)) return null;

    return this.onReceiveAdSenseMessageEvent(unitLessHeight);
  };



  render() {
    const jsCode2 = ` 
    let pageOptions = {
      "pubId": "pub-3902876258354218",
      "channel": "1232899320+6926179322+6377288520",
      "query": "Linge de Maison   Couette et Oreiller  Oreiller ",
      "domainLinkAboveDescription": true,
      "location": false,
      "plusOnes": false,
      "sellerRatings": true,
      "siteLinks": true,
      "adPage": "1",
      "hl": "fr",
      "adtest": true,
      "linkTarget": "_blank",
      "colorLocation": "#096ec8",
      "fontSizeLocation": "13px",
      "number": "3",
      "lines": "3",
      "width": "auto",
      "fontFamily": "arial",
      "fontSizeTitle": "17px",
      "fontSizeDescription": "15px",
      "fontSizeDomainLink": "15px",
      "colorTitleLink": "#0A4BDA",
      "colorText": "#323232",
      "colorDomainLink": "#23B60E",
      "colorBackground": "#F9F9F9",
      "colorAdBorder": "#ffffff",
      "colorBorder": "#FAFAFC",
      "noTitleUnderline": "false",
      "longerHeadlines": "false",
      "detailedAttribution": "true"
  };

      const adblock1 = {
          "container": "afscontainer1",
      };

      window._googCsa('ads', pageOptions, adblock1);

      const config = {
        attributes: true,
        attributeFilter: ['style']
      };

      const target = document.getElementById('afscontainer1');

      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
          if (mutationRecord.attributeName === 'style' && target.style.height !== '1px') {
            const height = target.style.height;
            window.postMessage(height, '*')
          };
        });
      });

      observer.observe(target, config);
    
     `;
     return (
      <ScrollView style={styles.container}>
        <Text>Publicité</Text>
        <WebView
         originWhitelist={['*']}
          key={'AdSense'}
          ref={'webview2'}
          style={this.state.webViewStyle}
          source={{
            uri: isAndroid
              ? 'file:///android_asset/adSense.html'
              : './widget/index.html',
          }}
          javaScriptEnabled={true}
          mixedContentMode="compatibility"
          injectedJavaScript={jsCode2}
          scrollEnabled={false}
          domStorageEnabled={true}
          onMessage={this.parseAdSenseMessageEvent}
          scalesPageToFit
          startInLoadingState={true}
          automaticallyAdjustContentInsets={false}
          onNavigationStateChange={event => {
            if (
              !this.state.adSenseClick &&
              (event.url.startsWith('http://') ||
                event.url.startsWith('https://'))
            ) {
              //    this.webview.stopLoading();
              Linking.openURL(event.url);
              this.webview.canGoBack = true;
              this.webview.goBack();
              this.setState({ adSenseClick: true });
            }
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 1500,
  },
  webView: {
    backgroundColor: 'yellow',
    height: 320,
  },
  webView2: {
    backgroundColor: '#f0f',
    height: 320,
  },
  webView3: {
    backgroundColor: '#fff',
    height: 320,
  },
  webView4: {
    backgroundColor: 'blue',
    height: 320,
  },
  banner_AD: {
    alignSelf: 'center',
    width: 320,
    height: 50,
    marginTop: 4,
    marginBottom: 10,
  },
});
