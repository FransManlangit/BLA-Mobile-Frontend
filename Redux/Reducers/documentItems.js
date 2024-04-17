import {
    ADD_TO_CART_DOCUMENT,
    REMOVE_FROM_CART_DOCUMENT,
    CLEAR_CART_DOCUMENT
} from '../DocumentConstants';

const documentItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART_DOCUMENT:
            return [...state, action.payload]
        case REMOVE_FROM_CART_DOCUMENT:
            return state.filter(documentItem => documentItem !== action.payload)
        case CLEAR_CART_DOCUMENT:
            return state = []
    }
    return state;
}

export default documentItems;