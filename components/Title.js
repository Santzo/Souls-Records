import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto'



const textInput = React.createRef();


function Title(props) {

    const [search, setSearch] = useState('');
    const [orientation, setOrientation] = useState(window.isPortrait());


    if (props.userLoading && search !== '') 
    {
        setSearch('');
        textInput.current.blur();
    }
    useEffect(() => {

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setSearch(""), props.func(""), textInput.current.blur() });
        const portraitListener = Dimensions.addEventListener('change', () => { setOrientation(window.isPortrait()) });

        return () => {
            keyboardDidHideListener.remove();
            portraitListener.remove();
        }
    }, []);

    return (
        <LinearGradient style={styles(orientation).title} colors={['#335', '#113']}>

            <View style={styles(orientation).mainContainer}>

                <View style={styles(orientation).firstContainer}>
                    {/* <Image resizeMode='contain' source={require('../images/speedsouls.png')} style={styles.flame} /> */}
                    <Text adjustsFontSizeToFit={true} style={styles(orientation).titleText}>Souls Records</Text>
                </View>

                <View style={styles(orientation).secondContainer}>
                    <Fontisto style={{ flex: 0, padding: 8 }} name="search" size={30} color="#ddd" />
                    <TextInput
                        ref={textInput}
                        underlineColorAndroid={'transparent'}
                        placeholder="Search for an user"
                        placeholderTextColor="#888888"
                        style={styles(orientation).searchBar}
                        onChangeText={e => {
                            setSearch(e);
                            props.func(e, setSearch);
                        }}
                        value={search}
                        round={true} />
                </View>
            </View>

        </LinearGradient>
    )
}




const styles = (ori) => StyleSheet.create(
    {
        searchResults:
        {
            flex: 0.1,
            flexDirection: 'column',
            zIndex: 100,
        },
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'center',
            marginBottom: 10
        },
        firstContainer: {
            flex: 0.4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15
        },
        secondContainer: {

            flex: ori ? 0.6 : 0.75,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#111111',
            borderRadius: 15,
            borderColor: '#bab',
            borderWidth: 0.75,
            borderRadius: 10,
        },
        title: {
            width: '100%',
            height: ori ? '19.5%' : '32.5%',
            borderColor: '#bab',
            borderWidth: 1.75,
            borderRadius: 10,
            zIndex: 100
        },
        titleText: {
            color: '#eeeeee',
            fontFamily: 'squada',
            fontSize: 42,
            flex: 1,
            textShadowColor: '#000000',
            textAlign: 'center',
            textShadowOffset: { width: 3, height: 3 },
            textShadowRadius: 8
        },
        searchBar: {

            color: '#fff',
            fontFamily: 'gayathri',
            fontSize: 18,
            textAlign: 'left',
            textAlignVertical: 'center',
            flex: 0.9


        },


        settingsButton:
        {
            flex: 0.18

        },

        flame: {
            flex: 0.2
        },


        searchButton:
        {
            backgroundColor: '#22222255',
            padding: 10,
            width: 50,
            height: 50
        }

    }
)

export default Title;