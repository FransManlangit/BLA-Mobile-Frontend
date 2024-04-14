import {
    ADD_TO_CART_PRODUCT,
    REMOVE_FROM_CART_PRODUCT,
    CLEAR_CART_PRODUCT
} from '../ProductConstants';

const productItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART_PRODUCT:
            return [...state, action.payload]
        case REMOVE_FROM_CART_PRODUCT:
            return state.filter(productItem => productItem !== action.payload)
        case CLEAR_CART_PRODUCT:
            return state = []
    }
    return state;
}

export default productItems;