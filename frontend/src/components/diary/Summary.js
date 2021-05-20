import React from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native'

import { connect } from 'react-redux'

import { Card } from 'react-native-elements'

import ActionCreator from '../../store/actions'

import MapView, { Marker, Callout, Polyline, Polygon, Circle } from "react-native-maps";

import MoneyBook from '../../components/book/MoneyBook'

import { getRecordPicture } from '../../api/picture'

class Summary extends React.Component {

  constructor(props) {
    super(props)
    this.state={
      savedPicture: 0
    }
  }

  componentDidMount(){
    // console.log("현재는",JSON.stringify(this.props.record,null,2))
    this.getSelectedPictures()
  }

  dateForm(date) {
    try {
      const tempDate = date.split('-')
      return tempDate[0] + '년 ' +tempDate[1] + '월 ' + tempDate[2] + '일 '
    } catch (error) {
      // console.log(error)
      return "이런"
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

  changeToTimezone(time) {
    try {
      const nowTime = new Date()
      const tempTime = time.split(' ')
      const toDate = tempTime[0].split('-')
      const toTime = tempTime[1].split(':')
      const tempTimeStamp = new Date(toDate[0],toDate[1]-1,toDate[2],toTime[0].slice(1),toTime[1],toTime[2]).getTime()+(-1*nowTime.getTimezoneOffset()*60000)*2
      const changedTimezone = new Date(tempTimeStamp)
      const changedDate = changedTimezone.toISOString().split('T')
      return this.dateForm(changedDate[0])
    } catch (error) {
      return null
    }
  }


  totalTime() {
    try {
      var totalTime = 0
      for ( var day of this.props.record.dayRecs){
        if (day.dr_time_spent !== null) {
          var tempTime = day.dr_time_spent.split(":")
        } else {
          var give = "0:0"
          tempTime = give.split(":")
        }
        var hours = Number(tempTime[0])
        var mins = Number(tempTime[1])
  
        var tempTotal = hours * 60 + mins
        totalTime += tempTotal
      }
      const _day = Math.floor(totalTime/1440)
      const _hours = Math.floor(totalTime%1440/60)
      const _mins = Math.floor(totalTime%60)
      
      return _day > 0 ? ( _hours > 0 ? _days + '일 ' + _hours + '시간 ' + _mins + '분' : _days + '일 ' + _mins + '분' ) :
                        ( _hours > 0 ? _hours + '시간 ' + _mins + '분' : _mins + '분' )
    } catch (error) {
      // console.log(error)
      return 0
    }
  }

  getLocation() {
    // 여행의 시작 위치가 어떤 시/도 인지
  }

  totalPlaces() {
    var total = 0
    for ( var day of this.props.record.dayRecs ) {
      for ( var route of day.routeRecs ){
        if ( route.rr_name !== null ) { total += 1 }
      }
    }
    return total
  }

  getTotalPictures() {
    // console.log(JSON.stringify(this.props.record, null, 2))
    // 지금까지 몇개의 사진을 찍었는지도 db에 저장해야한다
    return this.props.record.total_img_count
  }

  getSelectedPictures() {

    getRecordPicture(
      this.props.record.rec_id,
      (res) => {
        const tempDate = []
        for ( var date of this.props.record.dayRecs) {
          if ( !tempDate.includes(date.dr_date) ) {
            tempDate.push(date.dr_date)
          }
        }
        for ( var date of tempDate) {
          this.setState({ ...this.state, savedPicture: this.state.savedPicture + res.data[date].length})
        }
      },
      (err) => {
        console.log(err)
      }
    )

  }

  getPolyLine () {

    var polyArr = [];

    for (var day of this.props.record.dayRecs) {
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

    for (var markerDay of this.props.record.dayRecs) {
      for (var markerRoute of markerDay.routeRecs) {
        var markerForm = {
          latitude: markerRoute.rr_latitude,
          longitude: markerRoute.rr_longitude
        }
        markerArr.push(markerForm)

      }
    }
  }

  render() {

    const history = this.props.record
    const len = history.dayRecs.length
    const startDate = history.dayRecs[0].dr_start_time
    const endDate = history.dayRecs[len-1].dr_end_time
    const title = history.rec_name

    return(
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <Card containerStyle={[{marginHorizontal:0}, styles.dateContainer]}>

          <Text style={styles.dateStyle}> {this.changeToTimezone(startDate)} ~ {this.changeToTimezone(endDate)}</Text>

        </Card>

        <Card containerStyle={{marginHorizontal:0, padding:0, borderRadius: 10}}>
          <View style={styles.mapContainer}>
            <MapView
              initialRegion={{
                latitude: this.props.record.dayRecs[0].routeRecs.length === 0 || this.props.record.dayRecs[0].routeRecs[0].rr_latitude === undefined ? 126.3128 :this.props.record.dayRecs[0].routeRecs[0].rr_latitude,
                longitude: this.props.record.dayRecs[0].routeRecs.length === 0 || this.props.record.dayRecs[0].routeRecs[0].rr_latitude === undefined ? 33.2364 : this.props.record.dayRecs[0].routeRecs[0].rr_longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
              }}
              style={{ flex:1, margin: 10 }}
            >
              {/* <Polyline
                coordinates={this.getPolyLine()}
                strokeColor='red'
                strokeWidth={1}
              >
              </Polyline>
              {
                this.getMarker().map((marker, markerIndex) => {
                  return (
                    <MapView.Marker
                      coordinate={marker}
                      key={markerIndex}
                    />
                  )
                })
              } */}



            </MapView>
          </View>
        </Card>

        <Card containerStyle={[{marginHorizontal:0}]} wrapperStyle={ styles.summaryContainer}>
            <Text style={styles.textStyle}><Text style={{backgroundColor:'paleturquoise'}}>"{title}"</Text> 여행을</Text>
            {/* <Text style={styles.textStyle}>{this.props.user_nickname}님과 함께</Text> */}
            {/* <Text style={styles.textStyle}><Text style={{ color: 'mediumslateblue'}}>제주도</Text>에서 시작해</Text> */}
            <Text style={styles.textStyle}><Text style={{ color: 'cornflowerblue'}}>{this.totalTime()}</Text> 동안</Text>
            <Text style={styles.textStyle}><Text style={{ color: 'royalblue'}}>{this.totalPlaces()}</Text>개의 관광지를 들르고</Text>
            <Text style={styles.textStyle}><Text style={{ color: 'salmon' }}>{this.getTotalPictures()}</Text>장의 사진을 찍고</Text>
            <Text style={styles.textStyle}><Text style={{ color: 'cornflowerblue'}}>{this.state.savedPicture}</Text>장의 사진으로 <Text style={{backgroundColor:'cornsilk'}}>여운</Text>을 남겼어요.</Text>
        </Card>

        <Card containerStyle={[{marginHorizontal:0}, styles.bookContainer]}>
          <Text style={styles.textStyle}>얼마를 썼나요?</Text>  
            <MoneyBook/>      
        </Card>
      </ScrollView>
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
    height: screenHeight/8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapContainer: {
    height: screenHeight/3,
    borderWidth: 5, 
    borderColor:'beige', 
    borderStyle: 'solid',
    borderRadius: 10,
  },
  summaryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bookContainer: {
    // backgroundColor: 'pink',
    // height: 700,
    marginBottom: 50
  },
  dateStyle: {
    fontSize: 20,
  },
  textStyle:{
    margin: 10,
  }
})


function mapStateToProps(state) {

  // state.accountRd.travelingList.map((item) => console.log(JSON.stringify(item,null,2)))

  return {
    index: state.accountRd.historyIndex,
    user_nickname: state.accountRd.user.usr_nickname,
    record: state.accountRd.traveledList[state.accountRd.historyIndex],
    // 여행 정보
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: (picture) => {
      dispatch(ActionCreator.selectPicture(picture));
    },
    unselect: (picture_id) => {
      dispatch(ActionCreator.unselectPicture(picture_id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);