import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighLight,
  TouchableOpacity,
  Dimensions,
  Button,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";

var { width } = Dimensions.get("window");

const ListItem = ({ item, index, deleteDocument }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let navigation = useNavigation();
  console.log(item);
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
              underlayColor="#E8E8E8"
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: 5,
                right: 10,
              }}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>

            <EasyButton
              medium
              secondary
              onPress={() => [
                navigation.navigate("DocumentForm", { item }),
                setModalVisible(false),
              ]}
              title="Edit"
            >
              <Text style={styles.textStyle}>Edit</Text>
            </EasyButton>
            <EasyButton
              medium
              danger
              onPress={() => [deleteDocument(item._id), setModalVisible(false)]}
              title="delete"
            >
              <Text style={styles.textStyle}>Delete</Text>
            </EasyButton>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Document Detail", { item });
        }}
        onLongPress={() => setModalVisible(true)}
        
      >
        <View className="bg-white p-2">
          <View className="flex pt-2 p-2 flex-row space-x-6 items-center">
            <Image
              source={
                item.image?.url
                  ? { uri: item.image?.url }
                  : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
              }
              resizeMode="contain"
              style={styles.image}
            />
            <Text className="text-sm w-36">{item.name}</Text>
            <Text className="text-sm w-32">${item.price}</Text>
          
          </View>
        </View>

        
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
  image: {
    borderRadius: 50,
    width: width / 6,
    height: 20,
    margin: 2,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 6,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ListItem;
