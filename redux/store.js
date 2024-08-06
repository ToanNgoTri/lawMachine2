import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { read } from './fetchData'


import {all} from 'redux-saga/effects'
import {mySaga,saga} from './fetchData'
import {loader,handle, run} from './fetchData'

const sagaMiddleware = createSagaMiddleware()

export function* rootSaga(){
  yield all([saga()])
}


export const store = configureStore({
    reducer: read.reducer,
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false}).concat([sagaMiddleware])

    // middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat([sagaMiddleware])
    //applyMiddleware(...sagaMiddleware)
  })
  
  sagaMiddleware.run(rootSaga)

 