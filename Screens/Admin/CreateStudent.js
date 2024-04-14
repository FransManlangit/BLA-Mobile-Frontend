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

const CreateStudent = (props) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [grade, setGrade] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [item, setItem] = useState(null);

  let navigation = useNavigation();

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setEmail(props.route.params.item.email);
      setFirstName(props.route.params.item.firstname);
      setLastName(props.route.params.item.lastname);
      setMiddleName(props.route.params.item.middlename);
      setGrade(props.route.params.item.grade);
      setSchoolId(props.route.params.item.schoolId);
      setSchoolYear(props.route.params.item.schoolYear);
      setPassword(props.route.params.item.password);
      setMainImage(props.route.params.item.avatar);
      setImage(props.route.params.item.avatar);
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

  const addStudents = () => {
    if (
      email == "" ||
      firstname == "" ||
      lastname == "" ||
      middlename == "" ||
      schoolId == "" ||
      schoolYear == "" ||
      phone == "" ||
      password == "" ||
      grade == ""
    ) {
      setError("Please fill in the form correctly");
    }

    let formData = new FormData();
    const newImageUri = "file:///" + image.split("file:/").join("");

    formData.append("email", email);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("middlename", middlename);
    formData.append("grade", grade);
    formData.append("schoolId", schoolId);
    formData.append("schoolYear", schoolYear);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("avatar", {
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
    axios
      .post(`${baseURL}users/student`, formData, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "New Student added",
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
            <Text>Student's Email</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Student's Email"
                name="email"
                id="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <Text>First Name</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="First Name"
                name="firstname"
                id="firstname"
                value={firstname}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <Text>Last Name</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Last Name"
                name="lastname"
                id="lastname"
                value={lastname}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            <Text>Middle Name</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Middle Name"
                name="middlename"
                id="middlename"
                value={middlename}
                onChangeText={(text) => setMiddleName(text)}
              />
            </View>
            <Text>Grade</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Grade"
                name="grade"
                id="grade"
                value={grade}
                onChangeText={(text) => setGrade(text)}
              />
            </View>
            <Text>School Year</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="School Year"
                name="schoolYear"
                id="schoolYear"
                value={schoolYear}
                onChangeText={(text) => setSchoolYear(text)}
              />
            </View>
            <Text>Student's Id</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Student Id"
                name="schoolId"
                id="schoolId"
                value={schoolId}
                onChangeText={(text) => setSchoolId(text)}
              />
            </View>
            <Text>Student's Phone</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Phone"
                name="phone"
                id="phone"
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
            <Text>Student's Password</Text>
            <View className="items-baseline bg-black/5 p-5 rounded-2xl w-48 h-14">
              <TextInput
                placeholder="Password"
                name="password"
                id="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
          {error ? <Error message={error} /> : null}
          <View className="flex items-center pt-4">
            <TouchableOpacity
              className="py-3 w-48 
                bg-[#FAE500] rounded-xl"
              onPress={() => addStudents()}
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
export default CreateStudent;
