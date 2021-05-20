import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, StyleSheet } from 'react-native'

import { connect } from 'react-redux'
import ActionCreator from '../store/actions';

import { getRecordPicture } from '../api/picture'



class MainList extends React.Component{

  constructor(props) {
    super(props)
    this.state={
      pics : []
    }
  }

  dateForm(date) {
    try {
      const tempDate = date.split('-')
      return tempDate[0] + '년 ' +tempDate[1] + '월 ' + tempDate[2] + '일 '
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


  toSingleHistory = (index) => {
    this.props.selectIndex(index)
    this.props.navigation.navigate("SingleTravelHistory")
  }

  componentDidMount() {

    for ( var record of this.props.traveledList ) {
      getRecordPicture(
        record.rec_id,
        (res) => {
          // console.log(res.data)
          const tempDate = []
          const tempArr = []
          for ( var day of record.dayRecs) {
            if (tempDate.includes(day.dr_date)) {
              continue
            } else {
              tempDate.push(day.dr_date)
            }
            for ( var pictures of res.data[day.dr_date]) {
              var base64Image = `data:image/jpeg;base64,${pictures.ir_image}`
              tempArr.push(base64Image)
            }
          }
          if (tempArr.length === 0) {
            this.setState({
              ...this.state,
              pics : [ ...this.state.pics, 'no']
            })
          } else {
            var result = tempArr[Math.floor(Math.random() * tempArr.length)]
            this.setState({
              ...this.state,
              pics : [ ...this.state.pics, result ]
            })
          }
        },
        (err) => {
          console.log(err)
        }
      )
    }


  }

  render() {

    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;

    const renderdata = ({ item, index }) => {
      if (item.dayRecs[0].dr_date === null) {
        console.log("아직 여행중인 item", item["@id"])
      }
      else {
        // console.log("아이템:",JSON.stringify(item,null,2))
        const travelName = item.rec_name
        const travelStartDay = item.dayRecs[0].dr_start_time
        const len = (item.dayRecs).length
        const travelEndDay = item.dayRecs[len-1].dr_start_time
        // console.log("item에 대한 로그",JSON.stringify(item.dayRecs[0],null,2))

        return (
          <View>
            <TouchableOpacity style={{ margin: 10}} onPress={() => this.toSingleHistory(index)}>
              { this.state.pics[index] === 'no' ?
                <Image 
                  style={{ width:  (screenWidth-80)/2, height: (screenHeight)/3.5, backgroundColor: "#FFBE58"}} 
                  source={require('../assets/pics/ag_logo.png') }/>   :
                <Image 
                  style={{ width: (screenWidth-80)/2, height: (screenHeight)/3.5, }} 
                  source={{ uri: this.state.pics[index] }}/>
              } 
                <View style={styles.imageTitleContainer}>
                  <Text>{travelName}</Text>
                </View>
                <View style={styles.imageDateContainer}>
                  <Text style={{ fontSize: 15, position: "absolute", bottom: 30, left: 5}}>{this.changeToTimezone(travelStartDay)}~</Text>
                  <Text style={{ fontSize: 15, position: "absolute", bottom: 10, right: 5}}>{this.changeToTimezone(travelEndDay)}</Text>
                </View>
            </TouchableOpacity>
          </View>
        )
      }
    }

    return(
      <FlatList
        style={{ marginHorizontal:20, marginTop: 40 }}
        data={this.props.traveledList}
        numColumns={2}
        renderItem={renderdata}
        keyExtractor={(data) => data.rec_name }
        showsVerticalScrollIndicator={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  imageTitleContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  // imageDateContainer: {
  //   position: 'absolute',
  //   bottom: 10,
  //   marginLeft: 5
  // }
})


function mapStateToProps(state){

  return {
    traveledList: state.accountRd.traveledList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectIndex: (index) => {
      dispatch(ActionCreator.selectIndex(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainList)