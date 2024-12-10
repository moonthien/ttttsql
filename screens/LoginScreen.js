import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    
    // Hàm xử lý khi nhấn nút Login
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password,
            });
            if (response.status === 200) {
                const user = response.data.user;
                if (user.role === 'Admin') {
                    navigation.navigate("UserScreen", { admin: user });
                } else {
                    navigation.navigate("Screen01", { user: user });
                }
            } else {
                alert('Vai trò không hợp lệ.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
            } else {
                alert('Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.');
            }
        }
    };   
    
    // const handleLogin = async () => {
    //     try {
    //       // Fetch users from the mock API
    //       const response = await axios.get('https://6758aeda60576a194d1177c4.mockapi.io/oncuoiki');
    //       const users = response.data;
    
    //       // Find user by email and password
    //       const user = users.find(u => u.email === email && u.password === password);
    
    //       if (user) {
    //         if (user.role === 'Admin') {
    //             navigation.navigate("UserScreen", { admin: user });
    //         } else if (user.role === 'User') {
    //             navigation.navigate("Screen01", { user: user });
    //         }
    //       } else {
    //         alert('Invalid credentials', 'Please check your email or password');
    //       }
    //     } catch (error) {
    //       console.error('Login error:', error);
    //       alert('Error', 'An error occurred while logging in');
    //     }
    //   };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/DATA/Image20.png')} style={styles.logo} />
            <View style={styles.contentContainer}>
                <Text style={styles.welcomeText}>Welcome!</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.inputContainer, isFocusedEmail && styles.inputContainerFocused]}>
                        <Image source={require('../assets/DATA/Vector.png')} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter email"
                            placeholderTextColor="#aaa"
                            keyboardType="email-address"
                            onFocus={() => setIsFocusedEmail(true)}
                            onBlur={() => setIsFocusedEmail(false)}
                            onChangeText={setEmail}
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.inputContainer, isFocusedPassword && styles.inputContainerFocused]}>
                        <Image source={require('../assets/DATA/lock.png')} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            onFocus={() => setIsFocusedPassword(true)}
                            onBlur={() => setIsFocusedPassword(false)}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                >
                    <FontAwesome name="arrow-left" size={20} color="#00bdd6" />
                    <Text style={styles.backButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 0,
        paddingTop: 50,
    },
    logo: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
    },
    contentContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 135,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        alignSelf: 'flex-start',
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bababa',
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    inputContainerFocused: {
        borderColor: 'black',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        outlineWidth: 0,
    },
    button: {
        width: '100%',
        backgroundColor: '#00bdd6',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: '#00bdd6',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default LoginScreen;
