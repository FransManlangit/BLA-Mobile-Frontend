import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "native-base";

var { width } = Dimensions.get("window");

const AuthorizationListView = ({ item, index, deleteUserAuthorization }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleNavigation = () => {
    try {
      if (item) {
        navigation.navigate("SingleAuthorization", { user: item });
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.closeButton}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>
            <EasyButton
              medium
              secondary
              onPress={() => {
                if (item) {
                  // Modify the navigation destination as needed
                  navigation.navigate("Clearance", { user: item });
                  setModalVisible(false);
                }
              }}
              title="Edit"
            >
              <Text style={styles.textStyle}>Edit</Text>
            </EasyButton>
            <EasyButton
              medium
              danger
              onPress={() => {
                if (item) {
                  deleteUserAuthorization(item._id);
                  setModalVisible(false);
                }
              }}
              title="Delete"
            >
              <Text style={styles.textStyle}>Delete</Text>
            </EasyButton>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={handleNavigation} onLongPress={() => setModalVisible(true)}>
        {item ? (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="rounded-lg h-9">
                <View className="flex p-2 flex-row space-x-6 items-center">
                  <Image
                  
                    source={
                      item &&
                      item.authorizationLetter &&
                      item.authorizationLetter.url
                        ? { uri: item.authorizationLetter.url }
                        : require("../../assets/logo.png") // Provide a default image source when authorizationLetter.url is undefined
                    }
                    resizeMode="contain"
                    style={styles.authorizationLetter}
                  />
                   <View className="flex-1 justify-center items-start">
                    <Text className="font-semibold text-base pl-20">
                      {item.user.lastname}
                    </Text>
                  </View>
                  <View className="flex-1 justify-center items-start ">
                    <Text className="font-semibold text-base pl-10">
                      {item.user.grade}
                    </Text>
                  </View>
                  <Text className="text-base pl-11">
                    {item.dateofRequest
                      ? item.dateofRequest.split("T")[0]
                      : "N/A"}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 4,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  authorizationLetter: {
    borderRadius: 50,
    width: width / 6,
    height: 30,
    margin: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AuthorizationListView;
