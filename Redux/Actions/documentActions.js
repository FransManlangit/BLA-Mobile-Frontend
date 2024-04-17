import {
    ADD_TO_CART_DOCUMENT,
    REMOVE_FROM_CART_DOCUMENT,
    CLEAR_CART_DOCUMENT
} from '../DocumentConstants';

export const addToCartDocument = (payload) => {
    console.log("payload",payload)
    return {
        type: ADD_TO_CART_DOCUMENT
        ,
        payload
    }
}

export const removeFromCartDocument = (payload) => {
    return {
        type: REMOVE_FROM_CART_DOCUMENT,
        payload
    }
}

export const clearCartDocument = () => {
    return {
        type: CLEAR_CART_DOCUMENT
    }
}