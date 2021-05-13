import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, TextInput} from 'react-native';

import { Card, ListItem, Input  } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux'

const items = [
  {
     when: '11:40',
     what: '흑돼지구이',
     much: '56000'
  },
  {
    when: '13:40',
    what: '땅콩막걸리',
    much: '123300'
 },
 {
  when: '19:20',
  what: '문어찌개',
  much: '56000'
}
]

class MoneyBook extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
    
    return (
      <View >
        
        <Card >
          <View style={styles.container}>
            <Card.Title style={{flex:2}}>시간</Card.Title>
            <Card.Title style={{flex:6}}>사용처</Card.Title>
            <Card.Title style={{flex:4}}>비용</Card.Title>
            {/* <Card.Title style={{flex:1}}>관리</Card.Title> */}
          </View>
          {/* <Card.Divider/> */}
        {
        this.props.moneyBookList.map((item, i) => {
          return (
          <View key={i} style={styles.listContainer} >
            <View style={styles.itemWhen} >
              <Text style={styles.moenyText}>{item.hour}:{item.min}</Text>
            </View>
            <View style={styles.itemWhat} >
              <Text style={styles.moenyText}>{item.what}</Text>
            </View>
            <View style={styles.itemMuch}>
              <Text style={styles.moenyText}>{item.much}</Text>
            </View>
            <View style={styles.itemDelete}>
              <Ionicons name="close"></Ionicons>
            </View>
          </View>
          );
         })
        }
      </Card>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  container:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listContainer: {
    flexDirection: 'row',
    marginBottom:5,
  },
  moneyText:{
    fontSize: 20,
  },
  itemWhen:{flex:2, alignItems:'center',
              // backgroundColor:'pink', 
            },
  itemWhat:{flex:6, alignItems:'center',
              // backgroundColor:'yellow', 
            },
  itemMuch:{flex:3, alignItems:'flex-end',
              // backgroundColor:'beige', 
            },
  itemDelete:{ flex:1, alignItems:'center',
              justifyContent: 'center'
              // backgroundColor:'lime',
            },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  
})

function mapStateToProps(state) {

  return {
    isLogin: state.accountRd.isLogin,
    user_nickname: state.accountRd.user.nickname,
    moneyBookList: state.accountRd.todayTravel.moneyBook
  }
}

export default connect(mapStateToProps)(MoneyBook) 


