import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5' 
import { connect } from 'react-redux'

import ActionCreator from '.././store/actions'
import ModalStartTravel from '../components/modal/ModalStartTravel'

import MainList from '../components/MainList'
import Maps_cluster from '../components/maps/Maps_cluster'

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      mode: "map",
    }
  }

  continueTravel = async () => {
    if ( this.props.travelStatus === "onTravel" || 
        this.props.travelStatus === "dayEndd" || 
        this.props.travelStatus === "travelEndd" ) {
      await this.props.getCurrentInfo(this.props.dr_id)
      await this.props.getRecordListReq()
      await this.props.navigation.navigate('OnTravelMain')
    } else if ( this.props.travelStatus === "dayEnd" || this.props.travelStatus === "travelEnd" ) {
      await this.props.getRecordListReq()
      await this.props.navigation.navigate('EndTravelMain')
    } else {
      console.warn(this.props.travelStatus)
    }
  }

  componentDidMount() {
    // console.log("componentDidMount부분", JSON.stringify(this.props.traveledList, null, 2))
    this.props.getRecordListReq()
  }


  render() {

    return (
      <View style={styles.container}>
        { this.state.mode === "map" ? 
          <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, marginTop: 40}}>
            <Maps_cluster navigation={this.props.navigation}/>
          </View> :
          <MainList navigation={this.props.navigation}/> 
        }

        { this.state.mode === "map" ? 
          <View style={{position: 'absolute', right:10, bottom:10}}>
            {
            this.props.travelStatus === "rest"
            ? <ModalStartTravel navigation={this.props.navigation} /> 
            : 
            <TouchableOpacity 
              onPress={this.continueTravel}
              style={styles.startBtn}>
              <Ionicons name="airplane" size={60} color={"skyblue"}/>
            </TouchableOpacity>
  
            }
          </View> :
          null  
        }

        <View style={{position: 'absolute', flexDirection: "row", top: 0, backgroundColor: 'grey'}}>
          <TouchableOpacity
            disabled={this.state.mode=== "map" ? true: false}
            style={[styles.segmentBtn, { marginLeft : 3},this.state.mode === "map" ? {backgroundColor: 'skyblue'} : null]}
            onPress={() => this.setState({mode: "map"})}>
            <Text style={styles.segmentBtnText}>지도</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          disabled={this.state.mode=== "list" ? true: false}
            style={[styles.segmentBtn, { marginRight : 3},this.state.mode === "list" ? {backgroundColor: 'skyblue'} : null]} 
            onPress={() => this.setState({mode: "list"})}>
            <Text style={styles.segmentBtnText}>리스트</Text>
          </TouchableOpacity>
          
        </View>
        
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  segmentBtn: {
    flex: 0.5,
    height: 30,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  segmentBtnText: {
    fontSize: 18,
  },
  startBtn: {
    backgroundColor: "blue",
    borderColor: "black",
    borderWidth: 3,
    padding:20,
    borderRadius: 180
  }, 

})


function mapStateToProps(state){
  // console.log("홈이당", state.accountRd)
  return {
    isLogin: state.accountRd.isLogin,
    travelStatus: state.accountRd.travelStatus,
    traveledList: state.accountRd.traveledList,
    dr_id: state.accountRd.todayTravel.dr_id
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
    getCurrentInfo: (dr_id)=>{
      dispatch({
        type: "GET_CURRENT_INFO_ASYNC",
        payload: dr_id
      })
    },
    getRecordListReq: () => {
      dispatch({
        type: 'GET_RECORD_LIST_ASYNC'
      })
    }
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)