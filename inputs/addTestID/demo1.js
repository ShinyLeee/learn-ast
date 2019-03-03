import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { IconFont } from 'components';

/* eslint-disable no-nested-ternary */
const Button = d => {
  const { label, icon, style, iconStyle, labelStyle, iconColor, children, ...props } = d;
  const child = children ? <View style={style}>{children}</View> : null;
  const iconProps = {
    fill: iconColor,
    stroke: iconColor,
    ...props,
  };
  const first =
    typeof icon === 'number' || typeof icon === 'object' ? (
      <Image style={{ tintColor: iconColor }} source={icon} resizeMode="contain" />
    ) : typeof icon === 'string' && icon ? (
      <IconFont d={icon} {...iconProps} />
    ) : (
      undefined
    );

  const second = label ? <Text style={labelStyle}>{label}</Text> : undefined;

  return (
    <TouchableWithoutFeedback {...props}>
      {child || (
        <View style={style}>
          <View style={iconStyle}>{first}</View>
          {second}
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

export default Button;
