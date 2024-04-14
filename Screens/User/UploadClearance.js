import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import Toast from "react-native-toast-message";
import mime from "mime";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const UploadClearance = (props) => {
  const { stateUser } = useContext(AuthGlobal);
  const [user, setUser] = useState("");
  const [uploadedAt, setUploadedAt] = useState("");
  const [clearanceImages, setClearanceImages] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);

  useEffect(() => {
    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant camera roll permissions to make this work!",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // Format the URI immediately after picking the image
      const newImageUri = "file:///" + result.uri.split("file:/").join("");
      setClearanceImages(newImageUri);
    }
  };

  const addDocument = async () => {
    try {
      if (!clearanceImages) {
        Alert.alert("No Image Selected", "Please select an image to upload.");
        return;
      }

      setLoading(true);
      const currentDate = new Date();
      setUploadedAt(currentDate);

      const formData = new FormData();
      formData.append("user", user);
      formData.append("uploadedAt", currentDate.toISOString());

      const file = {
        uri: clearanceImages,
        type: mime.getType(clearanceImages),
        name: clearanceImages.split("/").pop(),
      };
      formData.append("image", file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // Await the Axios POST request and capture the response
      const response = await axios.post(
        `${baseURL}clearances`,
        formData,
        config
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Clearance Uploaded",
          text2: "",
        });
        setTimeout(() => {
          navigation.navigate("User Profile");
        }, 500);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error uploading clearance document:", error);
      setLoading(false);
      Alert.alert(
        "Error",
        "Failed to upload clearance document. Please try again later."
      );
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex items-center bg-white h-full w-full pt-24">
        <View className="flex-row pr-72 pb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <Text className="pb-4 text-xl font-medium tracking-wider">Upload Here your Clearance</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {clearanceImages ? (
            <Image source={{ uri: clearanceImages }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Icon name="camera" size={50} color="#666" />
              <Text style={styles.placeholderText}>Add Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="mt-12 items-center pb-32">
          <TouchableOpacity
            onPress={addDocument}
            className="py-3 bg-[#FAE500] rounded-xl w-56"
          >
            <Text className="text-sm font-semibold text-center text-black">
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  imageContainer: {
    width: "80%",
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  button: {
    backgroundColor: "yellow",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UploadClearance;
