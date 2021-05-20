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

import CameraRoll from "@react-native-community/cameraroll";

import { connect } from 'react-redux';
import ActionCreator from '../../store/actions';

import Ionicons from 'react-native-vector-icons/Ionicons';

class Pictures extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }

  async componentDidMount(){

    const nowTime = new Date()

    const endTime = nowTime.getFullYear()+"-"
                  + (Number(nowTime.getMonth())+1)+"-"
                  + nowTime.getDate()+" "
                  + "T"+nowTime.getHours()+":"
                  + nowTime.getMinutes()+":"
                  + nowTime.getSeconds()

    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Explanation',
          message: 'ReactNativeForYou would like to access your photos!',
        },
      );
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
        return;
      }
    }

    function changeTime(time) {
      const tempTime = time.split(' ')
      const toDate = tempTime[0].split('-')
      const toTime = tempTime[1].split(':')
      return new Date(toDate[0],toDate[1]-1,toDate[2],toTime[0].slice(1),toTime[1],toTime[2]).getTime()
    }

    const tempPictures = []

    const unsortedSet = {
      id: "도로",
      title: "중간중간",
      fromTime: this.props.dayRecs.dr_start_time,
      toTime: endTime,
      data: [{
        id: "미분류",
        list: []
      }]
    }

    for ( var index in this.props.dayRecs.routeRecs) {
      var route = this.props.dayRecs.routeRecs[index]
      var fromTime = route.rr_time
      var toTime = endTime
      if ( index < this.props.dayRecs.routeRecs.length - 1 ) {
        var toTime = this.props.dayRecs.routeRecs[Number(index)+1].rr_time
      } 
      if ( route.rr_name !== null) {
        const pictureSet = {
          id: route.rr_id,
          title: route.rr_name,
          fromTime: fromTime,
          toTime: toTime,
          data: [{
            id: route.rr_name,
            list: []
          }]
        }
        tempPictures.push(pictureSet)
      } else if ( unsortedSet.id === "도로") {
        unsortedSet.id = route.rr_id
      }
    }

    tempPictures.push(unsortedSet)
    await CameraRoll.getPhotos({
      first: 10000,
      assetType: 'Photos',
      include: [
        'location', 'imageSize', 'filename', 'fileSize'
      ],
      fromTime: changeTime(this.props.dayRecs.dr_start_time)+(-1*nowTime.getTimezoneOffset()*60000),
      toTime: changeTime(endTime)
    })
    .then(res => {
      this.props.sendCount(res.edges.length)
      for (let picture of res.edges) {
        // console.log(JSON.stringify(picture.node, null, 2))
        if ( picture.node.image.height > picture.node.image.width ) {
          var height = picture.node.image.height
          var width = picture.node.image.width
        } else {
          var width = picture.node.image.height
          var height = picture.node.image.width
        }
        const pictureForm = {
          id: picture.node.timestamp,
          rr_id: 0,
          timestamp : picture.node.timestamp * 1000, // s 단위로 오는거 ms 단위로 바꿔줘야한다
          location : picture.node.location,
          uri: picture.node.image.uri,
          type: picture.node.type,
          filename: picture.node.image.filename,
          imageSize: {
            height : height,
            width : width
          },
        }
        for ( var tempPicture of tempPictures) {
          if ( pictureForm.timestamp >= changeTime(tempPicture.fromTime)+(-1*nowTime.getTimezoneOffset()*60000) && pictureForm.timestamp <= changeTime(tempPicture.toTime)+(-1*nowTime.getTimezoneOffset()*60000) ) {
            pictureForm.rr_id = tempPicture.id
            tempPicture.data[0].list.unshift(pictureForm)
            break
          } 
        }
      } 
      for ( var tempPicture of tempPictures) {
        this.setState({ ...this.state, data: [ ...this.state.data, tempPicture]})
        // console.log(JSON.stringify(this.state.data,null,2))
      }
    })
    .catch(error => {
      console.log("하루에 대한 사진불러오기 에러", error)
    })
  }

  toLargeScale = (item) => {
    this.props.navigation.navigate("SinglePicture", { picture : item })
  }

  isSelected = (item) => {
    if (this.props.selectedPictures.filter((select) => select.id !== item.id).length !== this.props.selectedPictures.length) {
      return true
    } else {
      return false
    }
  }

  selectPicture = (item) => {
    this.props.select(item)
    // console.log(JSON.stringify(item,null,2))
  }

  unselectPicture = (id) => {
    this.props.unselect(id)
  }

  render(){


    const renderdata = ({ item }) => {

      return (
        <View>
          <TouchableOpacity onPress={() => this.toLargeScale(item)} style={{margin:1}}>
            <Image 
              style={[{ width: (screenWidth-6)/3, height: (screenWidth-6)/3}, 
                this.isSelected(item) ? styles.selectedBorder : '']} 
              source={{ uri: item.uri }} />
          </TouchableOpacity>
          { this.props.mode === "look" ? null :
            <View style={styles.selectContainer}>
              { this.isSelected(item) ?  
                <TouchableOpacity style={styles.selectArea} onPress={() => this.unselectPicture(item.id)}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={screenWidth/12}
                    style={styles.selectIcon1}
                    color={'#FFBE58'}/>
                </TouchableOpacity> :
                <TouchableOpacity style={styles.selectArea} onPress={() => this.selectPicture(item)}>
                  <Ionicons
                    name="ellipse"  
                    size={screenWidth/12}
                    style={styles.selectIcon2}
                    color={'black'}/>
                  <Ionicons
                    name="ellipse-outline"  
                    size={screenWidth/12}
                    style={styles.selectIcon3}
                    color={'black'}/>
                </TouchableOpacity>
              }
            </View>
          } 
        </View> 
      )
    }

    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
  
    return(
      <View style={this.props.selectedPictures.length > 0 ? {height: screenHeight*0.824} : {}}>
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
                ( section.title !== "중간중간" ? <Text> { section.title }에서 찍은 사진 </Text> : <Text> { section.title } 찍은 사진  </Text> ) :
                ( section.title !== "중간중간" ? <Text> { section.title }에서 찍은 사진은 없습니다. </Text> : <Text> { section.title } 찍은 사진은 없습니다. </Text> )
              }
            </View>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  selectContainer: {
    margin: Dimensions.get('window').width/50,
    position: "absolute",
    top: 0,
    right: 0,
    width: Dimensions.get('window').width/6,
    height: Dimensions.get('window').width/6,
  },
  selectArea: {
    height: Dimensions.get('window').width/6,
    width: Dimensions.get('window').width/6,
  },
  selectIcon1: {
    position: 'absolute', 
    right: 0,
  },
  selectIcon2: {
    position: 'absolute', 
    right: 0,
    opacity: 0.4,
  },
  selectIcon3: {
    position: 'absolute', 
    right: 0,
    opacity: 0.5,
  },
  selectedBorder: {
    borderWidth: 6,
    borderColor: '#FFBE58'
  }
});


function mapStateToProps(state) {

  return {
    selectedPictures: state.pictureRd.pictures,
    dayRecs: state.accountRd.todayTravel,
    mode: state.pictureRd.mode,
    
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
    sendCount: (count) => {
      dispatch(ActionCreator.sendTotalPictures(count));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);