import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const SuccessModal = ({title, isVisible, setIsVisible, onOK}) => {
  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          width: responsiveWidth(80),
          padding: responsiveWidth(8),
          paddingHorizontal: responsiveWidth(6),
          borderRadius: responsiveWidth(4),
          backgroundColor: '#fff',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#EC1D94', fontSize: 16, fontWeight: '400'}}>
          {title}
        </Text>
        <TouchableOpacity
          onPress={onOK}
          style={{
            height: 40,
            width: 100,
            borderRadius: 20,
            backgroundColor: '#CA6FE4',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <Text style={{color: '#fff', fontSize: 18}}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({});
