import React, { Component } from 'react';
import { bool, func, number, oneOf, exact, string , shape} from 'prop-types';
import { View } from 'react-native';

export default class AdSense extends Component {
  static propTypes = {
    id: string,
    adSenseOptions: shape({
      adPage: string,
      adtest: bool,
      channel: string,
      colorAdBorder: string,
      colorBackground: string,
      colorBorder: string,
      colorDomainLink: string,
      colorLocation: string,
      colorText: string,
      colorTitleLink: string,
      container: string,
      detailedAttribution: bool,
      domainLinkAboveDescription: bool,
      fontFamily: string,
      fontSizeDescription: string,
      fontSizeDomainLink: string,
      fontSizeLocation: string,
      fontSizeTitle: string,
      hl: string,
      lines: string,
      linkTarget: string,
      location: bool,
      longerHeadlines: bool,
      noTitleUnderline: bool,
      number: string,
      plusOnes: bool,
      pubId: string,
      query: string,
      sellerRatings: bool,
      siteLinks: bool,
      width: string,
    }),
  };

  static defaultProps = {
    adSenseOptions: null,
    id: null,
  };

  componentDidUpdate = () => {
    if (this.props.adSenseOptions) {
      const adUnitOptions = {
        container: this.props.id,
      };

      window._googCsa('ads', this.props.adSenseOptions, adUnitOptions);
    }
  };

  render() {
    if (!this.props.id || !this.props.adSenseOptions) return null;

    return <View className="AdSense" id="AdSense" />;
  }
}
