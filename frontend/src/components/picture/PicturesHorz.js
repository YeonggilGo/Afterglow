import React from 'react';

import {
  Platform,
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

class PicturesHorz extends React.Component {

  constructor(props, context) {
    super(props, context);
  }


  render(){

    const renderdata = ({ item }) => (
      <TouchableOpacity onPress={() => this.props.unselect(item.id) }>
          <View>
            <Image 
              style={{ width: (screenWidth)/8, height: (screenWidth)/8, marginVertical:14, marginHorizontal:4}} 
              source={{ uri: item.uri }} />
            <View style={styles.selectContainer}>
              <Ionicons 
                name="close-circle" 
                size={screenWidth/20}
                color={'#FFBE58'} />
            </View>
          </View>
      </TouchableOpacity>
    )

    let screenWidth = Dimensions.get('window').width;

    return(
      <View>
        <FlatList
          data={this.props.selectedPictures}
          renderItem={renderdata}
          keyExtractor = {(data) => data.id}
          horizontal
          ref={ref => this.flatList = ref}
          onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
          onLayout={() => this.flatList.scrollToEnd({animated: true})}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  selectContainer: {
    marginTop: Dimensions.get('window').width/80,
    paddingLeft: Dimensions.get('window').width/200,
    position: "absolute",
    top: 0,
    right: 0,
    width: Dimensions.get('window').width/20,
    height: Dimensions.get('window').width/20,
  },
})


function mapStateToProps(state) {
  return {
    selectedPictures: state.pictureRd.pictures
  };
}

function mapDispatchToProps(dispatch) {
  return {
    unselect: (picture_id) => {
      dispatch(ActionCreator.unselectPicture(picture_id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PicturesHorz);