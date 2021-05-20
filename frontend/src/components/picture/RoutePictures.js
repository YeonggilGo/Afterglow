import React from 'react';

import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import ActionCreator from '../../store/actions';

import Ionicons from 'react-native-vector-icons/Ionicons';

class RoutePictures extends React.Component {

  constructor(props) {
    super(props);
  }

  toLargeScale = (item) => {
    console.log(item)
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
      <View style={this.props.selectedPictures.length > 0 ? {height: screenHeight*0.825} : {}}>
        <FlatList
          data={this.props.data}
          numColumns={3}
          renderItem={renderdata}
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoutePictures);