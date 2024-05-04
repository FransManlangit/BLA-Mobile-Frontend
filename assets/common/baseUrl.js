// import { Platform } from 'react-native'
    
// let baseURL = '';

// {Platform.OS == 'android'
// ? baseURL = 'https://bla-mobile-backend-xe24.onrender.com/api/v1/'
// : baseURL = 'https://bla-mobile-backend-xe24.onrender.com/api/v1/'
// }

// export default baseURL;


import { Platform } from 'react-native'
    
let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.100.206:4000/api/v1/'
: baseURL = 'http://localhost:4000/api/v1/'
}

export default baseURL;