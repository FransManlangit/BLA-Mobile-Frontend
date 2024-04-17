  import React from "react";
  import { StyleSheet, View } from "react-native";
  import { Badge, Text, VStack } from "native-base";
  import { useSelector, } from 'react-redux'
  import { DocumentPlusIcon } from "react-native-heroicons/solid";
  import { COLORS } from "../assets/constants"


  const CartIcon = (props) => {

    const color = props.color

    const documentItems = useSelector(state => state.documentItems);

    return (
      <>
        {documentItems.length > 0 ? (
          <VStack space={2} alignItems="center">
            <View className="p-5">
          <Badge 
          className="bg-[#B1A079] border-solid border-white"
          rounded="md"
          mb={-4}
          mr={-4}
          position="absolute"
          zIndex={1}
          variant="solid"
          alignSelf="flex-end"
          _text={{
            fontSize: 12,
            color: COLORS.white
          }}
          >
          {documentItems.length}
          </Badge>
          <DocumentPlusIcon color={color}/>
          </View>
          </VStack>
        ) : (
          <DocumentPlusIcon color={color}/>
        )}
      </>
    );
  };
    
  export default CartIcon