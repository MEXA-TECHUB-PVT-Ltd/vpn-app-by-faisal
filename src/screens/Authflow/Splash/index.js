import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const Splash = () => {
  const [list, setList] = useState([
    {
      id: 0,
    },
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
    {
      id: 9,
    },
    {
      id: 10,
    },
    {
      id: 11,
    },
    {
      id: 12,
    },
    {
      id: 13,
    },
    {
      id: 14,
    },
    {
      id: 16,
    },
    {
      id: 17,
    },
    {
      id: 18,
    },
    {
      id: 17,
    },
    {
      id: 19,
    },
    {
      id: 20,
    },
    {
      id: 21,
    },
    {
      id: 22,
    },
    {
      id: 23,
    },
  ]);
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'row',
          // alignSelf: 'center',
          flexWrap: 'wrap',
          width: responsiveWidth(90),
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        {list.map((item, index) => {
          return (
            <View
              style={{
                width:
                  index == 0
                    ? responsiveWidth(90)
                    : index == 1
                    ? responsiveWidth(90)
                    : index % 6 == 0
                    ? responsiveWidth(90)
                    : (index - 1) % 6 == 0
                    ? responsiveWidth(90)
                    : responsiveWidth(42),
                height: responsiveHeight(10),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'green',
                marginTop: responsiveHeight(4),
                // marginRight: index % 5 !== 0 ? responsiveWidth(5) : null,
                // alignSelf: 'center',
              }}>
              <Text style={{alignSelf: 'center'}}>{item.id}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default Splash;
const styles = StyleSheet.create({});
