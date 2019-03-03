import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import Config from '../../config';
import Strings from '../../i18n';
import Utils from '../../utils';
import icons from '../../res/iconfont.json';

const { isIphoneX, convertX: cx, convertY: cy } = Utils.RatioUtils;

// const {
// switch: switchCode,
// } = Config.codes;

class HomeBottomView extends Component {
  static propTypes = {};

  static defaultProps = {};

  getData() {
    return [
      {
        key: 'power',
        label: Strings.getDpLang('power'),
        icon: icons.power,
      },
      {
        key: 'power2',
        label: Strings.getDpLang('power2'),
        icon: icons.power,
      },
      {
        key: 'power3',
        label: Strings.getDpLang('power3'),
        icon: icons.power,
      },
    ];
  }

  _renderItem({ item }) {
    const { disabled, ...itemProps } = item;
    return (
      <Button
        {...itemProps}
        style={styles.btn}
        disabled={disabled}
        size={cx(24)}
        iconColor={Config.themeData.fontColor}
        iconStyle={[styles.icon, { backgroundColor: Config.themeData.iconBgColor }]}
        labelStyle={[styles.label, { color: Config.themeData.fontColor }]}
      />
    );
  }

  render() {
    const data = this.getData().filter(({ key }) => !!key);
    return (
      <View style={[styles.container, { backgroundColor: Config.themeData.tabBgColor }]}>
        <FlatList
          contentContainerStyle={styles.gridLayout}
          scrollEnabled={false}
          numColumns={data.length}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={item => item.key}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },

  gridLayout: {
    height: isIphoneX ? 110 : cy(80),
    paddingBottom: isIphoneX ? 20 : 0,
    justifyContent: 'center',
  },

  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    marginTop: cy(6),
    fontSize: Math.max(10, cx(10)),
    color: '#fff',
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: cx(40),
    height: cx(40),
    borderRadius: cx(20),
  },
});

export default connect(() => ({}))(HomeBottomView);
