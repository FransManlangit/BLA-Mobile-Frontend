import React from "react";
import { StyleSheet, View } from "react-native";
import { Badge, Text, VStack } from "native-base";
import { useSelector, } from 'react-redux'
import { ShoppingCartIcon } from "react-native-heroicons/solid";
import { COLORS } from "../assets/constants"


const ProductIcon = (props) => {

  const color = props.color

  const productItems = useSelector(state => state.productItems);

  return (
    <>
      {productItems.length > 0 ? (
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
         {productItems.length}
        </Badge>
        <ShoppingCartIcon color={color}/>
        </View>
        </VStack>
      ) : (
        <ShoppingCartIcon color={color}/>
      )}
    </>
  );
};
  
export default ProductIcon