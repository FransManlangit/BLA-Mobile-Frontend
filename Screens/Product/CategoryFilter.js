import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  View,
} from "react-native";
import { Badge, Text, VStack, Divider, HStack } from "native-base";
import { COLORS, SIZES } from "../../assets/constants";
import { all } from "axios";

const CategoryFilter = (props) => {
  const [activeCategory, setActiveCategory] = useState("all"); // Set the initial active category to 'all'


  return (
    <View>
      <Text className="pl-4 text-xl font-normal italic">Categories</Text>
    <ScrollView
      horizontal
      className="mt-8 px-5"
      showsHorizontalScrollIndicator={false}
    >
      
      <TouchableOpacity
        key={"all"}
        onPress={() => {
          setActiveCategory("all"); // Set active category to 'all'
          props.categoryFilter("all");
          props.setActive(-1);
        }}
        className="mr-8 relative "
      >
        <Text
          style={{ color: COLORS.black }}
          className={activeCategory === "all" ? "font-bold text-xl" : "text-xl"}
        >
          All
        </Text>
    
      </TouchableOpacity>
      {props.categories.map((item) => {
        const isActive = item.id === activeCategory;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              setActiveCategory(item.id); // Set active category to the id of the selected category
              props.categoryFilter(item.id);
              props.setActive(props.categories.indexOf(item));
            }}
            className="mr-8 relative"
          >
            <Text
              style={{ color: COLORS.black }}
              className={
                activeCategory === item.id ? "font-bold text-lg" : "text-lg"
              }
            >
              {item.name}
            </Text>
            {isActive ? (
              <Text className="font-extrabold text-yellow-400 -mt-3 ml-2 text-center">
                ____
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
    </View>
  );
};

export default CategoryFilter;
