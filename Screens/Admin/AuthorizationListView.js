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
  let navigation = useNavigation();

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
                  deleteUserClearance(item._id);
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

      <TouchableOpacity
        onPress={() => {
          if (item) {
            navigation.navigate("", { user: item });
          }
        }}
        onLongPress={() => setModalVisible(true)}
      >
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
                  <Text className="text-base pl-12 w-28">
                    {item.user ? item.user.lastname : "N/A"}
                  </Text>
                  <Text className="text-base w-36 pl-4">
                    {item.user ? item.user.grade : "N/A"}
                  </Text>
                  <Text className="text-base w-28">
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
