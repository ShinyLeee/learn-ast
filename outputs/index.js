// 生成于 2019-02-24 22:16:38, 转译时长77ms
Hello World === bar;

// 生成于 2019-02-24 22:20:22, 转译时长65ms
Hello World === bar;

// 生成于 2019-02-24 22:21:58, 转译时长109ms
Hello World === bar;

// 生成于 2019-02-24 22:22:33, 转译时长156ms
import { aaa, bbbb } from "moda";
import _ from "lodash";
import { Component } from "react";

const a = function (v) {
  return v;
};

let b = a();

// 生成于 2019-02-24 22:22:56, 转译时长160ms
import { aaa, bbbb } from "moda";
import _ from "lodash";
import { Component } from "react";

const a = function (v) {
  return v;
};

let b = a();

// 生成于 2019-02-28 00:01:31, 转译时长182ms
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import Config from '../../config';
import Strings from '../../i18n';
import Utils from '../../utils';
import icons from '../../res/iconfont.json';
const {
  isIphoneX,
  convertX: cx,
  convertY: cy
} = Utils.RatioUtils; // const {
// switch: switchCode,
// } = Config.codes;

class HomeBottomView extends Component {
  static propTypes = {};
  static defaultProps = {};

  getData() {
    return [{
      key: 'power',
      label: Strings.getDpLang('power'),
      icon: icons.power
    }, {
      key: 'power2',
      label: Strings.getDpLang('power2'),
      icon: icons.power
    }, {
      key: 'power3',
      label: Strings.getDpLang('power3'),
      icon: icons.power
    }];
  }

  _renderItem({
    item
  }) {
    const {
      disabled,
      ...itemProps
    } = item;
    return <Button {...itemProps} style={styles.btn} disabled={disabled} size={cx(24)} iconColor={Config.themeData.fontColor} iconStyle={[styles.icon, {
      backgroundColor: Config.themeData.iconBgColor
    }]} labelStyle={[styles.label, {
      color: Config.themeData.fontColor
    }]} testID="HomeBottomView_Button" />;
  }

  render() {
    const data = this.getData().filter(({
      key
    }) => !!key);
    return <View style={[styles.container, {
      backgroundColor: Config.themeData.tabBgColor
    }]} testID="HomeBottomView_View">
        <FlatList contentContainerStyle={styles.gridLayout} scrollEnabled={false} numColumns={data.length} data={data} renderItem={this._renderItem} keyExtractor={item => item.key} testID="HomeBottomView_FlatList" />
      </View>;
  }

}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },
  gridLayout: {
    height: isIphoneX ? 110 : cy(80),
    paddingBottom: isIphoneX ? 20 : 0,
    justifyContent: 'center'
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginTop: cy(6),
    fontSize: Math.max(10, cx(10)),
    color: '#fff'
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: cx(40),
    height: cx(40),
    borderRadius: cx(20)
  }
});
export default connect(() => ({}))(HomeBottomView);
