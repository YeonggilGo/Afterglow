import React from 'react'

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

import { connect } from 'react-redux'
import ActionCreator from '../store/actions';



class RecPlaceList extends React.Component {

  constructor(props){
    super(props)
  }



  render() {

    const renderdata = ({item}) => {

      return (
        <TouchableOpacity onPress={() => console.log(item.td_name)}>
          <View style={styles.itemContainer}>
            <Text>{ item.td_name }</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (

      <View style={styles.container}>
        <FlatList
          data={this.props.recoPlace}
          renderItem={renderdata}
          keyExtractor = {(data) => data.td_id}
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
    backgroundColor: '#FFBE58',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
  }
})



function mapStateToProps(state){
  return {
    recoPlace : state.accountRd.recoPlace,
  }
}

// function mapDispatchToProps(dispatch) {
//   return {
//     selectPin: (pinData) => {
//       dispatch(ActionCreator.selectPin(pinData))
//     },
//     getCurrentInfo: (dr_id)=>{
//       dispatch({
//         type: "GET_CURRENT_INFO_ASYNC",
//         payload: dr_id
//       })
//     },
//   };
// }



export default connect(mapStateToProps)(RecPlaceList)
