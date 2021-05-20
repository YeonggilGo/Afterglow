import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Dimensions,} from 'react-native';

import { Card, ListItem, Input  } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux'
import ActionCreator from '../store/actions';
import { getRecoPlaceAsync } from '../store/saga/accountSagas';

import RoutePicturesHorz from './picture/RoutePictureHorz'
import ModalNameModify from '../components/modal/ModalNameModify'

class PinClickPage extends React.Component {

  constructor (props) {
    //부모 컴포넌트로부터 선택된 방문정보 객체로 받아온상태
    //this.props.selectedPin 하면 정보 쫙나옴
    super(props)
		this.state = {
			modifyStatus: false,
			memoText:'',
			newMemoText:'',
      modalStatus: false,
		}
  }


	setText = (t) => {
    this.setState({ ...this.state, newMemoText: t });
		console.log("memoText", this.state.memoText)
		console.log("newMemoText", this.state.newMemoText)
  }

//   selectPinFunc = () => {
// 		this.setState({ clickPin: false });
//   }

	switchStatus = (val) => {
		this.setState({ ...this.state, modifyStatus: val });
	}

	modifyCancel = () => {
		const memoText = this.state.memoText
		this.setState({ ...this.state, newMemoText: memoText });
		this.switchStatus(false)
	}

	modifyComplete = async () => {
    const memoItem = {
      "Rr_id" : this.props.rdPin.rr_id,
      "memo_content": this.state.newMemoText
    }
    console.log("memotiem?", memoItem)
    await this.props.updateMemo(memoItem)
    this.switchStatus(false)
    
	}




	componentDidMount() {
    const rr_memo = this.props.rdPin.rr_memo
    this.setState({
      ...this.state,
      memoText: rr_memo,
      newMemoText: rr_memo });
  }


  componentDidUpdate(prevProps) {
    if (this.props.rdPin.rr_id !== prevProps.rdPin.rr_id  ) {
      const rr_memo = this.props.rdPin.rr_memo
      this.setState({
      ...this.state,
      memoText: rr_memo,
      newMemoText: rr_memo });
    } 
  }

  render() {
  
    // const rr_memo = this.props.rdPin.rr_memo
    
    return (
      <View style={{borderWidth:10, borderColor:'black'}}>
          <TouchableOpacity 
          style={{ margin : 10}}
          onPress={() => this.props.selectPinFunc(false)}>
            <Ionicons name={"close-outline"} size={40}/>
          </TouchableOpacity>
        <View style={{flexDirection:'row', justifyContent:'center'}}>
          <Text style={{textAlign:'center',fontSize:25}} key={this.props.rdPin.rr_name}>{this.props.rdPin.rr_name} </Text>
          <ModalNameModify navigation={this.props.navigation}
           /> 
        </View>


            <View style={styles.container}>
                {this.state.modifyStatus
                ? <Text style={{
                  fontSize:15,
                  color: 'grey',
                  textAlign:'right'
                }}>메모 수정 후 완료 버튼을 눌러주세요!</Text>
                : <Text style={{ fontSize:15,color: 'grey',textAlign:'right'}}> </Text>
                }
              <View style={{ alignItems: 'flex-end', marginBottom:5 }}>
                {
                  !(this.state.modifyStatus)
                  ? <TouchableOpacity style={styles.btnModify} onPress={ () => this.switchStatus(true) } >
                      <Ionicons name="create-outline" size={25} color={"#333333"}/>
                    </TouchableOpacity>
                  : <View style={styles.btnContainer}>
                      <TouchableOpacity style={styles.btnModify} onPress={this.modifyCancel } >
                      <Ionicons name="close" size={25} color={"#333333"}/>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnModify} onPress={this.modifyComplete } >
                      <Ionicons name="checkmark" size={25} color={"green"}/>
                      </TouchableOpacity>
                    </View>
                }

              </View>
              
              <TextInput
                editable={this.state.modifyStatus}
                autoFocus={this.state.modifyStatus}
            		multiline={true}
								style={styles.memoInput}
								value={(this.state.newMemoText)}
								onChangeText={(t) => this.setText(t)}
            	/>
							<View style={styles.btnContainer}>

              
      
							
							
							</View>

              <View>
                <RoutePicturesHorz navigation={this.props.navigation}/>
              </View>

        		</View>
      </View>
    )
  }

}

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: screenWidth/8,
        marginVertical:screenHeight/20
    },
    
    memoInput:{
        height: screenHeight/8,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
				color: 'black'
    },
		btnContainer:{
      paddingTop:10,
			flexDirection:'row',
			justifyContent:'flex-end'
		},
    btnModify: {
      marginHorizontal:3,
    }
  
  
})

function mapStateToProps(state) {

  return {
    isLogin: state.accountRd.isLogin,
    user_nickname: state.accountRd.user.usr_nickname,
    rdPin : state.accountRd.selectedPin
  }
}


function mapDispatchToProps(dispatch) {
  return {
    updateMemo: (memoItem) => {
      // console.log("mapDispatchToProps")
      dispatch({
        type: "SAVE_MEMO_ASYNC",
        payload: memoItem
      })
    },
    selectPin: () => {
      dispatch(ActionCreator.selectPin(pinData))
    }

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PinClickPage) 


