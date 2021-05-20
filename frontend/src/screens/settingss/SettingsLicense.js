import React , { Component } from 'react';
import { FlatList } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Card, ListItem,  Icon } from 'react-native-elements'


export default class SettingsLicense extends Component {
    constructor(props) {
        super(props)
        this.state = {
            DATA : [

                {
                    id: 1,
                    title: 'react-native',
                    version: 0.64,
                    url: 'https://reactnative.dev/',
                    copyright: 'Copyright (c) Facebook, Inc. and its affiliates.',
                },
                {
                    id: 2,
                    title: 'react-native-cli',
                    version: 2.01,
                    url: 'https://reactnative.dev/',
                    copyright: 'Copyright (c) Facebook, Inc. and its affiliates.',
                },
                {
                    id: 3,
                    title: 'react-redux',
                    version: '7.2.4',
                    url: 'https://react-redux.js.org/',
                    copyright: 'Copyright (c) 2015-present Dan Abramov and the Redux documentation authors.',
                },
                {
                    id: 4,
                    title: 'react-native-elements',
                    version: "3.4.1",
                    url: 'https://reactnativeelements.com/',
                    copyright: 'Copyright (c) 2016 Nader Dabit',
                },
                {
                    id: 5,
                    title: 'react-native-vector-icons',
                    version: '8.1.0',
                    url: 'https://github.com/oblador/react-native-vector-icons',
                    copyright: 'Any bundled fonts are copyright to their respective authors and mostly under MIT or SIL OFL.',
                },
                {
                    id:6,
                    title: 'react-native-maps',
                    version: '0.28.0',
                    url: 'https://github.com/react-native-maps/react-native-maps',
                    copyright: 'Copyright (c) 2015 Airbnb',
                },
                {
                    id:7,
                    title: 'react-native-map-clustering',
                    version: '3.4.2',
                    url: 'https://github.com/venits/react-native-map-clustering',
                    copyright: 'Copyright in venits https://github.com/venits',
                },
                {
                    id:8,
                    title: '@react-native-community/cameraroll',
                    version: '4.0.4',
                    url: 'https://github.com/react-native-cameraroll/react-native-cameraroll',
                    copyright: 'Copyright (c) 2015-present, Facebook, Inc.',
                },
                {
                    id:9,
                    title: '@react-native-cookies/cookies',
                    version: '6.0.7',
                    url: 'https://github.com/react-native-cookies/cookies',
                    copyright: 'Copyright (c) 2020 React Native Community',
                },
                {
                    id:10,
                    title: '@react-native-seoul/kakao-login',
                    version: '3.3.2',
                    url: 'https://github.com/react-native-seoul/react-native-kakao-login',
                    copyright: 'Copyright (c) 2018 dooboolab',
                },
                {
                    id:11,
                    title: '@react-navigation/native',
                    version: '5.9.4',
                    url: 'https://github.com/react-navigation/react-navigation',
                    copyright: 'Copyright (c) 2017 React Navigation Contributors',
                },
                {
                    id:12,
                    title: 'react-native-reanimated',
                    version: '2.1.0',
                    url: 'https://github.com/software-mansion/react-native-reanimated/',
                    copyright: 'Copyright (c) 2016 Krzysztof Magiera',
                },
                {
                    id:13,
                    title: 'react-native-geolocation-service',
                    version: '5.3.0-beta.1',
                    url: 'https://github.com/Agontuk/react-native-geolocation-service',
                    copyright: 'Copyright (c) 2018 Iftekhar Rifat',
                },
                {
                    id:14,
                    title: '@voximplant/react-native-foreground-service',
                    version: '2.0.0',
                    url: 'https://github.com/voximplant/react-native-foreground-service',
                    copyright: 'Copyright (c) 2019 Zingaya, Inc',
                }
            ]
        }
    }
    renderItem = ({ item }) => {
        return (
            <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.version}</Text>
                <Text style={{ color:'blue' }} onPress={() => Linking.openURL(item.url)}>{item.url}</Text>
                <Text>{item.copyright}</Text>
            </View>
        )
    }

    render () {

        return (

            <View>
                <FlatList
                    data={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id}
                >

                </FlatList>
            </View>

        )
    }


}