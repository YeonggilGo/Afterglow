import React , { Component } from 'react';
import { Linking } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, ListItem,  Icon } from 'react-native-elements'
import MapView, { Marker } from 'react-native-maps'
import Ionicons from 'react-native-vector-icons/Ionicons';



export default class SettingsContact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title : [
                '도움이 필요하신가요?'
            ],
            tel : [
                '1588-1234'
            ],
            mail : [
                'ssafy@ssafy.com'
            ],
            contact : [
                '서울특별시 강남구 테헤란로 212'
            ],
            url : [
                37.50133303659527, 127.03955444046419
            ]
        }
    }

    render () {

        return (

            <View style={{ flex:3, paddingHorizontal: 15, paddingVertical: 15 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 20 }}>{this.state.title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name='call' size={20} />
                    <Text style={{ color: 'blue', fontSize: 20, paddingLeft: 10 }} onPress={() => {Linking.openURL('tel:1588-1234')}}>{this.state.tel}</Text>
                    <Text>
                        
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name='mail' size={20} />
                    <Text style={{ color: 'green', fontSize: 20, paddingLeft: 10 }} onPress={() => {Linking.openURL(`mailto:a105study1@gmail.com`)}}>{this.state.mail}</Text>
                    
                </View>
                <Text>{this.state.contact}</Text>
                <MapView
                    initialRegion={{
                        latitude: this.state.url[0],
                        longitude: this.state.url[1],
                        latitudeDelta: 0.007,
                        longitudeDelta: 0.005

                    }}
                    style={{ flex:1 }}
                >
                    <Marker coordinate={{ latitude:this.state.url[0], longitude:this.state.url[1] }} title={'싸피건물'}></Marker>

                </MapView>

            </View>

        )
    }


}