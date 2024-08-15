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
import { Provider } from 'react-redux';
import {store} from './redux/store'
const RefForSearch = createContext(); // lấy ref.current của Tab Search (Detail1) để ScrollToTop khi click vào bottom tab
const RefForHome = createContext(); // lấy ref.current của Tab Home (Home) để ScrollToTop khi click vào bottom tab
const dataLaw = createContext(); // lấy ref.current của Tab Home (Home) để ScrollToTop khi click vào bottom tab
const RefLoading = createContext(); // lấy ref.current của Tab Home (Home) để ScrollToTop khi click vào bottom tab

function App() {

  const [forSearch,setforSearch] = useState('');
  const updateSearch = (data) =>{
    setforSearch(data)
  } 

  const [forHome,setforHome] = useState('');
  const updateHome = (data) =>{
    setforHome(data)
  } 

  const [dataLawForApp,setDataLawForApp] = useState([]);
  const updateData = (data) =>{
    setDataLawForApp(data)
  } 

  const [loading,setLoading] = useState(false);
  const updateLoading = (data) =>{
    setLoading(data)
  } 

  

  return(
    <Provider store={store}>
    <RefForHome.Provider value={{forHome,updateHome}}>

<RefForSearch.Provider value={{forSearch,updateSearch}}>
  <dataLaw.Provider value={{dataLawForApp,updateData}}>
    <RefLoading.Provider value={{loading,updateLoading}}>
<StackNavigator/>
</RefLoading.Provider>
</dataLaw.Provider>
</RefForSearch.Provider> 
</RefForHome.Provider> 
</Provider>
 )
}


export default App;
export {RefForSearch}
export {RefForHome}
export {dataLaw}
export {RefLoading}
