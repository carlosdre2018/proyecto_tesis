import { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Home({ navigation }) {

  let url = "https://6801-2800-4b0-5301-47c8-a829-a1ae-94bd-6276.ngrok-free.app"
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Este es el resultado: ',result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg', // Ajusta el tipo de archivo según tu necesidad
        name: 'image.jpg', // Puedes cambiar el nombre del archivo si es necesario
      });
      
      const response = await fetch(url + "/imagen", {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      navigation.navigate('Informacion', {label: data.label});
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button
          onPress={() => uploadImage()}
          title="Learn More"
          color="#5564eb"
          accessibilityLabel="Learn more about this purple button"
      />
      <Button
          onPress={() => navigation.navigate('Camera')}
          title="Take a picture"
          color="#5564eb"
          accessibilityLabel="Take a picture"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
