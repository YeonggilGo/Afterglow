import React from 'react'

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import ActionCreator from '../store/actions';

import randomColor from 'randomcolor'

class PlaceList extends React.Component {

  constructor(props){
    super(props)
    this.state={
      // pinList:[],
      colorList: [],
    }
  }

  giveToParentPin = async (item) => {
    await this.props.newSelectPinFunc(item)
    // await this.props.selectPin(item)
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.rdPin.rr_id !== prevProps.rdPin.rr_id) {
  //     this.setState({
  //       ...this.state,
  //       pinList: this.props.todayTravel.routeRecs.filter(item => item.rr_name !== null && item.rr_name !== "" )
  //     })
  //   } 
  // }


  async componentDidMount() {
    // console.log("todayTravlelellll;", JSON.stringify(this.props.todayTravel, null, 2))
    // console.log("비지트플레이스", this.props.rdVisitedPlace)
    // await this.setState({
    //   ...this.state,
    //   pinList: this.props.todayTravel.routeRecs.filter(item => item.rr_name !== null && item.rr_name !== "" )
    // })
    // console.log("placelist에서", JSON.stringify(this.state.pinList,null,2))

    const color = await randomColor({
      count: 20,
      luminosity: 'light',
      hue: 'blue'
    })

    await this.setState({
      ...this.state,
      colorList: color,
    })
  }

  getPlace() {
    return this.props.todayTravel.routeRecs.filter( (item) => item.rr_name !== null && item.rr_name !== "")
  }

  render() {

    const renderdata = ({item, index}) => {

      return (
        <TouchableOpacity
            onPress={ () => {
              this.props.newSelectPinFunc(item)
              // this.props.giveToParentPin(item)
              // this.props.selectPin(item)
              // this.props.getCurrentInfo(this.props.dr_id)
            }}
              
            style={[styles.itemContainer, {backgroundColor: this.state.colorList[index] }]}
            // disabled={ this.props.rdPin.rr_id === item.rr_id ? true:false}
          >
          <Text>{ item.rr_name }</Text>
        </TouchableOpacity>
        )
    }

    return (

      <View style={styles.container}>
        <FlatList
          // data={this.state.pinList}
          // data={this.props.rdVisitedPlace}
          data={this.getPlace()}
          renderItem={renderdata}
          keyExtractor = {(data) => data.rr_id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

    )
  }
}

const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width


const styles= StyleSheet.create({
  container: {
  },
  itemContainer: {
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation : 2,
  }
})



function mapStateToProps(state){
  return {
    todayTravel: state.accountRd.todayTravel,
    rdPin : state.accountRd.selectedPin,
    rdVisitedPlace : state.accountRd.visitedPlace,
    dr_id: state.accountRd.todayTravel.dr_id
  }
}

function mapDispatchToProps(dispatch) {
  return {
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



export default connect(mapStateToProps, mapDispatchToProps)(PlaceList)