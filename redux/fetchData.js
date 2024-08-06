import { createSlice } from '@reduxjs/toolkit'

import database from '@react-native-firebase/database';
// import {call,put,takeEvery} from 'redux-saga'

import { call,put,takeEvery,takeLatest } from 'redux-saga/effects';


export const read = createSlice({
  name: 'read',     
  initialState: {
    data:null,
    loading: false
  },
  reducers: {
    loader: (state,action) => {
      state.data=action.payload;
      state.loading= true;
      console.log('loader',state.loading);
    //  return {type:'do'}
    },

    handle: (state,action) => {
      state.data=action.payload;
      state.loading= false;
      console.log('loader handle',state.loading);
    },
}
})


export function* mySaga(action){
  try{
    yield put(loader())
    const b = yield call( async ()=> await database().ref('/Law1').once('value') )
    const a =   b.val()      
 

    yield put(handle(a))
  }catch(e){

  }
}

export function* saga(){
  yield takeEvery('run',mySaga)
}

  
export const {loader,handle,run} = read.actions;
