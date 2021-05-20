import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class Tou extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  
  render() {
    return (
       <View>
            <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={styles.child}>
                    {
                        this.props.content.map((l,index) => {
                            return (
                                <View key={l}>
                                    <Text style={{ fontSize: 16, paddingBottom: 5 }} >{l}</Text>

                                </View>
                            )
                        })
                    }
                    {
                        this.props.sub_title.map((l,index) => {
                            return (
                                <View key={l}>
                                    <Text style={{ fontSize: 14, paddingBottom: 5 }} >{l}</Text>
                                </View>
                            )
                        })
                    }
                    {
                        this.props.sub_content.map((l,index) => {
                            if (this.props.check === true){
                                return l.map((ll,indexx) => {
                                    return (
                                        <View key={ll}>
                                            <Text style={{ fontSize: 12 }}>{ll}</Text>
                                        </View>
                                    )
                                })
 
                            } else {
                                return (
                                    <View key={l}>
                                        <Text style={{ fontSize: 12 }}>{l}</Text>
                                    </View>
                                )
                            }
                        })
                    }
                </View>
            }
            
       </View>
    )
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    title:{
        fontSize: 14,
        fontWeight:'bold',
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
    },
    parentHr:{
        height:1,
        width:'100%'
    },
    child:{
        padding:16,
    }
    
});