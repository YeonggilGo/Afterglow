import React, { useRef } from "react";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { connect } from 'react-redux'
import ActionCreator from '../../store/actions'

const INITIAL_REGION = {
  latitude: 35.43463069429124, 
  longitude: 127.75646977566188,
  latitudeDelta: 6.3,
  longitudeDelta: 1,
};

class Maps_cluster extends React.Component {

  constructor(props){
    super(props)
  }


  toSingleHistory = (index) => {
    this.props.selectIndex(index)
    this.props.navigation.navigate("SingleTravelHistory")
  }

  render() {
    return (
      <MapView
        initialRegion={INITIAL_REGION}
        style={{ flex:1 }}
        zoomControlEnabled
      >
        {
          this.props.traveledList.map((travelItem, index) => {
            // console.log("도대체왜", JSON.stringify(travelItem,null,2))
            if ( travelItem.dayRecs[0].routeRecs.length === 0 || travelItem.dayRecs[0].routeRecs[0].rr_latitude === undefined) {
              return null
            } else {
              return (
                <Marker
                  coordinate={{
                    latitude: travelItem.dayRecs[0].routeRecs[0].rr_latitude, 
                    longitude: travelItem.dayRecs[0].routeRecs[0].rr_longitude
                    }}
                  onPress={() => this.toSingleHistory(index) }
                  key={index}
                >
  
                </Marker>
              )
            }
          })
        }

      </MapView>
    )
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Maps_cluster);