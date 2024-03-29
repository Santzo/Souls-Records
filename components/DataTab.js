import React, { useState} from 'react'
import Games from '../data/Games';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from 'react-native'
import LeaderBoardEntry from './LeadeBoardEntry';
import ExpandButton from './ExpandButton';
import Global from '../global'



let runsLength = [];
function DataTab(props) {
    const [aruns, setaRuns] = useState([]);
    const [eText, seteText] = useState([]);
    const [loading, setLoading] = useState(false);

    const showRuns = props.data.isLoaded ? props.data.categories.map(dat => { return dat.leaderboard.length > 3 ? 3 : dat.leaderboard.length }) : [];

    const expand = async (param) => {
        setLoading(true);
        doStuff(param);

    }


    function doStuff(param) {
        setTimeout(() => {
            const temp = [...aruns];
            const tempText = [...eText];
            temp[param] = aruns[param] == 3 ? props.data.categories[param].leaderboard.length : 3;
            tempText[param] = eText[param] === 'Expand' ? 'Collapse' : 'Expand';
            setaRuns(temp);
            seteText(tempText);
            setLoading(false);
        }, 10)
    }

    if (showRuns.length > 0 && aruns.length == 0) {
        setaRuns(showRuns);
        seteText(showRuns.map(a => { return 'Expand' }));
    }


    // Datatab for each game

    if (!props.user) {
        const runs = props.data.isLoaded ? props.data.categories.map((cat, index) => {
            return (
                <View key={index} style={styles(props).scrollContainer}>
                    <View style={styles(props).categoryContainer}>
                        <Text style={styles(cat.name).categoryText}>{cat.name}</Text>
                        <ExpandButton func={expand} index={index} text={eText[index]} />
                    </View>
                    <LeaderBoardEntry func={expand} user={props.user} index={index} data={cat.leaderboard} amountToShow={aruns[index]} />
                </View>
            )
        }) : [];

        runsLength[props.index] = typeof runs !== 'undefined' ? runs.length : 0;
        return (

            <View style={styles(props).mainContainer}>

                {loading && <View style={styles(props).loadingCircle}><ActivityIndicator size={60} color="#9f8" /></View>}
                {!props.data.isLoaded && <View style={styles(props).mainCircle}><ActivityIndicator size={80} color="#abf" /></View>}
                <ScrollView onScrollBeginDrag={props.hori(false)} onScrollEndDrag={props.hori(true)} keyboardShouldPersistTaps='always' showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles(props).scrollContainer}>
                    {runs}
                </ScrollView>
            </View>
        )

    }

    // Datatab for users
    else {
        let runs = Games.map((game, index) => {
            const runsOfTheGame = [];
            for (runnerGame of props.data.games) {
                if (game.name === runnerGame.name) {
                    runsOfTheGame.push(<LeaderBoardEntry runner={props.data.runner} key={runnerGame.name + runnerGame.category} user={props.user} index={index} data={runnerGame} />)
                }
            }
            return (
                runsOfTheGame.length > 0 ?
                    <View key={index} style={styles(props).scrollContainer}>
                        <View style={styles(props).categoryContainer}>
                            <Text style={[styles(game.name).categoryText, { paddingBottom: 1.75 }]}>{game.name}</Text>
                        </View>
                        {runsOfTheGame}
                    </View>
                    : []
            );

        }
        );
        return (
            <View style={styles(props).mainContainer}>
                {props.user && props.data.country !== 'undefined' && props.data.country !== null && <Image resizeMode='stretch' style={styles(Global).flag} source={{ uri: `https://www.countryflags.io/${props.data.country}/flat/64.png` }} />}
                <TouchableOpacity onPress={props.closeTab(props.index)} style={styles(props).closeTab}><Text style={styles(props).text}>Close this tab</Text></TouchableOpacity>
                <ScrollView onScrollBeginDrag={props.hori(false)} onScrollEndDrag={props.hori(true)} keyboardShouldPersistTaps='always' decelerationRate='fast' showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles(props).scrollContainer}>
                    {runs}
                </ScrollView>
            </View>
        )
    }

};


function arePropsEqual(prevProps, nextProps) {
    if (!prevProps.user) {
        return runsLength[nextProps.index] === nextProps.data.categories.length;
    }

    if (prevProps.user && nextProps.user)
        return prevProps.data === nextProps.data;
}


const styles = (param) => StyleSheet.create
    ({
        flag:
        {
            position: 'absolute',
            top: -51,
            left: '13%',
            width: 58,
            height: 58,
            zIndex: 200
        },
        mainContainer: {
            width: '100%',
            height: '100%',
            flex: 1,
            justifyContent: 'flex-start',
            zIndex: 5,
        },

        scrollContainer: {
            width: '99.5%',
            alignItems: 'center'
        },

        categoryContainer: {
            flexDirection: 'row',
            margin: 10,
            marginTop: 5,
            marginBottom: 8,
            width: '100%',
            backgroundColor: '#113',
            borderColor: '#bab',
            borderWidth: 1.75,
            borderRadius: 10,
            padding: 5
        },

        text: {
            color: '#fff',
            fontFamily: 'gayathri',
            fontSize: 16,
            fontWeight: 'bold',
            textAlignVertical: 'center',
            textAlign: 'center'
        },

        categoryText: {
            color: '#fff',
            fontFamily: 'gayathri',
            fontSize: param.length < 23 ? 18 : 15,
            flex: 0.8,
            fontWeight: 'bold',
            textAlignVertical: 'center',
            textAlign: 'left',
        },
        closeTab:
        {
            backgroundColor: '#710',
            width: '75%',
            alignSelf: 'center',
            borderColor: '#bab',
            borderWidth: 1.75,
            padding: 3,
            marginTop: 7,
            marginBottom: 7,
            borderRadius: 10,
        },


        horizontalLine: {
            borderTopColor: '#000',
            borderTopWidth: 2,
            borderBottomColor: '#abf',
            borderBottomWidth: 5,
            borderRadius: 10,
            width: '90%',
            marginBottom: 3,
            alignSelf: 'center'

        },
        loadingCircle:
        {
            position: "absolute",
            top: '40%',
            left: 0,
            right: 0,
            zIndex: 20
        },
        mainCircle:
        {
            position: 'absolute',
            top: !param.isLoaded ? '40%' : '20%',
            bottom: 0,
            left: 0,
            right: 0,

            zIndex: 20
        }
    })


export default React.memo(DataTab, arePropsEqual);