// import React, { useEffect, useState, useContext } from "react";

// import { useFocusEffect } from "@react-navigation/native";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   openList,
// } from "react-native";
// import { Picker, ScrollView, Select } from "native-base";
// import Icon from "react-native-vector-icons/FontAwesome";
// import TrafficLight from "./StyledComponents/TrafficLight";
// import EasyButton from "./StyledComponents/EasyButtons";
// import Toast from "react-native-toast-message";
// import { Ionicons, Feather } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import baseURL from "../assets/common/baseUrl";
// import { useNavigation } from "@react-navigation/native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { COLORS, SIZES } from "../assets/constants";


// // Define status codes
// const codes = [
//   { name: "approved", code: "approved" },
//   { name: "declined", code: "declined" },
//   { name: "received", code: "received" }, // Corrected spelling
// ];

// const RequestCard = ({ item }) => {
//   const [requestStatus, setRequestStatus] = useState();
//   const [statusText, setStatusText] = useState();
//   const [requestStatusChange, setRequestStatusChange] = useState();
//   const [token, setToken] = useState();
//   const [cardColor, setCardColor] = useState();
//   const navigation = useNavigation();



//   // Function to update the request
//   const updateRequest = () => {
//     // Retrieve token using async storage
//     AsyncStorage.getItem("jwt")
//       .then((res) => {
//         setToken(res);
//       })
//       .catch((error) => console.log(error));

//     // Define request configuration
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     // Prepare request data
//     const request = {
//       dateofRequest: item.dateofRequest,
//       paidAt: item.paidAt,
//       id: item.id,
//       requestItems: item.requestItems,
//       requestStatus: requestStatusChange,
//       totalPrice: item.totalPrice,
//       user: item.user,
//       purpose: item.purpose,
//       payment: item.payment

//     };
   
    

//     // Make the PUT request
//     axios
//       .put(`${baseURL}requests/${item.id}`, request, config)
//       .then((res) => {
//         if (res.status === 200 || res.status === 201) {
//           Toast.show({
//             topOffset: 60,
//             type: "success",
//             text1: "Request Edited",
//             text2: "",
//           });
//           setTimeout(() => {
//             navigation.navigate("Requests");
//           }, 500);
//         }
//       })
//       .catch((error) => {
//         Toast.show({
//           topOffset: 60,
//           type: "error",
//           text1: "Something went wrong",
//           text2: "Please try again",
//         });
//       });
//   };

//   useEffect(() => {
//     // Set request status and card color based on item status
//     if (item.requestStatus === "approved") {
//       setRequestStatus(<TrafficLight approved />);
//       setStatusText("approved");
//       setCardColor("#BABF5E");
//     } else if (item.requestStatus === "declined") {
//       setRequestStatus(<TrafficLight declined />);
//       setStatusText("declined");
//       setCardColor("#c6131b");
//     } else if (item.requestStatus === "received") {
//       setRequestStatus(<TrafficLight received />);
//       setStatusText("received");
//       setCardColor("#006899");
//     }

//     const getToken = async () => {
//       try {
//         const res = await AsyncStorage.getItem("jwt");
//         if (res !== null) {
//           setToken(res);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getToken();

//     // Cleanup function
//     return () => {
//       setRequestStatus(null);
//       setStatusText(null);
//       setCardColor(null);
//     };
//   }, []);

//   return (

//     <View style={[styles.container, { backgroundColor: cardColor }]}>
//     <View className="p-4 bg-white rounded-lg mb-4 ">
//       <View className="flex flex-col space-y-2 pb-2">
//         <Text>
//           {" "}
//           Status: {statusText} {requestStatus}
//         </Text>
//         <Text>Email: {item.user ? item.user.email: ""}</Text>
//         <Text>Grade: {item.user ? item.user.grade: ""}</Text>
//          <Text>Date of Request: {item.dateofRequest.split("T")[0]}</Text>
//          <Text>Payment Method: {item.paymentInfo}</Text>
//         <Text>Total Price = {item.totalPrice}</Text>
       
//       </View>
//       <View className="flex pt">
//           <Select
//            width="50%"
//            iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
//            style={{ width: undefined }}
//            selectedValue={requestStatusChange}
//           color="black"
//           placeholder="Change Status"
//             placeholderTextColor="gray"
//             placeholderStyle={{ color: "#58595B" }}
//             placeholderIconColor="#007aff"
//             onValueChange={(e) => setRequestStatusChange(e)}
//           >
//             {codes.map((c) => (
//               <Select.Item key={c.code} label={c.name} value={c.code} />
//            ))}
//           </Select>

//           <EasyButton secondary large onPress={() => updateRequest()}>
//             <Text style={{ color: "white" }}>Update</Text>
//           </EasyButton>
//        </View>
//     </View>
//     </View>
//    );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 2
//     ,
//     // Add other styles as needed
//   },
// });



// export default RequestCard;
