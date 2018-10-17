import React, { Component } from 'react';
import { WebView, View, Text, FlatList, ActivityIndicator, StyleSheet, Platform, Linking , TouchableOpacity} from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';
const isAndroid = Platform.OS === 'android';
const WEBVIEW_REF = "WEBVIEW_REF";

class FlatListDemo extends Component {
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
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  lapsList = pos => {
    const targeting = `pos:${pos}|requete:pneu|fullscreen:NON`;
    let target = '';

    targeting.split('|').forEach(data => {
      target += `adSlot1.setTargeting("${data.split(':')[0]}","${data.split(':')[1]}");`;
    });

    return target;
  };

  addAdSense = (indice) => {
    const jsCode = ` 
          
    var pageOptions = {
        "pubId":"pub-3902876258354218",
        "channel":"1232899320+6926179322+6377288520",
        "query":"Linge de Maison   Couette et Oreiller  Oreiller ",
        "domainLinkAboveDescription":true,
        "location":false,
        "plusOnes":false,
        "sellerRatings":true,
        "siteLinks":true,
        "adPage":"1",
        "hl":"fr",
        "adtest":true,
        "linkTarget":"_blank",
        "colorLocation":"#096ec8",
        "fontSizeLocation":"13px",
        "number":"3",
        "lines":"3",
        "width":"auto",
        "fontFamily":"arial",
        "fontSizeTitle":"17px",
        "fontSizeDescription":"15px",
        "fontSizeDomainLink":"15px",
        "colorTitleLink":"#0A4BDA",
        "colorText":"#323232",
        "colorDomainLink":"#23B60E",
        "colorBackground":"#F9F9F9",
        "colorAdBorder":"#ffffff",
        "colorBorder":"#FAFAFC",
        "noTitleUnderline":"false",
        "longerHeadlines":"false",
        "detailedAttribution":"true"
    };


    var adblock1 = {
        "container": "afscontainer1",  
    };


    window._googCsa('ads', pageOptions, adblock1);

    `;
  

    return(
      <View style={styles.container}>
        <Text>Publicité</Text>
        <WebView
              key={'AdSense' + indice}
              ref={(ref) => { this.webview = ref; }}
              style={styles.webView2}
              source={{uri:isAndroid?'file:///android_asset/adSense.html':'./widget/index.html', }}
              javaScriptEnabled={true}
              mixedContentMode="compatibility"
              injectedJavaScript={jsCode}
              scrollEnabled={false}
              domStorageEnabled={true}
              scalesPageToFit
              startInLoadingState={true}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={(event) => {
                if (!this.state.adSenseClick  && (event.url.startsWith("http://") || event.url.startsWith("https://"))) {
              //    this.webview.stopLoading();
                  Linking.openURL(event.url);
                  this.webview.canGoBack=true;
                  this.webview.goBack();
                  this.setState({adSenseClick: true})
                }
            }}
          />
      
     </View>
    )
  }

  addAd = (indice) => {
    const jsCode = `
    function ready() {
      var iframe= window.frames["google_ads_iframe_7190/Cdiscount_App_Android/auto-moto-gps/recherche/native-line_0"];
      iframe.height="200px";
      iframe.width="100%";
    };

    googletag.cmd.push(function() {
      var adSlot1 = googletag.defineSlot('7190/Cdiscount_App_Android/auto-moto-gps/recherche/native-line', 'fluid' , "banner1");
      adSlot1.addService(googletag.pubads());
      ${this.lapsList('native-line')}
      googletag.pubads().set('page_url', 'http://www.recette-cdiscount.com/');
      googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        ready();
     });
      googletag.enableServices();
      googletag.display('banner1');
    })`;

  
    return (
      <View style={styles.webView3}>
        <WebView
        ref={(ref) => { this.webviewAd = ref; }}
        key={'pub' + indice}
        style={styles.webView3}
        source={{uri:isAndroid?'file:///android_asset/ad.html':'./widget/index.html', }}
        javaScriptEnabled={true}
        mixedContentMode="compatibility"
        injectedJavaScript={jsCode}
        scrollEnabled={false}
        domStorageEnabled={true}
        scalesPageToFit
        startInLoadingState={true}
        automaticallyAdjustContentInsets={false}
        onNavigationStateChange={(event) => {
          if (!this.state.adClick && (event.url.startsWith("http://") || event.url.startsWith("https://"))) {
                 // this.webviewAd.stopLoading();
                  Linking.openURL(event.url);
                  this.webviewAd.canGoBack=true;
                  this.webviewAd.goBack();
                  this.setState({adClick: true})
          }
      }}

      
      />
      </View>
 
    );
  };

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
   
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if(page===1) {
          res.results.push({ name: 'pub', picture: null, email: 'pub@pub.pub' + page , page: page});
          res.results.push({ name: 'adSense', picture: null, email: 'pubAdSense@pub.pub' + page, page: page });
        }
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false,
        });

      })
      .catch(error => {
        this.setState({ error, loading: false, ad:false , adSense:false});
      });
      this.setState({ loading: true, ad: true,  adSense:true });

  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
    
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) =>
            item.name === 'adSense' ? (
              this.addAdSense(item.page)
            ) :
            item.name === 'pub' ? (
              this.addAd(item.page)
            ) : (
              <ListItem
                roundAvatar
                title={`${item.name.first} ${item.name.last}`}
                subtitle={item.email}
                avatar={{ uri: item.picture.thumbnail }}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            )
          }
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection:'column',
    justifyContent:'flex-end',
  },
  webView: {
    backgroundColor: 'yellow',
    flex: 1,
  },
  webView2: {
    width:300,
    height:250,
    alignSelf: 'center'
  },
  webView3: {
    width:300,
    height:250,
    alignSelf: 'center'
  },
});

export default FlatListDemo;
