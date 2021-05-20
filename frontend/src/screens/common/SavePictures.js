import React from 'react';
import {
  View,
} from 'react-native';

import Pictures from '../../components/picture/Pictures'
import PicturesHorz from '../../components/picture/PicturesHorz'

export default class SavePictures extends React.Component {

  render() {
    return (
      <View>
        <PicturesHorz />
        <Pictures navigation={this.props.navigation}/>
      </View>
    )
  }
}

