import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../assets/constants";

const Carousel = () => {
  const slide = [
    "https://res.cloudinary.com/dn638duad/image/upload/v1707755389/Announcement/buwan_ng_wika_t6qvuw.jpg",
    "https://res.cloudinary.com/dn638duad/image/upload/v1707755399/Announcement/enrollment_i7ugom.jpg",
    "https://res.cloudinary.com/dn638duad/image/upload/v1707755384/Announcement/announcement_etwe2a.jpg",
  ];

  return (
    <View>
      <SliderBox
        images={slide}
        dotColor={COLORS.brown}
        inactiveDotColor={COLORS.brown}
        ImageComponentStyle={{
          borderRadius: 15,
          width: "100%",
          height: 180,
          marginTop: 15,
        }}
        autoplay
        circleLoop
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
  },
});
