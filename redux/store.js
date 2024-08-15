import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { read,search } from './fetchData'


import {all,call,takeEvery} from 'redux-saga/effects'
import {saga,saga1,rootReducer} from './fetchData'
import {loader,handle} from './fetchData'

const sagaMiddleware = createSagaMiddleware()

export function* rootSaga(){
  yield all([
    saga1(),saga()
  ])
}


export const store = configureStore({
    reducer: {read:read.reducer,search:search.reducer}, // khi sử dụng cái này thì không cần combineReducers
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false, thunk: false}).concat([sagaMiddleware])

    // middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat([sagaMiddleware])
    //applyMiddleware(...sagaMiddleware)
  })
  
  sagaMiddleware.run(rootSaga)

 