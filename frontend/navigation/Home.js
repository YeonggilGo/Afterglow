import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { Header } from 'react-native-elements'

import Ionicons from 'react-native-vector-icons/Ionicons';

class Home extends React.Component {

  openDrawer = () => {
    console.log("drawer")
  }


  startTravel = () => {
    console.log("여기")
    this.props.navigation.navigate('Travel')
  }

  toImgs = () => {
    console.log('이미지')
    this.props.navigation.navigate('ToImgs')
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Header
          leftComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
          rightComponent={{ icon: 'menu', color: '#fff' }}
        /> */}
        <Text>
          지도가 보여지는 홈화면
        </Text>
        <Button title={"여행하기"} onPress={this.startTravel}/>
        <Button title={"이미지 배열"} onPress={this.toImgs}/>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Home;