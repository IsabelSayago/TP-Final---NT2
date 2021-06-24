import "react-native-gesture-handler";

import React, { useContext, useEffect, useState } from "react";

import AsyncStorage from "./utils/AsyncStorage";
import Chat from './screens/Chat'
import Friends from "./screens/Friends";
import GlobalContext from "./components/global/context/index";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import Profile from "./screens/Profile";
import { ResponsiveEmbed } from "react-bootstrap";
import Signup from "./screens/Signup";
import Welcome from "./screens/Welcome";
import { createStackNavigator } from "@react-navigation/stack";

const URL_API = "http://localhost:3000/signup"
export default function App() {

  
  const [authData, setAuthData] = useState({});

  const [authenticated, setAuthenticated] = useState(false);


  const onSignIn = (googleUser) => {
    const id_token = googleUser.getAuthResponse().id_token;
    return id_token
  }

  
  async function applyAuthentication (user){

    //const token = onSignIn(user);
    
    const response = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        //token: token
      })
    }).catch(err => {
      if (err & err.message) {
        console.log(err.message)
      }
    })
    return response;
   
  }

  const applyLogout = () =>{
    AsyncStorage.clearAll()
    setAuthenticated(false)
  }

  const checkUser = async () =>{
    const user = await AsyncStorage.getData('@userData')
    console.log(user)
    if (user){
      setAuthenticated(true)
      setAuthData(user)
    }
  }
  

  useEffect(() => {
    checkUser()

  }, [])

  const Stack = createStackNavigator();

  return (
    <GlobalContext.Provider value={{ authData,setAuthData, setAuthenticated, applyAuthentication, applyLogout }}>
      <NavigationContainer>
        <Stack.Navigator>
          
          {  
          (authenticated)?
          <>
            <Stack.Screen name="Welcome" component={Welcome} options={{ title: "Welcome" }} />
            <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
            <Stack.Screen name="Friends" component={Friends} options={{ title: 'Friends' }} />
            <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />

          </>
          :
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
            <Stack.Screen name="Signup" component={Signup} options={{ title: 'Signup' }} />
          </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContext.Provider>
  );
}