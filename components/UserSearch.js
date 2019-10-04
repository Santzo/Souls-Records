import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Global from '../global';
import { RFValue } from 'react-native-responsive-fontsize';

function UserSearch(props) {
    const [color, setColor] = useState('#000022ee')
    return (
        <TouchableOpacity activeOpacity={1} onPressIn={() => setColor('#661100ef')} onPressOut={() => setColor('#000022ee')} onPress={props.func(props.name)} style={[styles(props).button,{backgroundColor:color}]}>
            <Text style={styles(props).text}>{props.name}</Text>
        </TouchableOpacity>

    )
}

const styles = (param) => StyleSheet.create
    (
        {
            button:{
                width: '90%',
                alignSelf:'center',
                borderWidth: 1.5,
                borderColor: '#555',
                paddingBottom: 12,
                paddingTop: 12,
                zIndex: 100,
                borderRadius: 12,
                borderTopWidth: (param.id == 0) ? 2 : 1,
                position: "absolute",
                top: `${19.5 + param.id * 7.7}%`
            },

            text: {
                color: '#bcd',
                fontFamily: 'gayathri',
                fontSize: RFValue(20),
                textAlign: 'center',
                alignSelf: 'center'
            }
        });
export default UserSearch;
