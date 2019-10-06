import React, { Fragment } from 'react';
import Title from './components/Title';
import RunData from './data/GetRunData';
import GetRunnerData from './data/GetRunnerData';
import Games from './data/Games';
import DataTab from './components/DataTab';
import Arrow from './components/Arrow';
import userNames from './data/userNames';
import UserSearch from './components/UserSearch';
import SplashScreen from 'react-native-splash-screen';
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: Games,
      userData: [],
      userLoading: false,
      orientation: window.isPortrait(),
      dataLoaded: false,
      scrollingTopX: 0,
      tabLength: 0,
      showUsers: []
    }
    this.updateGames = this.updateGames.bind(this);
    this.state.tabLength = this.state.data.length;
    this.scrollRef = React.createRef();
    this.horizontal = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
  }


  componentDidMount() {
    SplashScreen.hide();
    RunData(this);

  }

  updateGames() {
    this.setState({ data: Games, dataLoaded: true });
  }

  updateTabs(scroll) {
    setTimeout(() => { this.setState({ tabLength: this.state.data.length + this.state.userData.length, userLoading: false }) }, 10);
    if (scroll) setTimeout(() => { this.horizontal.current.scrollToEnd({ options: { animated: true, duration: 600 } }); }, 40);
  }

  closeUserTab = index => () => {
    this.setState(prevState => { userData: prevState.userData.splice(index, 1) });
    const scroll = index + 1 === this.state.userData.length;
    this.updateTabs(scroll, index);
  }

  getUserData = data => async () => {

    for (_data of this.state.userData) {
      if (_data.runner === data) {
        return;
      }
    }
    this.setState({ userLoading: true });
    this.searchUser("");
    const response = await GetRunnerData(data);

    if (response === null) {
      Alert.alert('User not found', 'This user was not found in the Speedrun.com database. This is most likely because this user hasn\'t registered to the site.')
      this.setState({ userLoading: false });
    }


    else {

      if (this.state.userData.length < 10) {
        this.setState(prevState => { userData: prevState.userData.push(response) });
      }
      else {
        let tempState = [...this.state.userData];
        tempState[9] = response;
        this.setState(prevState => { userData: prevState.userData = tempState });
      }
      this.updateTabs(true);

    }
  }

  searchUser = text => {
    const search = text.toLowerCase();
    let breakPoint = 0;
    let users = [];
    if (search != '') {
      for (let i = 0; i < userNames.length; i++) {
        if (userNames[i].toLowerCase().includes(search)) {
          users.push(userNames[i])
          breakPoint += 1;
        }
        if (breakPoint > 4)
          break;
      }
    }
    const newUsers = (search != '' ? users.map((user, index) => { return <UserSearch func={this.getUserData} id={index} key={index} name={user} /> }) : []);
    this.setState({ showUsers: newUsers })

  }


  handleScroll = (event) => {
    const page = event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width;
    this.scrollRef.current.changePage(page);

  }

  horizontalToggle = enabled => () => {
    console.log(enabled);
    const { current: list } = this.horizontal;
    list.setNativeProps({ scrollEnabled: enabled });
  }

  render() {

    const gameTitles = this.state.data.map((dat, index) => { return <Text key={index} style={styles(this.state.tabLength).titleText}>{dat.name}</Text> })
    const games = this.state.data.map((dat, index) => { return <DataTab hori={this.horizontalToggle} user={false} key={index} style={[styles(this.state.tabLength).games, { zIndex: 200 }]} index={index} data={dat} /> });

    if (this.state.userData.length > 0) {
      for (let [index, value] of this.state.userData.entries()) {
        gameTitles.push(<View key={index + this.state.data.length} style={[styles(this.state.tabLength).titleText, { height: 44 }]}><Text style={[styles(this.state.tabLength).userTitleText, { fontSize: value.runner.length < 12 ? 30 : 42 - value.runner.length }]}>{value.runner}</Text></View>)
        games.push(<DataTab hori={this.horizontalToggle} closeTab={this.closeUserTab} user={true} key={index + this.state.data.length} style={styles(this.state.tabLength).games} index={index} data={value} />)
      }
    }

    return (

      <View style={{ flex: 1, backgroundColor: '#222222', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
        <Title userLoading={this.state.userLoading} style={{ zIndex: 100 }} func={this.searchUser} />
        <Arrow ref={this.scrollRef} length={this.state.tabLength} />
        {this.state.userLoading && <View style={styles().loadingCircle}><ActivityIndicator size={80} color="#dd4411" /></View>}
        <ScrollView ref={this.horizontal} onScrollEndDrag={this.horizontalToggle(false)} onScrollBeginDrag={this.horizontalToggle(true)} onScroll={this.handleScroll} contentContainerStyle={styles(this.state.tabLength).horizontalScroll} horizontal={true} pagingEnabled={true}
          showsHorizontalScrollIndicator={false} decelerationRate='fast'>
          <View style={styles().inner}>
            <View style={[styles().outer, { zIndex: 0 }]}>
              {gameTitles}
            </View>
            <View style={[styles().outer, { marginLeft: 2, zIndex: 10, height: '90%' }]}>
              {games}
            </View>

          </View>
        </ScrollView>
        {this.state.showUsers}
      </View>
    );
  };

}

const styles = (ori) => StyleSheet.create({

  inner: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 0
  },
  outer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  horizontalScroll: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: `${100 * ori}%`,
    height: '100%',
    zIndex: 5
  },

  titleText: {
    width: `${100 / ori}%`,
    fontSize: 30,
    color: '#fff',
    fontFamily: 'squada',
    marginTop: 5,
    padding: 3,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#111',
    alignSelf: 'flex-start',
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },

  userTitleText: {
    color: '#fff',
    marginLeft: '31%',
    fontFamily: 'squada',
    alignSelf: 'flex-start',
    textAlign: 'left',
    textAlignVertical: 'center',
  },

  games: {
    width: `${100 / ori}%`,
  },
  loadingCircle:
  {
    position: "absolute",
    top: '40%',
    left: 0,
    right: 0,
    zIndex: 150
  },


})



export default App;
