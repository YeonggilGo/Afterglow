import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import ActionCreator from '../../store/actions';

class SinglePicture extends React.Component {

  constructor(props) {
    super(props)
  }
  
  render() {
    
    const {picture} = this.props.route.params
    console.log(picture.imageSize.width, picture.imageSize.height )
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;

    const tempScale1 = picture.imageSize.width/screenWidth
    const tempScale2 = picture.imageSize.height/screenHeight

    const scale = tempScale1 >= tempScale2 ? tempScale1 : tempScale2

    if ( this.props.mode === "look" ) {
      return (
        <View style={styles.container}>
          <Image 
            style={{ width: picture.imageSize.width/scale , height: picture.imageSize.height/scale }} 
            source={{ uri: picture.uri }} />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Image 
            style={{ width: picture.imageSize.width/scale , height: picture.imageSize.height/scale }} 
            source={{ uri: picture.uri }} />
          <View style={styles.selectContainer}>
            { this.props.selectedPictures.filter((select) => select.id !== picture.id).length !== this.props.selectedPictures.length ?  
              <Ionicons 
                name="checkmark-circle" 
                size={screenWidth/8}
                color={'pink'}
                onPress={() => this.props.unselect(picture.id)}/> :
              <Ionicons
                name="ellipse-outline"  
                size={screenWidth/8}
                color={'grey'}
                onPress={() => this.props.select(picture)}/>
            }
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  selectContainer: {
    margin: Dimensions.get('window').width/40,
    position: "absolute",
    top: 0,
    right: 0,
    width: Dimensions.get('window').width/8,
    height: Dimensions.get('window').width/8,
  },
})


function mapStateToProps(state) {
  return {
    selectedPictures: state.pictureRd.pictures,
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

export default connect(mapStateToProps, mapDispatchToProps)(SinglePicture);