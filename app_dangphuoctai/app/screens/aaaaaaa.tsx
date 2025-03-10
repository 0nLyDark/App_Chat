import { View, Text, Button,Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

import * as ImagePicker from "expo-image-picker";

const aaaaaaa = ({ navigation }: { navigation: any }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("SignIn");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 200, height: 200, marginTop: 10 }}
          />
        )}
      </View>
    </View>
  );
};

export default aaaaaaa;
