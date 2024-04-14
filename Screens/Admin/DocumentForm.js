import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import Error from "../../Shared/Error";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import mime from "mime";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DocumentForm = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [isFeatured, setIsFeature] = useState(false);
  const [item, setItem] = useState(null);

  let navigation = useNavigation();

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setName(props.route.params.item.name);
      setDescription(props.route.params.item.description);
      setPrice(props.route.params.item.price.toString());
      setMainImage(props.route.params.item.image);
      setImage(props.route.params.item.image);
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
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setMainImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const addDocument = () => {
    if (name == "" || description == "" || price == "") {
      setError("Please fill in the form correctly");
    }

    let formData = new FormData();
    const newImageUri = "file:///" + image.split("file:/").join("");

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("isFeatured", isFeatured);
    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      console.log(item);
      axios
        .put(`${baseURL}documents/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Document successfuly updated",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Documents");
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      axios
        .post(`${baseURL}documents`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Document added",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Documents");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };
  return (
    <KeyboardAwareScrollView>
      <View className="items-center pt-4">
        <View title="Add Document">
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: mainImage }} />
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Icon style={{ color: "white" }} name="camera" />
            </TouchableOpacity>
          </View>

          <View className="flex-col pt-8">
            <Text>Name</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Name"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            <Text>Description</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Description"
                name="description"
                id="description"
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>
            <Text>Price</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Price"
                name="price"
                id="price"
                value={price}
                keyboardType={"numeric"}
                onChangeText={(text) => setPrice(text)}
              />
            </View>
          </View>
          {error ? <Error message={error} /> : null}
          <View className="flex items-center pt-4">
            <TouchableOpacity
              className="py-3 w-48 
                bg-[#FAE500] rounded-xl"
              onPress={() => addDocument()}
            >
              <Text className="text-base font-semibold text-center text-black">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default DocumentForm;
