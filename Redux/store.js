import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import cartItems from './Reducers/cartItems'
import documentItems from './Reducers/documentItems';
import productItems from './Reducers/productItems'

const reducers = combineReducers({
    documentItems: documentItems,
    cartItems: cartItems,
    productItems: productItems
})


const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
)

export default store;