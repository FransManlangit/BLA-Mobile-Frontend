import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  Container,
  VStack,
  Input,
  Heading,
  Text,
  Icon,
  HStack,
  Box,
  Avatar,
  Spacer,
  ScrollView,
} from "native-base";
import { useNavigation } from "@react-navigation/native";


var { width } = Dimensions.get("window");

const SearchedDocument = (props) => {
  const { documentsFiltered } = props;
  const navigation = useNavigation();

  const handleItemPress = (item) => {
   
    navigation.navigate("Document Detail", { item }); 
  };
  return (
   
    <ScrollView>
      <View className="pt-4">
    <Container style={{ width: width }}>
      {documentsFiltered.length > 0 ? (
        <Box width={80}>
          <FlatList
            data={documentsFiltered}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <Box
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: "muted.50",
                  }}
                  borderColor="muted.800"
                  pl={["0", "4"]}
                  pr={["0", "5"]}
                  py="2"
                >
                  <HStack space={[2, 3]} justifyContent="space-between">
                    <Avatar
                      size="48px"
                      source={
                        item.image?.url
                          ? { uri: item.image?.url }
                          : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
                      }
                    />
                    <VStack>
                      <Text
                        _dark={{
                          color: "warmGray.50",
                        }}
                        color="coolGray.800"
                        bold
                      >
                        {item.name}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: "warmGray.200",
                        }}
                      >
                        {item.description}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text
                      fontSize="xs"
                      _dark={{
                        color: "warmGray.50",
                      }}
                      color="coolGray.800"
                      alignSelf="flex-start"
                    >
                      {item.price}
                    </Text>
                  </HStack>
                </Box>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </Box>
      ) : (
        <View style={styles.center}>
          <Text style={{ alignSelf: "center" }}>
            No documents match the selected criteria
          </Text>
        </View>
      )}
    </Container>
    </View>
    </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  listContainer: {
    // height: height,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
});

export default SearchedDocument;
