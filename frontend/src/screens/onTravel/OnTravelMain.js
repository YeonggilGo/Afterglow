import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import MoneyBook from '../../components/book/MoneyBook'
import AddMoneyItem from '../../components/book/AddMoneyItem'
import PlaceList from '../../components/PlaceList'
import RecPlaceList from '../../components/RecPlaceList'
import ModalDayFinish from '../../components/modal/ModalDayFinish'
import PinClickPage from '../../components/PinClickPage'

import { connect } from 'react-redux'
import ActionCreator from '../.././store/actions'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, Callout, Polyline, Polygon, Circle } from "react-native-maps";

import Geolocation from 'react-native-geolocation-service';



class OnTravelMain extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      startDate: '',
      passedTime: '',
      clickPin: false,
      lat : 0,
      lon : 0,
    }
  }

  //핀 눌렀을 때 끌지 안끌지만 설정하는 함수 
  selectPinFunc = (val) => {
    this.setState({ ...this.state, clickPin: val });
    // console.log("핀상태",this.state.clickPin )
  }


  //핀 눌렀을 때 어떤 핀 눌렀는지까지 저장되는 함수
  newSelectPinFunc = async (val) => {
    await this.props.selectPin(val) //리듀서에서 state핀정보 바꾼다. 
    // console.log("newSelectPinFunc val??", this.props.rdPin)
    this.setState({
      ...this.state,
      clickPin: true,
    });
    
  }

  changeToTimezone(time) {
    try{
      const nowTime = new Date()
      const tempTime = time.split(' ')
      const toDate = tempTime[0].split('-')
      const toTime = tempTime[1].split(':')
      const tempTimeStamp = new Date(toDate[0],toDate[1]-1,toDate[2],toTime[0].slice(1),toTime[1],toTime[2]).getTime()+(-1*nowTime.getTimezoneOffset()*60000)*2
      const changedTimezone = new Date(tempTimeStamp)
      const changedDate = changedTimezone.toISOString().split('T')
      return this.dateForm(changedDate[0])
    } catch {
      return null
    }
  }

  dateForm(date) {
    try {
      const tempDate = date.split('-')
      return tempDate[0] + '년 ' +tempDate[1] + '월 ' + tempDate[2] + '일'
    } catch (error) {
      return null
    }
  }

  timeForm(time) {
    if ( time === null || time === undefined ) {
      return '첫 걸음'
    } else {
      const tempTime = time.split(':')
      const hours = Number(tempTime[0])
      const mins = Number(tempTime[1])
      return hours > 0 ? ( mins > 0 ? hours + '시간 ' + mins + '분' : hours+'시간') :
              ( mins > 0 ? mins + '분' : '첫 걸음' )
    }
  }

  componentDidMount () {
    // console.log(this.changeToTimezone(this.props.todayTravel.dr_start_time))
    Geolocation.getCurrentPosition(
      (position) => {
        // 확인 완료
        // console.log('현재 위치 확인용', position)
        // console.log('현재 위치 확인용2', position.coords.latitude)

        this.setState({
          lat : position.coords.latitude,
          lon : position.coords.longitude
        })

        // =====================이거는 추천관광지=================
      this.props.getRecoPlace({
        "limit_radius": 3,
        "cur_latitude": position.coords.latitude,
        "cur_longitude": position.coords.longitude,
      });


        // 확인 완료
        // console.log('현재위치 확인용', this.state)


        // console.log(position);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        console.log(error);
      },
      // 현재 위치에 대한 옵션들
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );


    

  }

  getPolyLine () {
    var polyArr = [];

    for (var route of this.props.todayTravel.routeRecs) {
      var coordForm = {
        latitude: route.rr_latitude,
        longitude: route.rr_longitude
      }
      polyArr.push(coordForm)
    }

    return polyArr
  }

  // getMarker () {
  //   var markerArr = [];

  //   for (var route of this.props.todayTravel.routeRecs) {
  //     var coordForm = {
  //       latitude: route.rr_latitude,
  //       longitude: route.rr_longitude
  //     }
  //     markerArr.push(coordForm)
  //   }

  //   return markerArr
  // }
  
  render() {
    // const REGION = {
    //   latitude: this.state.lat,
    //   longitude: this.state.lon,
    //   latitudeDelta: 0.1,
    //   longitudeDelta: 0.05
    // }

    return (
      <ScrollView style={styles.container}>
        <View style={{marginVertical:5, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={{marginLeft:10}} key={new Date().getMinutes()}>
            {this.changeToTimezone(this.props.todayTravel.dr_start_time)}, {this.timeForm(this.props.todayTravel.dr_time_spent)}
          </Text>
          <ModalDayFinish navigation={this.props.navigation}
           /> 
        </View>

        {/* 지도, 폴리라인, 마커, 추천여행지 this.props.todaytravel */}
        {/* 지도가 처음에 0 갔다가 뿅하고 이동함 */}
        <View
          style={{ flex:1 }}
        >

          <MapView
            // initialRegion={REGION}
            region = {{
              latitude: this.state.lat,
              longitude: this.state.lon,
              latitudeDelta: 0.007,
              longitudeDelta: 0.007
            }}
            style={{height:200}}
            showsUserLocation = {true}
          >
            <Polyline
              coordinates={this.getPolyLine()}
              strokeColor='red'
              strokeWidth={1}
            ></Polyline>

            {
              this.props.todayTravel.routeRecs.map((marker, index) => 
                {
                  if (marker.rr_name !== null) {
                    return (
                      <Marker
                        coordinate={{latitude: marker.rr_latitude, longitude: marker.rr_longitude}}
                        key={index}
                        title={marker.rr_name}
                        onPress={()=> {}}
                      />

                    )
                  } 
                }
              )
            }

            {/* 추천 여행지 관련 마커
            {
              this.props
            } */}


          </MapView>
        </View>
        
        { this.state.clickPin
        ? <PinClickPage 
          selectPinFunc={this.selectPinFunc}
          navigation={this.props.navigation}
          />
        : 
          <View>

            {/* ================ 여행 안내================================= */}
            {/* <View style = {styles.subContainer}> */}
              <View style={[styles.iconAndText, {justifyContent:'center'}]}> 
                {/* <FontAwesome name="plane" size={25} color={"#333333"}/> */}
                <Text style={{marginVertical:20, fontSize:20, textAlign:'center' }}>
                  "{this.props.travelingName}" 여행, {this.props.travelingList.length}일 째</Text>
              </View>
            {/* </View> */}
            {/* ================ 여행 안내 끝 ================================= */}


            {/* ================ 방문장소 시작================================= */}
            <View style = {styles.subContainer}>
              <View style={styles.iconAndText}> 
                {/* <Ionicons name="footsteps" size={25} color={"#333333"}/> */}
                <MaterialIcons name="auto-awesome" size={25} color={"#333333"}/>
                <Text style={styles.titleStyle}>{this.props.user_nickname}님이 방문한 장소 </Text>
              </View>
              { (this.props.todayTravel.routeRecs.filter( (item) => item.rr_name !== null && item.rr_name !== "")).length === 0
                ? <Text style={{marginLeft:20, marginTop:10, color:'grey'}}>이동 중이에요!</Text>
                : <PlaceList newSelectPinFunc={this.newSelectPinFunc} />
              }
            </View>
            {/* ================ 방문장소 끝================================= */}  


            {/* ================ 가계부 시작================================= */} 
            <View style={styles.subContainer}>
              <View style={styles.iconAndText}> 
                <Ionicons name="wallet-sharp" size={25} color={"#333333"}/>
                <Text style={styles.titleStyle}>{this.changeToTimezone(this.props.todayTravel.dr_start_time)}의 지출</Text>
              </View>
              <MoneyBook />
              <AddMoneyItem />
            </View>
            {/* ================ 가계부 끝================================= */}  
          <View style={styles.subContainer}>
            <View style={styles.iconAndText}> 
              <Ionicons name="flag-sharp" size={25} color={"#333333"}/>
              <Text style={styles.titleStyle}>주변에 이런 곳이 있어요!</Text>
            </View>
            <View key={this.props.recoPlace}>
              <RecPlaceList  />
            </View>
            </View>
          </View>
      }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  subContainer: {
    marginVertical: 15, 
    // 
  },
  iconAndText: {
    flexDirection:'row',
    alignItems:'center',
    marginLeft: 10,
  },
  titleStyle: {
    fontSize: 20,
    marginLeft: 10,
  },
})


function mapStateToProps(state) {

  return {
    isLogin: state.accountRd.isLogin,
    user_nickname: state.accountRd.user.usr_nickname,
    travelingName: state.accountRd.travelingName,
    travelStatus: state.accountRd.travelStatus,
    todayTravel: state.accountRd.todayTravel,
    // todayTravelRoute: state.accountRd.todayTravel.routRecs,
    rdPin : state.accountRd.selectedPin,
    travelingList : state.accountRd.travelingList,
    recoPlace : state.accountRd.recoPlace,
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
    modePicture: (mode) => {
      dispatch(ActionCreator.modePicture(mode))
    },
    emptyList: () => {
      dispatch(ActionCreator.emptyList())
    },
    selectPin: (pinData) => {
      dispatch(ActionCreator.selectPin(pinData))
    },
    getRecoPlace: (data) => {
      dispatch({
        type:"GET_RECO_PLACE_ASYNC", 
      payload:data})
    }
    

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(OnTravelMain) 