import 'react-native-gesture-handler';
import React from 'react';
import MainPage from "./Components/MainPage"
import Subreddit from './Components/Subreddit';
import Thread from './Components/Thread';
import Profile from './Components/Profile';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react/cjs/react.production.min';


const Stack = createStackNavigator();

export default class App extends Component{
  render(){
    return(

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainPage}/>
          <Stack.Screen name="Subreddit" component={Subreddit}/>
          <Stack.Screen name="Thread" component={Thread}/>
          <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
};
