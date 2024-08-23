import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {Icon} from 'react-native-vector-icons';

import styles from './style';
export const MyButton = props => {
  const {
    onPress,
    title,
    myStyles,
    iconName,
    iconType,
    itsTextstyle,
    iconColor,
    iconSize,
    customimg,
    imageStyle,
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, myStyles]}>
      {iconName && (
        <View style={styles.IconCon}>
          <Icon
            name={iconName}
            size={iconSize ? iconSize : responsiveFontSize(3)}
            type={iconType}
            // color={iconColor ? iconColor : "white"}
          />
        </View>
      )}
      {title && (
        <Text
          style={[
            styles.title,
            {width: iconName ? responsiveWidth(50) : null},
            itsTextstyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
