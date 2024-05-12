import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "native-base";

var { width } = Dimensions.get("window");

const StudentsListView = ({ item, index, deleteUserViolation }) => {
  console.log("Item Dawwewerweerewrw", item);
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
          <Text className="font-bold text-zinc-400 text-lg">Edit Student Violation</Text>
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
                  navigation.navigate("UpdateViolationStatus", { item: item });

                  setModalVisible(false);
                }
              }}
              title="Edit"
            >
              <Text style={styles.textStyle}>Update</Text>
            </EasyButton>
            {/* <EasyButton
              medium
              danger
              onPress={() => {
                if (item) {
                  deleteUserViolation(item._id);
                  setModalVisible(false);
                }
              }}
              title="Delete"
            >
              <Text style={styles.textStyle}>Delete</Text>
            </EasyButton> */}
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
              <View className="flex flex-row justify-between">
                <View className="flex p-2 flex-row space-x-6 items-center">
                  <View className="flex-1 justify-center items-start">
                    <Text className="font-semibold text-base w-20">
                      {item.user.lastname}
                    </Text>
                  </View>
                  <View className="flex-1 justify-center items-start ">
                    <Text className="font-semibold text-base w-32">
                      {item.user.grade}
                    </Text>
                  </View>

                  <View className="flex-1 justify-center items-start">
                    <Text className="font-semibold text-base w-24">
                      {item.type}
                    </Text>
                  </View>

                  {item.date ? (
                    <Text className="text-base">
                      {new Date(item.date).toLocaleDateString("en-US")}
                    </Text>
                  ) : (
                    <Text className="text-base">N/A</Text>
                  )}

                  <View className="flex-1 justify-center items-start ">
                    <View
                      className={`px-3 rounded-full ${
                        item.status === "Community Service" ||
                        item.status === "Parent Meeting"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <Text className="text-white font-semibold text-base">
                        {item.status}
                      </Text>
                    </View>
                  </View>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#58595B ",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 5,
    right: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
});

export default StudentsListView;
