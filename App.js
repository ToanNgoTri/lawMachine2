/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './navigators/AppNavigators';
import {createContext, useState} from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import dataOrg from './data/project2-197c0-default-rtdb-export.json';
const RefForSearch = createContext(); // lấy ref.current của Tab Search (Detail1) để ScrollToTop khi click vào bottom tab
const RefForHome = createContext(); // lấy ref.current của Tab Home (Home) để ScrollToTop khi click vào bottom tab
const ModalStatus = createContext(); // lấy modalVisible status
const InfoDownloaded = createContext(); //
const ContentDownloaded = createContext(); //

function App() {

  const [forSearch, setforSearch] = useState('');
  const updateSearch = data => {
    setforSearch(data);
  };
  
  const [forHome, setforHome] = useState('');
  const updateHome = data => {
    setforHome(data);
  };

  const [modalStatus, setModalStatus] = useState(false);
  const updateModalStatus = data => {
    setModalStatus(data);
  };



  
  const [info, setInfo] = useState(dataOrg['LawInfo']);
  const updateInfo = data => {
    setInfo(data);
  };
  const [content, setContent] = useState(dataOrg['LawContent']);
  const updateContent = data => {
    setContent(data);
  };

  return (
    <Provider store={store}>
      <ModalStatus.Provider value={{modalStatus, updateModalStatus}}>
        <RefForHome.Provider value={{forHome, updateHome}}>
          <RefForSearch.Provider value={{forSearch, updateSearch}}>
            <InfoDownloaded.Provider value={{info,updateInfo}}>
            <ContentDownloaded.Provider value={{content,updateContent}}>

            <StackNavigator />
            </ContentDownloaded.Provider>
            </InfoDownloaded.Provider>
          </RefForSearch.Provider>
        </RefForHome.Provider>
      </ModalStatus.Provider>
    </Provider>
  );
}

// export default App;
export {RefForSearch, RefForHome, ModalStatus,ContentDownloaded,InfoDownloaded, App};
// export {RefForHome};
// export {dataLaw};
// export {RefLoading};
// export {modalStatus};
