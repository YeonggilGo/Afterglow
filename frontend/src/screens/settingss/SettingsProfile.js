import React , { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, ListItem,  Icon } from 'react-native-elements'

import Ionicons from 'react-native-vector-icons/Ionicons';


import { connect } from 'react-redux'
import ActionCreator from '../.././store/actions'

import { logout, unlink } from '@react-native-seoul/kakao-login'

import CookieManager from '@react-native-cookies/cookies'

import AsyncStorage from '@react-native-async-storage/async-storage'


class SettingsProfile extends Component {

    constructor(props) {
        super(props)
    }

    signOutWithKakao = async () => {
        await logout()
        .then(res => {
          console.log(res)
          this.props.logout()
          this.props.initialPicture()
          AsyncStorage.clear()
          CookieManager.clearAll().then((success) => { console.log("cookie clear ", success)})
          this.props.navigation.navigate("Login")
        }) .catch(err => 
          console.log(err)
        )
    
      };


    render () {

        return (

            <View>
                <Card containerStyle={{marginHorizontal:0}}>
                    <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 20, flexDirection: 'row' }} onPress={() => this.signOutWithKakao()}>
                        <Ionicons name={'log-out-sharp'} style={{ paddingRight: 20 }} size={18} color={"#555555"}></Ionicons>
                        <Text style={{ fontSize: 15 }}>로그아웃</Text>
                    </TouchableOpacity>
                </Card>
            </View>

        )
    }


}



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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsProfile)