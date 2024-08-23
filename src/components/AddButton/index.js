import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';

const AddButton = ({onPress}) => {
  const {double, soliddark, solid, isdarkmode, theme} = useSelector(
    state => state.userReducer,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        position: 'absolute',
        bottom: responsiveWidth(9),
        marginRight: responsiveWidth(7),
        right: -2,
        borderRadius: responsiveWidth(40),
        elevation: 5,
      }}
      onPress={onPress}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: responsiveWidth(17) / 1.5,
          height: '60%',
          width: '60%',
          position: 'absolute',
          right: 10,
          top: 10,
        }}></View>
      <AntDesign
        name="pluscircle"
        // color={isdarkmode ? '#848484' : '#EC1D94'}
        color={isdarkmode ? '#848484' : double[0]}
        size={responsiveWidth(17)}
      />
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({});
