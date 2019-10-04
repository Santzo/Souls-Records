import React, { useState, setState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { tsImportEqualsDeclaration } from '@babel/types';
const Time = require('../data/TimeCalculator');


class LeaderBoardEntry extends React.Component {

    constructor(props) {
        super(props)
        this.ListUpdate = this.ListUpdate.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.amountToShow != this.props.amountToShow;
    }

    createLeaderBoard() {
        leaderBoard = [];
        for (let [index, value] of this.props.data.entries()) {
            if (index >= this.props.amountToShow) break;
            const { runner, time, date, country, videoLink } = value;
            let bold = false;
            let howLong = Time.DateComparison(date);
            if (typeof howLong === 'number') {
                howLong = howLong > 1 ? `${howLong} days ago` : howLong == 0 ? 'Today' : 'Yesterday';
                bold = true;
            }
            leaderBoard[index] = [
                <TouchableOpacity activeOpacity={0.5} onPress={this.ListUpdate(videoLink)} style={styles.container} key={index}>
                    <Text style={[styles.text, styles.positionText]}>{index + 1}.</Text>
                    {typeof country !== 'undefined' && country !== null && <Image style={styles.flag} source={{ uri: `https://www.countryflags.io/${country}/shiny/64.png` }} />}
                    <Text style={[styles.text, styles.runnerText]}>{runner}</Text>
                    <Text style={[styles.text, styles.timeText]}>{Time.Time(time)}</Text>
                    <Text style={[styles.text, bold && { fontWeight: 'bold' }]}>{howLong}</Text>
                </TouchableOpacity>]
        }
    }

    createRunnerEntry() {
        const { date, category, place, time, video, country } = this.props.data;
        let bold = false;
        let howLong = Time.DateComparison(date);
        if (typeof howLong === 'number') {
            howLong = howLong > 1 ? `${howLong} days ago` : howLong == 0 ? 'Today' : 'Yesterday';
            bold = true;
        }
        leaderBoard = (
            <TouchableOpacity activeOpacity={0.5} onPress={this.ListUpdate(video)} style={styles.container} key={this.props.index}>
                <Text style={[styles.text, styles.userText]}>{category}</Text>
                <Text style={[styles.text, styles.positionText]}>{place}.</Text>
                <Text style={[styles.text, styles.timeText]}>{Time.Time(time)}</Text>
                <Text style={[styles.text, bold && { fontWeight: 'bold' }]}>{howLong}</Text>
            </TouchableOpacity>);
    }

    ListUpdate = (link) => () => {
        console.log (link);
        // if (link !== '') Linking.openURL(link);
        // else Alert.alert('No video', 'No video found for this entry :(');    
    }


    render() {
        if (!this.props.user) {
            this.createLeaderBoard();
        }
        else {
            this.createRunnerEntry();
        }
        return (
            <View style={styles.mainContainer}>
              
                {leaderBoard}
            </View>
        )
    }
}

styles = StyleSheet.create({
    mainContainer:
    {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container:
    {
        flexDirection: 'row',
        width: '100%',
        padding: 5,
        backgroundColor: '#111',
        borderBottomColor: '#333',
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    text:
    {
        fontFamily: 'gayathri',
        color: '#ddd',
        fontSize: 16,
        alignSelf: 'center'
    },
    positionText:
    {
        fontWeight: 'bold',
        width: '10%'
    },

    flag:
    {
        width: 30,
        height: 30,
        marginRight: '2%'
    },
    runnerText:
    {
        width: '37%',
        color: '#fff'
    },
    userText:
    {
        width:'47.5%', 
        backgroundColor:'#1e1e1e',
        color:'#bbb', 
        marginRight:6, 
        fontWeight:'bold', 
        borderRadius:20,
        borderColor:'#000',
        borderWidth:1,
        textAlign: 'center'
    },
    timeText:
    {
        width: '19%',
        fontWeight: 'bold'
    }
})

export default LeaderBoardEntry;