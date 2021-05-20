import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet, FlatList } from 'react-native'

import { connect } from 'react-redux'

import ActionCreator from '../../store/actions'

import randomColor from 'randomcolor'

import { getRoutePicture } from '../../api/picture'

import { Card, ListItem,  Icon, Divider } from 'react-native-elements'



class Diary extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      pages: []
    }
  }

  async componentDidMount() {

    for ( var day of this.props.record.dayRecs) {
      for ( var route of day.routeRecs ) {
        if ( route.rr_name !== null) {          //여기 나중에 이미지 없으면 포함 안하는 route.imgRecs.length !== 0 추가
          const color = await randomColor({
            count: 1,
            luminosity: 'light',
            hue: 'blue'
          })
          var base64Image = ''
          await getRoutePicture(
            route.rr_id,
            (res) => {
              // 이미지중 랜덤으로 하나 선택
              var imageArr = []
              if ( res.data.length !== 0) {
                for ( var data of res.data) {
                  // console.log(data)
                  var tempImage = `data:image/jpeg;base64,${data.ir_image}`
                  imageArr.push(tempImage)
                }
                base64Image = imageArr[Math.floor(Math.random() * imageArr.length)]
              } else {
                base64Image = "no"
              }
            },
            (err) => {
              console.log(err)
            }
          )
          const pageForm = {
            "id": route.rr_id,
            "name": route.rr_name,
            "memo": route.rr_memo,
            "time": route.rr_time,
            "color": color[0],
            "uri": base64Image
          }
          await this.setState({
            ...this.state,
            pages: [ ...this.state.pages, pageForm ]
          })
        }

      }
    }
    if (this.state.pages.length === 0) {
      const pageForm = {
        "id": 1,
        "name": "없어요",
        "memo": "이번 여행에 방문한 장소가 없어요...",
        "time": "없어요",
        "color": '#FFBE58',
        "uri": 'no'
      }
      await this.setState({
        ...this.state,
        pages: [ ...this.state.pages, pageForm ]
      })
    }
  }

  dateForm(date) {
    try {
      const tempDate = date[0].split('-')
      const tempTime = date[1].split(':')
      return tempDate[0] + '년 ' + tempDate[1] + '월 ' + tempDate[2] + '일 '
           + tempTime[0] + '시 ' + tempTime[1] + '분 ' 
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
    return this.dateForm(changedDate)
  }


  render() {

    const onScroll = (e) => {
      const newPage = Math.round(
        e.nativeEvent.contentOffset.x / (pageWidth + gap),
      );
      this.setState({ ...this.state, page: newPage});
    };

    const screenHeight = Dimensions.get('screen').height
    const screenWidth = Dimensions.get('screen').width
    

    const renderdata = ({item}) => {
      return (
        <View 
          style={{ 
            backgroundColor: item.color, 
            width: pageWidth, 
            marginHorizontal: gap/2, 
            marginVertical: 20,
            borderRadius: 15,
            alignItems: "center",
          }}
        >
          { item.uri === "no" ?
          <Image 
          style={{ width: pageWidth-40, height: screenHeight/2.2, }} 
          source={require('../../assets/pics/ag_logo.png') }/>          
          :
          <Image 
          style={{ width: pageWidth-40, height: screenHeight/2.2, marginTop: 20, borderRadius: 15 }} 
          source={{ uri: item.uri }}/>
          }
          { item.time === "없어요" ?
            null :
            <Text style={{height: screenHeight/17, textAlignVertical:"center"}}> {this.changeToTimezone(item.time)} </Text>
          }
          <Text style={{height: screenHeight/17, textAlignVertical:"center"}}> {item.name} </Text>
          { item.memo === null ? 
            <Text style={{height: screenHeight/10, marginHorizontal: 5 ,textAlignVertical:"center"}}>
              {item.name}에 여운을 남기고 왔다. 
            </Text> : 
            <Text style={{height: screenHeight/10, marginHorizontal: 5, textAlignVertical:"center"}}> {item.memo} </Text>
          }
        </View>
      )
    }

    const gap = 16
    const offset = 36
    const pageWidth = Dimensions.get('screen').width - (gap + offset) * 2

    return(
      <View style={styles.container}>
        <FlatList 
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={{
              paddingHorizontal: offset + gap / 2,
          }}
          data={this.state.pages}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item) => item.id }
          renderItem={renderdata}
          onScroll={onScroll}
          pagingEnabled
          snapToInterval={pageWidth + gap}
          snapToAlignment="start"
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.indicatorContainer}>
          {Array.from(this.state.pages).map((page,i) => (
            <View style={[styles.indicator, i === this.state.page ? {backgroundColor: 'black'} : {backgroundColor: 'grey'}]} key={i}/>
          ))}
        </View>
      </View>
    )

  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    paddingBottom: 30,
  },
  indicator: {
    marginHorizontal: 4,
    width: 6,
    height: 6,
    borderRadius: 3
  }
})

function mapStateToProps(state) {

  return {
    record: state.accountRd.traveledList[state.accountRd.historyIndex]
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

export default connect(mapStateToProps, mapDispatchToProps)(Diary);