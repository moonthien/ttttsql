import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

export default function ViewUserScreen({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [role, setRole] = useState(user.role);
  const [birthday, setBirthday] = useState(new Date(user.birthday));
  const [avatar, setAvatar] = useState(user.avatar);
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImagePicker = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const newImageUri = URL.createObjectURL(file);
          setImageUri(newImageUri);
          setAvatar(newImageUri); // Cập nhật avatar ngay lập tức
          setImageFile(file);
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setImageUri(newImageUri);
        setAvatar(newImageUri); // Cập nhật avatar ngay lập tức
        setImageFile({
          uri: newImageUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    //mongo
    formData.append('id', user._id);
    //mysql
   // formData.append('id', user.id);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    const localDate = birthday.toLocaleDateString('en-CA');
    formData.append('birthday', localDate);
  
    if (imageFile) {
        formData.append('avatar', imageFile);
    } else {
        formData.append('avatar', avatar);
    }
  
    try {
      const response = await axios.put('http://localhost:3000/update-user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('Thành công');
      console.log(response.data);
      navigation.goBack();
    } catch (error) {
      alert('Lỗi cập nhật user: ' + error.message);
    }
  };  

  return (
    <ScrollView  style={{ width: "100%", height: 500 }}>
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePicker}>
        <Image
          source={{ uri: imageUri || avatar }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Role</Text>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
        >
          <Picker.Item label="Select role" value="" />
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="User" value="User" />
        </Picker>
      </View>

      <View style={[styles.inputContainer, { zIndex: 10 }]}>
        <Text style={styles.label}>Birthday</Text>
        <DatePicker
          selected={birthday}
          onChange={setBirthday}
          dateFormat="yyyy/MM/dd"
          customInput={<TextInput style={styles.input} />}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
});
