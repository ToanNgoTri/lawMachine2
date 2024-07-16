/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigators/AppNavigators';
import {createContext,useState} from 'react';

const RefForSearch = createContext(); // lấy ref.current của Tab Search (Detail1) để ScrollToTop khi click vào bottom tab
const RefForHome = createContext(); // lấy ref.current của Tab Home (Home) để ScrollToTop khi click vào bottom tab


function App() {

  const [forSearch,setforSearch] = useState('');
  const updateSearch = (data) =>{
    setforSearch(data)
  } 

  const [forHome,setforHome] = useState('');
  const updateHome = (data) =>{
    setforHome(data)
  } 

  return(
    <RefForHome.Provider value={{forHome,updateHome}}>

<RefForSearch.Provider value={{forSearch,updateSearch}}>
<StackNavigator/>
</RefForSearch.Provider> 
</RefForHome.Provider> 

 )
}


export default App;
export {RefForSearch}
export {RefForHome}
