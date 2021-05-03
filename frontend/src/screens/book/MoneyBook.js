import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

import { Card, ListItem } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';

const items = [
  {
     when: '11:40',
     what: '흑돼지구이',
     much: '56000'
  },
  {
    when: '13:40',
    what: '땅콩막걸리',
    much: '12312300'
 },
 {
  when: '19:20',
  what: '문어찌개',
  much: '56000'
}
]

export default class MoneyBook extends React.Component {

  constructor (props) {
    super(props)
  }

  


  render() {
    
    return (
      <View  >
        <Text>가계부</Text>
        <Card >
          <View style={styles.container}>
            <Card.Title style={{flex:2}}>시간</Card.Title>
            <Card.Title style={{flex:6}}>메모</Card.Title>
            <Card.Title style={{flex:4}}>비용</Card.Title>
            {/* <Card.Title style={{flex:1}}>관리</Card.Title> */}
          </View>
          <Card.Divider/>
        {
        items.map((item, i) => {
          return (
          <View key={i} style={styles.listContainer} >
            <View style={styles.itemWhen} >
              <Text>{item.when}</Text>
            </View>
            <View style={styles.itemWhat} >
              <Text>{item.what}</Text>
            </View>
            <View style={styles.itemMuch}>
              <Text>{item.much}</Text>
            </View>
            <View style={styles.itemDelete}>
              <Ionicons name="close"></Ionicons>
            </View>
          </View>
          );
        })
        }

      <Card.Divider style={{margin:10}}/>
      


      </Card>

      </View>
    )
  }

}

const styles = StyleSheet.create({
 
  container:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listContainer: {
    flexDirection: 'row',
  },
  itemWhen:{backgroundColor:'pink', flex:2, alignItems:'center'},
  itemWhat:{backgroundColor:'yellow', flex:6, alignItems:'center'},
  itemMuch:{backgroundColor:'beige', flex:3, alignItems:'center'},
  itemDelete:{backgroundColor:'lime', flex:1, alignItems:'center'},
  
  
})



