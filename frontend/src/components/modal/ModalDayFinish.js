import React from 'react'

import { connect } from 'react-redux'
import ActionCreator from '../../store/actions'


import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Button, Overlay,Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';



class ModalDayFinish extends React.Component {

  constructor(props){
    super(props)
    this.state = { modalVisible: false }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  endDay = () => {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate('SavePictures');
    this.props.changeStatus('dayEndd');
    this.props.modePicture('save');
    this.props.emptyList();
  }

  endTravel = () => {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate('SavePictures');
    this.props.changeStatus('travelEndd');
    this.props.modePicture('save');
    this.props.emptyList();
  }


  render() {

    // const { modalVisible } = this.state;
    return (

      <View>
      <TouchableOpacity style={styles.btnDayEndModal}
        onPress={ () => this.setModalVisible(!this.state.modalVisible) } >
        <Ionicons name="moon" size={25} color={"#333333"}/>
        <Text style={{margin:2,}}>하루 끝</Text>
      </TouchableOpacity>

      <Overlay 
        overlayStyle={styles.container}
        isVisible={this.state.modalVisible}
        onBackdropPress={ () => this.setModalVisible(!this.state.modalVisible)}>
        {/* <View> */}
        <Text style={styles.txtTitle}>오늘 여행을 마칠까요?</Text>
        <Text style={styles.txtInfo}>내일도 여행을 하신다면 [쉼표] 버튼을,</Text>
        <Text style={styles.txtInfo}>여행을 끝내려면 [마침표] 버튼을 눌러주세요.</Text>
        
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btnEndDay} onPress={this.endDay}>
          <Text style={styles.txtEnd}>쉼표</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnEndTravel} onPress={this.endTravel}>
          <Text style={styles.txtEnd}>마침표</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCancel} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
          <Text style={styles.txtEnd}>취소</Text>
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
    width : screenWidth/1.3,
    height : screenHeight/1.8,
    paddingVertical: screenWidth/30,
    paddingHorizontal: screenWidth/30,
  },
  txtTitle: {
    // fontFamily: 'RIDIBatang',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: screenHeight/30,
  },
  txtInfo: {
    // fontFamily: 'RIDIBatang',
    textAlign: 'center',
    fontSize: 15,
    marginVertical: 3,
  },
  buttonContainer: {
    marginVertical: screenHeight/40,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  btnCancel: {
    width: screenWidth/2.5,
    marginTop: screenHeight/40,
    backgroundColor: "lightslategrey",
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  btnEndDay: {
    width: screenWidth/2.5,
    marginTop: screenHeight/40,
    backgroundColor: "#49C4D7",
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  btnEndTravel: {
    width: screenWidth/2.5,
    marginTop: screenHeight/40,
    backgroundColor: "#FFBE58",
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  txtEnd: {
    color: "white",
    fontWeight: 'bold',
    // fontFamily: 'RIDIBatang',
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  btnDayEndModal: {
    // width: screenWidth/2.5,
    // marginTop: 20,
    // flex:0.8,
    marginRight:10,
    backgroundColor: "#49C4D7",
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
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
    modePicture: (mode) => {
      dispatch(ActionCreator.modePicture(mode))
    },
    emptyList: () => {
      dispatch(ActionCreator.emptyList())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDayFinish)