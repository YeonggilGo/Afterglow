import React from 'react';
import { connect } from 'react-redux'
import ActionCreator from '../../store/actions'

import {StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';


import { Card, Input  } from 'react-native-elements'


class AddMoneyItem extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      nowWhat:'',
      nowMuch:'',
      whatValid: false,
      muchValid: false,
    }
  }


  setName = async (t) => {
    await this.setState({ ...this.state, nowWhat: t });
    if (t.trim().length === 0) {
      // console.log("잘못된 사용처")
      this.setState({ ...this.state, whatValid: false });
    } else {
      this.setState({ ...this.state, whatValid: true });
    }
  }


  setMoney = async (t) => {
    await this.setState({ ...this.state, nowMuch: t });
    let pattern = /[0-9]/;

    if (!pattern.test(t)) {
      // console.log("잘못된금액")
      this.setState({ 
        ...this.state, muchValid: false });
    } else {
      this.setState({ 
        ...this.state, muchValid: true });
    }
  }


  addItem = () => {
    const moneyitem = {
      "day_id": this.props.todayTravel.dr_id,
      "consumption_name":this.state.nowWhat,
      "consumption_money": parseInt(this.state.nowMuch),
      // "consumption_time": new Date()
    }
    console.log("머니아이템", moneyitem)
    this.props.addMoneyItem(moneyitem)

    this.setState({ 
      nowWhat:'',
      nowMuch:'',
      whatValid: false,
      muchValid: false,
    });
  }

  render() { 
    return (
      // <Card containerStyle={{}} >
      <Card styles={styles.inputContainer} >
        <View style={styles.inputWrap}>
          
          <Input
            placeholder='사용처'
            value={this.state.nowWhat}
            onChangeText={(t) => this.setName(t)}
            onEndEditting={() => console.log("onEndEditting")}
            onSubmitEditing={() => console.log("onSubmitEditing")}
            returnKeyType="next"
            style={{fontSize:15}} />
        </View>

        <View>
          <Input
            placeholder='비용(원)'
            style={{fontSize:15}}
            value={String(this.state.nowMuch)}
            onChangeText={(t) => this.setMoney(t)}
            keyboardType = 'numeric' />
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between'}}>

        
        {
        ( this.state.whatValid
          ? (this.state.muchValid ? null : <Text style={{marginLeft:1, color:'orange'}}>가격을 적어주세요.</Text> )
          : <Text style={{marginLeft:10, color:'orange'}}>사용처를 적어주세요.</Text> ) 
        
        }

        <TouchableOpacity
          style={{alignItems: 'center', marginRight:20}}
          onPress={ (this.state.whatValid && this.state.muchValid)
          ? this.addItem
          : ()=> {console.log("가계부추가실패")}}
          >
          <View style={{ flexDirection:'row' }}>
            <Ionicons style={{ paddingRight:5 }} name="add-circle-outline" size={20}/>
            <Text>추가</Text>
          </View>
        </TouchableOpacity>

        </View>
      </Card>
      // </Card>

    )
  }

}

const styles = StyleSheet.create({

  inputWrap:{
    flex: 1,
    // borderColor: "#cccccc",
    // borderBottomWidth: 1,
    marginBottom: 10
  },
 
  inputContainer: {
    flex: 1,
    flexDirection: 'row',

    // alignItems: 'center'
  },
  
  
})



function mapStateToProps(state){

  return {
    todayTravel: state.accountRd.todayTravel,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addMoneyItem: (moneyitem) => {
      dispatch({
        type: "ADD_MONEY_ASYNC",
        payload: moneyitem
      })
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMoneyItem)