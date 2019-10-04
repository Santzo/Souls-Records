import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'


class Arrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { page: 0, orientation: window.isPortrait()}
        
    }
    AnimatedIcon = Animated.createAnimatedComponent(Entypo)
  
    anim = () => Animated.sequence([
        Animated.timing(this.opacity, { toValue: 0.1, duration: 700}),
        Animated.timing(this.opacity, { toValue: 1, duration: 700})
    ]).start(() => this.anim());

    componentDidMount() {
        this.opacity = new Animated.Value(1);
        portraitListener = Dimensions.addEventListener('change', () => {this.setState({orientation: window.isPortrait()}) });
        this.anim()
    }

    componentDidUnMount() {
        this.portraitListener.remove();
    }

    changePage = (page) => {
        _page = Math.round(page);
        this.setState({page: _page});
    }

    render() {
        return (

            <View style={styles().position}>
                {this.state.page > 0 && <this.AnimatedIcon name="arrow-left" size={32} color='#fff' style={[styles(this.state.orientation).arrowLeft, {opacity:this.opacity} ]}/>}
                {this.state.page < this.props.length - 1 && <this.AnimatedIcon name="arrow-right" size={32} color='#fff'  style={[styles(this.state.orientation).arrowRight, {opacity:this.opacity}]} />}
            </View>
        )
    }
}


const styles = (ori) => StyleSheet.create(
    {
        position: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        arrowLeft: {
            top: ori ? '21.25%' : '35.75%',
            bottom: 0,
            left: '2.5%',
            position: 'absolute',
            zIndex: 30
        },
        arrowRight: {
            top: ori ? '21.25%' : '35.75%',
            bottom: 0,
            right: '2.5%',
            position: 'absolute',
            zIndex: 30
        }
    })

export default Arrow;