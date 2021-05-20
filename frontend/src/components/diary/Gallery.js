import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'

import { connect } from 'react-redux'

import ActionCreator from '../../store/actions'

import PicturesFromDB from '.././picture/PicturesFromDB'


class Gallery extends React.Component {



  render() {

    return(
      <View style={styles.container}>
        <PicturesFromDB navigation={this.props.navigation}/>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

function mapStateToProps(state) {

  return {
    selectedPictures: state.pictureRd.pictures,
    startTime: state.accountRd.todayTravel.dr_start_time,
    mode: state.pictureRd.mode
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

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);