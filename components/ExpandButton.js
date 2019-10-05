import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'


class ExpandButton extends React.Component {

    constructor(props) {
        super(props);
        this.expandPress = this.expandPress.bind(this);
    }

    expandPress = () => {
        this.props.func(this.props.index);
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.text != this.props.text;
    }


    render() {
        return (
            <TouchableOpacity onPress={this.expandPress} style={styles(this.props.text).expand}>
                <Text style={styles(this.props.text).text}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = (text) => StyleSheet.create(
    {

        expand: {


            flex: 0.4,
            paddingBottom: 3,
            paddingLeft: 24,
            paddingRight: 24,

            borderColor: '#000',
            borderWidth: 1.25,
            borderRadius: 5,
            width: '75%',
            backgroundColor: text == 'Expand' ? '#273' : '#932',
            zIndex: 10
        },
        text:
        {
            color: '#fff',
            fontFamily: 'gayathri',
            fontSize: 18,
            textAlign: 'center',
            textAlignVertical: 'center'
        }
    })

export default ExpandButton;

