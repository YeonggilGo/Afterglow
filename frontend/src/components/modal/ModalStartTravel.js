import React from 'react'

import { connect } from 'react-redux'
import ActionCreator from '../../store/actions'


import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native'
import { Button, Overlay,Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';



class ModalStartTravel extends React.Component {

  constructor(props){
    super(props)
    this.state = { modalVisible: false, travelName: '' }
  }


  setModalVisible = (visible) => {
    this.setState({ travelName: '' })
    this.setState({ modalVisible: visible });
  }


  setText = (t) => {
    this.setState({ travelName: t });
  }


  startTravel = async () => {
    await this.props.setTravelName(this.state.travelName)
    await this.props.changeStatus('onTravel')
    await this.props.navigation.navigate('OnTravelMain')
    this.setState({ modalVisible: false });
  }


  render() {

    // const { modalVisible } = this.state;

    return (

      <View>
        
        <TouchableOpacity 
          onPress={ () => this.setModalVisible(!this.state.modalVisible) } 
          style={styles.startBtn}>
          {/* <Ionicons name="airplane" size={80} color={"skyblue"}/> */}
          {/* <FontAwesome5Icon  name="plane-departure" style={{ height: 60, width: 60}} size={45} color={"skyblue"}/> */}
          <Image 
              style={{width: 60, height: 60}}
              source={require('../../assets/pics/take-off.png')}/>
        </TouchableOpacity>

        {/* <Button
        icon={<Ionicons name="airplane" size={25}/>} title="새로운 여행 시작" onPress={ () => this.setModalVisible(!this.state.modalVisible) } /> */}

        <Overlay 
          overlayStyle={styles.container}
          isVisible={this.state.modalVisible}
          onBackdropPress={ () => this.setModalVisible(!this.state.modalVisible)}>
          {/* <View> */}
          <Text style={{textAlign:'center'}}>여행 이름을 적어주세요!</Text>
          <Input 
              style={styles.textInputStyle}
              onChangeText={(t) => this.setText(t)}
              value={this.state.travelName}
              />

          <Text style={{textAlign:'center'}}>여행을 시작해볼까요?</Text>
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
            <Text style={styles.txtCancel}>아니오</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStart}
          onPress={ (this.state.travelName.trim().length === 0)
            ? () => alert("여행 이름을 입력해주세요!")
            : this.startTravel}>
            <Text style={styles.txtStart}>시작해요!</Text>
          </TouchableOpacity>
          </View>
          {/* </View> */}
        </Overlay>
      </View>

    )
  }


}

const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width


const styles= StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width : screenWidth/1.5,
    paddingVertical: screenWidth/10,
    paddingHorizontal: screenWidth/30
  },
  startBtn: {
    backgroundColor: "#49C4D7",
    borderColor: "#0b3c60",
    borderWidth: 1.5,
    padding:20,
    borderRadius: 180,
    elevation:3,
  }, 
  textInputStyle : {
    // fontSize : 15,
    // width : '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  btnCancel: {
    width: screenWidth/4,
    marginTop: 20,
    backgroundColor: "lightslategrey",
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  btnStart: {
    width: screenWidth/4,
    marginTop: 20,
    backgroundColor: "#49C4D7",
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    
  },
  txtCancel: {
    color: "white",
    // fontFamily: 'RIDIBatang',
    fontSize: 15,
    justifyContent: "center",
    textAlign: "center",
  },
  txtStart: {
    color: "white",
    fontWeight: 'bold',
    // fontFamily: 'RIDIBatang',
    fontSize: 15,
    justifyContent: "center",
    textAlign: "center",

  },
  
})

function mapStateToProps(state){

  return {
    isLogin: state.accountRd.isLogin,
    travelStatus: state.accountRd.travelStatus
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: (status) => {
      dispatch({
        type: "CHANGE_STATUS_ASYNC",
        payload: status
      })
    },
    setTravelName: (travelname) => {
      dispatch({
        type: "SET_TRAVEL_NAME_ASYNC",
        payload: travelname
      })
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalStartTravel)