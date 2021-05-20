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

import MapView, { Marker, Callout, Polyline, Polygon, Circle } from "react-native-maps";

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Card, ListItem,  Icon, Avatar } from 'react-native-elements'
import PlaceList from '../../components/PlaceList'
import PinClickPage from '../../components/PinClickPage'
import MoneyBook from '../../components/book/MoneyBook'
import AddMoneyItem from '../../components/book/AddMoneyItem'

import { connect } from 'react-redux'
import ActionCreator from '../.././store/actions'


import { CommonActions } from '@react-navigation/native'
import { round } from 'react-native-reanimated';
// import Map_In_Main from '../../components/Map_In_Main'

class EndTravelMain extends React.Component {
  


  constructor (props) {
    super(props)
    this.state = {
      clickPin: false,
    }
  }

  startDay = async () => {
    await this.props.startNewDay(this.props.rec_id)
    await this.props.changeStatus('onTravel')
    await this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Home' },
          { name: 'OnTravelMain'},
        ]
      })
    )

  }

  saveRecord = async () => {
    this.props.changeStatus('rest')
    await this.props.getRecordListReq()
    await this.props.selectIndex(this.props.index)
    await this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Home' },
          { name: 'SingleTravelHistory'},
        ]
      })
    )
  }


  //핀 눌렀을 때 끌지 안끌지만 설정하는 함수 
  //자식에서 핀창 끄는용도다.
  selectPinFunc = (val) => {
    this.setState({ ...this.state, clickPin: val });
  }

  //핀 눌렀을 때 어떤 핀 눌렀는지까지 저장되는 함수
  newSelectPinFunc = async (val) => {
    console.log("newSelectPinFunc val??", val)
     await this.props.selectPin(val) //리듀서에서 state핀정보 바꾼다. 
     this.setState({
      ...this.state,
      clickPin: true,
    });
  }

  getPolyLine () {

    var polyArr = [];

    for (var day of this.props.travelingList) {
      for (var route of day.routeRecs) {
        var coordForm = {
          latitude: route.rr_latitude,
          longitude: route.rr_longitude
        }
        polyArr.push(coordForm)

      }
    }

    return polyArr
  }

  getMarker () {

    var markerArr = [];

    for (var markerDay of this.props.travelingList) {
      for (var markerRoute of markerDay.routeRecs) {
        if ( markerRoute.rr_name !== null) {
          var markerForm = {
            title : markerRoute.rr_name,
            coord: {
              latitude: markerRoute.rr_latitude,
              longitude: markerRoute.rr_longitude
            }
          }
          markerArr.push(markerForm)
        }
      }
    }
    return markerArr
  }

  changeToTimezone(time) {
    const nowTime = new Date()
    const tempTime = time.split(' ')
    const toDate = tempTime[0].split('-')
    const toTime = tempTime[1].split(':')
    const tempTimeStamp = new Date(toDate[0],toDate[1]-1,toDate[2],toTime[0].slice(1),toTime[1],toTime[2]).getTime()+(-1*nowTime.getTimezoneOffset()*60000)*2
    const changedTimezone = new Date(tempTimeStamp)
    const changedDate = changedTimezone.toISOString().split('T')
    return this.dateForm(changedDate[0])
  }

  dateForm(date) {
    try {
      const tempDate = date.split('-')
      return tempDate[0] + '년 ' +tempDate[1] + '월 ' + tempDate[2] + '일'
    } catch (error) {
      return null
    }
  }

  // getTitle () {
  //   var markerTitle = []

  //   for (var markerDay of this.props.travelingList) {
  //     for (var markerRoute of markerDay.routeRecs) {
  //       var titleForm = {
  //         title: markerRoute.rr_name
  //       }
  //       markerTitle.push(titleForm)

  //     }
  //   }

  //   return markerTitle
  // }


  // componentDidMount () {
  //   // console.log('테스트', this.props.travelStatus)
  //   // this.props.getCurrentInfo(this.props.todayTravel.dr_id)
  //   console.log("엔드트래블 커렌트", JSON.stringify(this.props.todayTravel.routeRecs, null, 2))
  // }

  render() {
    // console.log(JSON.stringify(this.props.travelingList, null, 2))
    // console.log(JSON.stringify(this.props.travelingList.routeRecs, null, 2))
    // console.log("EndTravelMain의 렌더 todayTravel", this.props.todayTravel)
    // console.log("EndTravelMain의 렌더 travellingList", JSON.stringify(this.props.travelingList, null, 2))
    // console 보고 .latitude 같은 것들 추가해야 함
    // const lat = this.props.todayTravel.todaycoords.lat
    // const lon = this.props.todayTravel.todaycoords.lon
    return (
      // 먼저 적는게 위로 감
      <LinearGradient 
      // colors={[ '#355C7D','#355C7D','#6C5B7B','#C06C84','#F67280','#F8B195',]}>
      // colors={[ '#270F36','#642B6B','#C86B98','#F09F9C','#C06C84',]}>
      // colors={[ '#221122','#0b3c60']}>
      // colors={[ '#272f37','#0b3c60']}>
      colors={[ '#0b3c60','#ffffff']}>
      {/* colors={[ '#85d7e4','#ffffff']}>  */}
      {/* colors={[ '#F09C8A','#ffffff']}> */}
      {/* colors={[ 'black','black']}> */}
      {/* // colors={[ '#49C4D7', '#ffffff']}> */}
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        // style={{backgroundColor:'pink'}}
      >
        
        {/* ================지도 위 버튼, 텍스트 시작================= */}
        <View >
          <View style={styles.dateContainer}>
            <View style={{ marginLeft:5, }}>
              <Text style={styles.topTitleStyle}>여행 {this.props.travelingList.length}일 째</Text>
            </View>
            { this.props.travelStatus === "dayEnd" ? 
              <TouchableOpacity style={[styles.btnDayStartOrEnd,styles.iconAndText]} onPress={this.startDay}>
                <Ionicons name="sunny-sharp" size={25} color={"#333333"}/>
                <Text style={{marginLeft:3}}>하루 시작</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={[styles.btnDayStartOrEnd,styles.iconAndText]} onPress={this.saveRecord}>
                <Ionicons name="home" size={25} color={"#333333"}/>
                <Text style={{marginLeft:3}}>여행 끝</Text>
              </TouchableOpacity>
            }
          </View>
        </View>

      <View style={{alignItems:'center', justifyContent:'center', marginTop:20}}>
        <Text style={styles.titleStyle}>행복했던 {this.changeToTimezone(this.props.todayTravel.dr_start_time)}의 기록</Text>
      </View>
      {/* ================지도 위 버튼, 텍스트 끝================= */}   
      


      {/* ====================지도 ================================= */}  
        <View style={styles.mapContainer}>
          {/* 지도, 폴리라인, 그날 여행에서 찍힌 마커 */}
          <MapView
              style={{ flex:1, margin: 10, }}
              region = {{
                  latitude: this.props.todayTravel.routeRecs.length === 0 || this.props.todayTravel.routeRecs[0].rr_latitude === undefined ? 37.57982954633664 : this.props.todayTravel.routeRecs[0].rr_latitude,
                  longitude: this.props.todayTravel.routeRecs.length === 0 || this.props.todayTravel.routeRecs[0].rr_longitude === undefined ? 126.9770088111815 : this.props.todayTravel.routeRecs[0].rr_longitude,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03

              }}
          >
           
            <Polyline
              coordinates={this.getPolyLine()}
              strokeColor='red'
              strokeWidth={3}
            >

            </Polyline>
            {
              this.getMarker().map((marker, markerIndex) => {
                return (
                  <MapView.Marker
                    coordinate={marker.coord}
                    key={markerIndex}
                    title={marker.title}
                    // title={this.props.travelingList.routeRecs[markerIndex].rr_name}
                  />
                )
              })
            }


          

            {/* {
              this.props.travelingList.map((days, dayIndex) => {
                days.routeRecs.map((marker, markerIndex) => {
                  if (marker.rr_name !== null) {
                    return (
                      <Marker
                        coordinate={{latitude: marker.rr_latitude, longitude: marker.rr_longitude}}
                        key={markerIndex}
                        title={marker.rr_name}
                        onPress={()=> {}}
                      />

                    )
                  } 
                })
              })
            } */}
          </MapView>
        </View>
        {/* =================== 지도 ================================= */}  

        {/* ================ 방문장소 시작================================= */}
        <View style = {styles.subContainer}>
          <View style={styles.iconAndText}> 
            {/* <Ionicons name="footsteps-sharp" size={25} color={"#333333"}/> */}
           <MaterialIcons name="auto-awesome" size={25} color={"#333333"}/>
            <Text style={styles.titleStyle}>{this.props.user_nickname}님이 방문한 장소 </Text>
          </View>
          <PlaceList navigation={this.props.navigation} newSelectPinFunc={this.newSelectPinFunc} />
          { this.state.clickPin
          ? <PinClickPage 
          navigation={this.props.navigation}
          selectPinFunc={this.selectPinFunc}/>
          : null}
        </View>
        {/* ================ 방문장소 끝================================= */}  



        {/* ================ 가계부 시작================================= */}  
        <View style={styles.subContainer}>
          <View style={styles.iconAndText}> 
            <Ionicons name="flag-sharp" size={25} color={"#333333"}/>
            <Text style={styles.titleStyle}>{this.changeToTimezone(this.props.todayTravel.dr_start_time)}의 지출</Text>
          </View>
          <MoneyBook />
          <AddMoneyItem />
        </View>
        {/* ================ 가계부 끝================================= */}  



        {/* <Button title={'사진 공유하기'} onPress={this.sharePicture}/> */}
      
      
      </ScrollView>
        </LinearGradient>
    )
  }
}

const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  dateContainer: {
    flexDirection: 'row',
    height: screenHeight/15,
    backgroundColor: '#0b3c60',
    alignItems: 'center',
    justifyContent: 'space-between',
    // zIndex:100,
    elevation: 5, 
  },
  mapBorder:{
    

  },
  mapContainer: {
    margin: 10,
    height: screenHeight/3,
    // backgroundColor: 'green',
    borderWidth: 5, 
    borderColor:'beige', 
    borderStyle: 'solid',
    borderRadius: 10,
    
    
    
  },
  subContainer: {
    marginVertical: 10, 
    // 
  },
  iconAndText: {
    flexDirection:'row',
    alignItems:'center',
    marginLeft: 10,
  },
  topTitleStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: 'white',
  },
  titleStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: 'white',
    // fontWeight:'bold',
  },
  btnDayStartOrEnd : {
    marginRight:10,
    backgroundColor: "#FFBE58",
    padding: 10,
    borderRadius: 15,
    elevation: 3,
  }
})


function mapStateToProps(state) {

  return {
    user_nickname: state.accountRd.user.usr_nickname,
    travelStatus: state.accountRd.travelStatus,
    rec_id: state.accountRd.travelingId,
    index: state.accountRd.traveledList.length-1,
    todayTravel: state.accountRd.todayTravel,
    rdPin : state.accountRd.selectedPin,
    rdVisitedPlace : state.accountRd.visitedPlace,
    travelingList : state.accountRd.travelingList,
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
    startNewDay: (rec_id) => {
      dispatch({
        type: "START_DAY_ASYNC",
        payload: rec_id
      })
    },
    selectIndex: (index) => {
      dispatch(ActionCreator.selectIndex(index))
    },
    getRecordListReq: () => {
      dispatch({
        type: 'GET_RECORD_LIST_ASYNC'
      })
    },
    selectPin: (pinData) => {
      dispatch(ActionCreator.selectPin(pinData))
    },
    getCurrentInfo: (dr_id)=>{
      dispatch({
        type: "GET_CURRENT_INFO_ASYNC",
        payload: dr_id
      })
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EndTravelMain) 