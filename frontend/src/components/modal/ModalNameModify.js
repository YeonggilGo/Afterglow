import React from 'react'

import { connect } from 'react-redux'
import ActionCreator from '../../store/actions'


import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Button, Overlay,Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';



class ModalNameModify extends React.Component {

  constructor(props){
    super(props)
    this.state = { 
      modalVisible: false,
      newName:'',
      nameValid: false, }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  

  setName = async (t) => {
    await this.setState({ ...this.state, newName: t });
    if (t.trim().length === 0) {
      this.setState({ ...this.state, nameValid: false });
    } else {
      this.setState({ ...this.state, nameValid: true });
    }
  }


  changeName = () => {
    const nameItem = {
      "route_name": this.state.newName,
      "Rr_id": this.props.rdPin.rr_id,
      // "consumption_time": new Date()
    }
    console.log("장소아이템", nameItem)
    this.props.changePlaceName(nameItem)

    this.setState({
      modalVisible: false,
      newName:'',
      nameValid: false, 
    });
  }

  cancelName = () => {
  
    this.setState({
      modalVisible: false,
      newName:'',
      nameValid: false, 
    });
  }




  render() {

    // const { modalVisible } = this.state;
    return (

      <View>
      <TouchableOpacity style={styles.btnModal}
        onPress={ () => this.setModalVisible(!this.state.modalVisible) } >
        <Ionicons name="create-outline" size={25} color={"#333333"}/>
      </TouchableOpacity>

      <Overlay 
        overlayStyle={styles.container}
        isVisible={this.state.modalVisible}
        onBackdropPress={ () => this.setModalVisible(!this.state.modalVisible)}>
        {/* <View> */}
        <Text style={styles.txtTitle}>장소의 새로운 이름을 적어주세요!</Text>
        <View style={styles.inputWrap}>
          <Input
            placeholder='(장소명)'
            value={this.state.newName}
            onChangeText={(t) => this.setName(t)}
            style={{fontSize:15}} />
        </View>


        {(this.state.nameValid) 
        ? null 
        : <Text style={{fontSize:15,color:'red'}}>이름을 적어주세요.</Text> }
        



        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btnCancel} onPress={this.cancelName}>
          <Text style={styles.txtEnd}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.changeName}
        onPress={ (this.state.nameValid)
          ? this.changeName
          : null }>
          <Text style={styles.txtEnd}>변경</Text>
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

  btnModal: {
    // width: screenWidth/2.5,
    // marginTop: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  container: {
    // backgroundColor: '#f3ffff',
    // width : screenWidth/1.3,
    // height : screenHeight/2,
    paddingVertical: screenWidth/20,
    paddingHorizontal: screenWidth/20,
  },
  inputWrap:{
  },
  txtTitle: {
    // fontFamily: 'RIDIBatang',
    textAlign: 'center',
    // fontSize: 15,
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
    flexDirection:'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  btnCancel: {
    width: screenWidth/5,
    padding: 15,
    backgroundColor: "lightslategrey",
    borderRadius: 15,
    elevation: 3,
  },
  
  changeName: {
    width: screenWidth/5,
    padding: 15,
    backgroundColor: "mediumturquoise",
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
  
  
})

function mapStateToProps(state){

  return {
    rdPin : state.accountRd.selectedPin
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePlaceName: (data) => {
      dispatch({
        type: "CHANGE_PLACE_NAME_ASYNC",
        payload: data
      })

    }
    

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalNameModify)