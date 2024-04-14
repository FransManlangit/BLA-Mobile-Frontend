// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import axios from 'axios';
// import baseURL from '../../assets/common/baseUrl';
// import { ScrollView } from "react-native-gesture-handler";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";

// const statusCodes = [
//   { name: "Pending", code: "3" },
//   { name: "Shipped", code: "2" },
//   { name: "Delivered", code: "1" },
// ];

// const RequestDetails = ({ route }) => {
//   const { request } = route.params;
//   const [requestItems, setRequestItems] = useState([]);
//   const navigation = useNavigation();

//   const findStatusName = (statusCode) => {
//     const foundStatus = statusCodes.find((status) => status.code === statusCode);
//     return foundStatus ? foundStatus.name : "Unknown";
//   };

//   const formatDate = (dateTime) => {
//     const date = new Date(dateTime);
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//     };
//     return date.toLocaleDateString(undefined, options);
//   };

//   //old codes
//   useEffect(() => {
//     const fetchRequestItems = async () => {
//       try {
//         const response = await axios.get(`${baseURL}requests/requestItems/${request.id}`);
//         setRequestItems(response.data);
//       } catch (error) {
//         console.error("Error fetching request items:", error);
//       }
//     };

//     fetchRequestItems();
//   }, [request.id]);

//   return (
//     <ScrollView>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Ionicons name="chevron-back-circle" size={30} />
//       </TouchableOpacity>
//       <View style={styles.container}>
//         <Text style={styles.title}>Request Details</Text>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.label}>Request ID:</Text>
//           <Text>{request.id}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.label}>Document Listsssss:</Text>
//           <Text>{`${request.name}`}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.label}>Payment Method:</Text>
//           <Text>{request.payment}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.label}>Status:</Text>
//           <Text>{findStatusName(request.status)}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.label}>Request Date:</Text>
//           <Text>{formatDate(request.dateofRequest)}</Text>
//         </View>
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalLabel}>Total Price:</Text>
//           <Text style={styles.totalLabel2}> PHP: {request.totalPrice}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.label}>Requested Items:</Text>
//           <View style={styles.space}>
//             {requestItems.map((requestItem) => (
//               <View key={requestItem._id} style={styles.requestItemContainer}>
//                 <View style={styles.bulletItem}>
//                   <Text style={styles.bulletText}>{'\u2022'}</Text>
//                   <View style={styles.itemDetails}>
//                     <Text style={styles.label}>{requestItem.document.name}</Text>
//                     <Text>Price: {requestItem.document.price} | Number of Copies: {requestItem.numofcopies}</Text>
//                   </View>
//                 </View>
//                 <Image
//                   source={{ uri: requestItem.document.image }}
//                   style={styles.documentImage}
//                 />
//               </View>
//             ))}
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );

// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f0f0f0",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   detailsContainer: {
//     marginBottom: 15,
//   },
//   label: {
//     fontWeight: "bold",
//   },
//   text: {
//     color: "#333",
//   },
//   space: {
//     marginTop: 10,
//   },
//   bulletItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   bulletText: {
//     fontSize: 40,
//     marginRight: 8,
//   },
//   itemDetails: {
//     marginLeft: 5,
//   },
//   documentImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     marginLeft: 10,
//   },

//   totalContainer: {
//     marginTop: 1,
//     marginBottom: 10,
//   },
//   totalLabel: {
//     fontWeight: "bold",
//     color: 'red',
//     fontSize: 20
//   },
//   totalLabel2: {
//     fontWeight: "bold",
//     color: 'black',
//     fontSize: 17
//   },
// });

// export default RequestDetails;

import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../Shared/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const RequestDetails = ({ route }) => {
  const { request } = route.params;
  const [requestItems, setRequestItems] = useState([]);
  const navigation = useNavigation();

  const generatePdfReceipt = async () => {
    try {
      if (!route.params?.request) {
        console.error("Request parameters are missing.");
        return;
      }

      const request = route.params.request;

      const schoolLogoUrl =
        "https://res.cloudinary.com/dn638duad/image/upload/v1709816909/Authorization%20Letter/new-logo_ifmmsn.png";

      const html = `
      <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <div class="flex h-screen w-full items-center justify-center bg-gray-600">
        <div class="w-80 rounded bg-gray-50 px-6 pt-8 shadow-lg">
          <img src="${schoolLogoUrl}" alt="School Logo" class="mx-auto w-16 py-4">
          <div class="flex flex-col justify-center items-center gap-2">
          <h4 class="font-semibold">Blessed Land Academy</h4>
          <p class="text-xs text-center tracking-wide">11-3 Bautista, Lower Bicutan, Manila,</p>
          <p class="text-xs text-center tracking-wide">1632 Metro Manila</p>
          </div>
      <div class="flex flex-col gap-3 border-b py-6 text-xs">
      <p class="flex justify-between">
        <span class="text-zinc-600">Tracking No:</span>
        <span>BLA-${request._id.substring(0, 7)}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-zinc-600">Date of Request:</span>
        <span>${formatDate(request.dateofRequest)}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-zinc-600">Payor:</span>
        <span>${request.user.firstname} ${request.user.lastname}</span>
      </p>
      <p class="flex justify-between">
      <span class="text-zinc-600">Purpose:</span>
      <span>${request.purpose}</span>
      <p class="flex justify-between">
      <span class="text-zinc-600">Payment Info:</span>
      <span>${request.paymentInfo}</span>
    </p>
    </div>
    <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
    <table class="w-full text-left">
      <thead>
        <tr class="flex">
          <th class="w-full py-2">Document</th>
        
          <th class="min-w-[44px] py-2">Total</th>
        </tr>
      </thead>
      <tbody>
      
        <tr class="flex flex-col ">
         ${request.requestItems
            .map(
          (requestItem) => `
          <tr class="flex justify-between">
          <td class="flex-1">${requestItem.document.name}</td>
          <td class="min-w-[44px]">₱${requestItem.document.price.toFixed(
            2
          )}</td>
        </tr>
        `
            )
            .join("")}</td>
        </tr>
        
      </tbody>
    </table>
    <div class=" border-b border border-dashed"></div>
    <div class="py-4 justify-center items-center flex flex-col gap-2">
      <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg> blessedlandacademy2005@yahoo.com</p>
      <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg> +
      0912 047 0567</p>
    </div>
  </div>
    </html>
    
      `;

      const file = await printToFileAsync({
        html: html,
        base64: false,
      });

      await shareAsync(file.uri);

      console.log("Receipt generated successfully");
    } catch (error) {
      console.error("Error generating receipt:", error);
      // Handle error appropriately, such as displaying an error message to the user
    }
  };

  const formatDate = (date) => {
    // Convert date to a JavaScript Date object
    const newDate = new Date(date);

    // Extract date parts
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();

    // Format the date in YYYY-MM-DD format
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;

    return formattedDate;
  };

  useEffect(() => {
    const fetchRequestItems = async () => {
      try {
        const response = await axios.get(
          `${baseURL}requests/get/userRequests/${request._id}`
        );

        // Update state with the request items from the response
        setRequestItems(response.data[0]?.requestItems || []); // Adjust the array index based on your response structure
      } catch (error) {
        console.error("Error fetching request items:", error);
        // Add additional error handling logic, such as displaying an error message to the user.
      }
      console.log(request, "frans330928");
    };

    console.log("Request ID:", request._id); // Log request ID before making the request

    fetchRequestItems();
  }, [request._id]);

  console.log("Request Items:", requestItems);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="flex bg-white h-full w-full space-y-4">
          <View className="rounded-lg bg-[#B1A079] h-36 rounded-bl-3xl rounded-br-3xl">
            <View className="flex-row justify-start pt-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
              >
                <ArrowLeftIcon size="20" color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-3xl font-bold text-center text-[#FFFBF1] pt-6 pb-20">
              Request Information
            </Text>
          </View>
          <View className="p-4 items-center">
            <View className="bg-[#FAE500]  rounded-bl-3xl rounded-br-3xl rounded-tr-3xl rounded-tl-3xl w-80">
              <View className="flex flex-col space-y-2 p-4">
                {request.requestItems.map((requestItem) => (
                  <View
                    key={requestItem.document._id} // Assuming requestItem has a unique identifier
                    className="flex-row"
                  >
                    <View className="flex flex-row space-x-4">
                      <Text className="text-lg">{"\u2022"}</Text>
                      <Text className="text-lg w-6/12">
                        {requestItem.document.name}
                      </Text>
                      <Text className="text-lg pl-10">
                        {" "}
                        {requestItem.document.price}
                      </Text>
                    </View>
                  </View>
                ))}
                <View className="flex flex-row pt-4">
                  <Text className="font-bold text-base">Total Price:</Text>
                  <Text className="text-right w-7/12 text-xl">
                    {request.totalPrice}
                  </Text>
                </View>
                <View className="flex flex-col space-y-4 pt-12">
                  <View className="flex flex-row">
                    <Text className="font-bold text-base">
                      Request Purpose:
                    </Text>
                    <Text className="text-right w-5/12 text-base">
                      {request.purpose}
                    </Text>
                  </View>
                  <View className="flex flex-row">
                    <Text className="font-bold text-base">Payment Method:</Text>
                    <Text className=" text-right w-4/12 text-base">
                      {request.paymentInfo}
                    </Text>
                  </View>
                  <View className="flex flex-row">
                    <Text className="font-bold text-base">
                      Date of Request:
                    </Text>
                    <Text className="text-right w-32 text-sm">
                      {formatDate(request.dateofRequest)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="p-4 items-center">
            <TouchableOpacity
              onPress={() => generatePdfReceipt()}
              className="py-3 bg-[#B1A079] rounded-xl w-36"
            >
              <Text className="text-base font-semibold text-center text-white">
                Receipt
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RequestDetails;
