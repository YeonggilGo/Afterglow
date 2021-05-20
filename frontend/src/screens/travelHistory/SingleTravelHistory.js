import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Diary from '../.././components/diary/Diary'
import Summary from '../.././components/diary/Summary'
import Gallery from '../.././components/diary/Gallery'

export default class SingleTravelHistory extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      page : 0,
      content: [],
    }
  }

  componentDidMount() {
    const content = [
      <Summary navigation={this.props.navigation}/>,
      <Diary navigation={this.props.navigation}/>,
      <Gallery navigation={this.props.navigation}/>,
    ]
    this.setState({
      ...this.state,
      content: content
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.content[this.state.page]}
        {/* <View style={styles.btnContainer}> */}
          <TouchableOpacity style={this.state.page == 0 ? {display : 'none'}: styles.backBtn}
            onPress={() => this.setState({...this.state, page: this.state.page - 1})}>
            <Text style={{ color: 'grey'}}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.state.page == 2 ? {display : 'none'}: styles.nextBtn}
            onPress={() => this.setState({...this.state, page: this.state.page + 1})}>
            <Text style={{ color: 'skyblue' }}>다음</Text>
          </TouchableOpacity>
        {/* </View> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  btnContainer: {
    flexDirection: 'row',
    paddingVertical: 30,
  },
  backBtn: {
    // backgroundColor: 'grey',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    position: 'absolute',
    left: 15,
    bottom: 10,
  },
  nextBtn: {
    // backgroundColor: 'skyblue',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    position: 'absolute',
    right: 15,
    bottom: 10,
  },

})
