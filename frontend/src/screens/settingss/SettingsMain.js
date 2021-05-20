import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Divider, ListItem, Icon } from 'react-native-elements'


import { connect } from 'react-redux'
import ActionCreator from '../.././store/actions'

import { logout, unlink } from '@react-native-seoul/kakao-login'

import CookieManager from '@react-native-cookies/cookies'

import AsyncStorage from '@react-native-async-storage/async-storage'

const list = [
  {
    title: '프로필 및 계정관리',
    icon: 'person-circle',
    navi: 'SettingsProfile'
  },
  {
    title: '이용약관',
    icon: 'create',
    navi: 'SettingsTou'
  },
  {
    title: '라이선스',
    icon: 'eye',
    navi: 'SettingsLicense'
  },
]


const list2 = [
  {
    title: '위치',
    icon: 'person-circle'
  },
  {
    title: '푸시',
    icon: 'hammer'
  },
  
]


class SettingsMain extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      navi1 : 'SettingsProfile',
      navi2 : 'SettingsTou',
      navi3 : 'SettingsLicense'
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Divider/>
        {
          list.map((item, i) => (
          <ListItem 
            key={i} 
            bottomDivider
            Button
            onPress={()=>this.props.navigation.navigate(item.navi)}
            >
            <Ionicons name={item.icon} size={25} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
            ))
        }
        <ListItem.Accordion
          content={
            <>
            <Ionicons name="hammer" size={25} style={{marginRight:15}} />
            <ListItem.Content>
              <ListItem.Title>서비스 기능 설정</ListItem.Title>
            </ListItem.Content>
            </>
          }
          isExpanded={this.state.expanded}
          onPress={() => {
          this.setState({ ...this.state, expanded: !this.state.expanded });
          // expanded = !expanded
          }}
        >
          {list2.map((l, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                
                <ListItem.Subtitle>{l.title}</ListItem.Subtitle>
              </ListItem.Content>
              {/* <ListItem.Chevron /> */}
            </ListItem>
          ))}
        </ListItem.Accordion>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // justifyContent: 'center',
    // alignItems: 'center'
  }
})

function mapStateToProps(state) {
  return {
    isLogin: state.accountRd.isLogin,
    user_nickname: state.accountRd.user.usr_nickname,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(ActionCreator.logout())
    },
    initialPicture: () => {
      dispatch(ActionCreator.initialPicture())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMain)