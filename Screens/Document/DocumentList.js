import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DocumentCard from "./DocumentCard";
var { width } = Dimensions.get("window");

const DocumentList = (props) => {
  const { item } = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ width: "50%" }}
      onPress={() => navigation.navigate("Document Detail", { item: item })}
    >
      <View style={{ width: width / 2 }}>
        <DocumentCard {...item} />
      </View>
    </TouchableOpacity>
  );
};
export default DocumentList;
