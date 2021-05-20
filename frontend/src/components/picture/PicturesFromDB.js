import React from 'react';

import {
  Platform,
  PermissionsAndroid,
  View,
  Image,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import ActionCreator from '../../store/actions';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { getRecordPicture } from '../../api/picture'

class PicturesFromDB extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }

  async componentDidMount(){

    console.log(JSON.stringify(this.props.record.dayRecs,null,2))

    getRecordPicture(
      this.props.record.rec_id,
      (res) => {
        const tempDate = []
        for ( var day of this.props.record.dayRecs) {
          if (tempDate.includes(day.dr_date)) {
            continue
          } else {
            tempDate.push(day.dr_date)
          }
          const pictureSet = {
            id : day.dr_id,
            title : day.dr_start_time,
            data : [{
              id : day.dr_date,
              list: []
            }]
          }
          for ( var data of res.data[day.dr_date] ){
            var base64Image = `data:image/jpeg;base64,${data.ir_image}`
            const pictureForm = {
              id: data.img_id,
              uri: base64Image,
              imageSize: {
                width: data.width,
                height: data.height
              }
            }
            pictureSet.data[0].list.unshift(pictureForm)
          }
          this.setState({ ...this.state, data: [...this.state.data, pictureSet]})
        }
      },
      (err) => {
        console.log(err)
      }
    )
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
    const nowTime = new Date()
    const tempTime = time.split(' ')
    const toDate = tempTime[0].split('-')
    const toTime = tempTime[1].split(':')
    const tempTimeStamp = new Date(toDate[0],toDate[1]-1,toDate[2],toTime[0].slice(1),toTime[1],toTime[2]).getTime()+(-1*nowTime.getTimezoneOffset()*60000)*2
    const changedTimezone = new Date(tempTimeStamp)
    const changedDate = changedTimezone.toISOString().split('T')
    return this.dateForm(changedDate[0])
  }
  toLargeScale = (item) => {
    this.props.modePicture('look')
    this.props.navigation.navigate("SinglePicture", { picture : item })
  }

  render(){


    const renderdata = ({ item }) => {

      return (
        <View>
          <TouchableOpacity onPress={() => this.toLargeScale(item)} style={{margin:1}}>
            <Image 
              style={{ width: (screenWidth-6)/3, height: (screenWidth-6)/3}} 
              source={{ uri: item.uri }} />
          </TouchableOpacity>
        </View> 
      )
    }

    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
  
    return(
      <View>
        <SectionList
          sections={this.state.data}
          keyExtractor = {(data) => data.id}
          renderItem={({ item }) => (
            <FlatList
              data={item.list}
              numColumns={3}
              renderItem={renderdata}
            />
          )}
          renderSectionHeader={({section}) => (
            <View style={{ height: 40, justifyContent: 'center', marginLeft: 10}}>
              { section.data[0].list.length > 0 ? 
                <Text> {this.changeToTimezone(section.title)}에 찍은 사진  </Text> :
                <Text> {this.changeToTimezone(section.title)}에 찍은 사진은 없습니다. </Text>
              }
            </View>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({

});


function mapStateToProps(state) {

  return {
    selectedPictures: state.pictureRd.pictures,
    dayRecs: state.accountRd.todayTravel,
    mode: state.pictureRd.mode,
    record: state.accountRd.traveledList[state.accountRd.historyIndex],
    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modePicture: (mode) => {
      dispatch(ActionCreator.modePicture(mode))
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PicturesFromDB);