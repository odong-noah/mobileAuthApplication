import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
  ActivityIndicator, // Added for loading spinner
} from 'react-native';

import { styles } from '../Assets/RegisterStyle'; 
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationModal from '../Components/VerificationModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const COLORS = {
  primary: "#439acc",
  error: "#EF4444",
  placeholder: "#94A3B8",
  white: "#FFF"
};

const ErrorLabel = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <View style={styles.errorContainer}>
      <AlertCircle color={COLORS.error} size={14} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State for API loading
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  // VALIDATION LOGIC
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    const usernameRegex = /^[A-Za-z]{4,}$/;
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!usernameRegex.test(username.trim())) {
      newErrors.username = "At least 4 letters, no numbers or symbols";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Mix of Upper, Lower, numbers and special characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API CALL LOGIC
  const handleRegister = async () => {
    const isAllEmpty = !username.trim() && !email.trim() && !password.trim();

    if (isAllEmpty) {
      Alert.alert("Registration Failed", "All fields are empty. Please enter your details.");
      return;
    }

    if (validateForm()) {
      Keyboard.dismiss();
      setIsLoading(true);

      try {
        // Handle IP based on platform (10.0.2.2 for Android Emulator, 127.0.0.1 for iOS)
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
        
        const response = await fetch(`${baseUrl}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        });

        const result = await response.json();

        if (response.status === 201) {
          // Success: Firebase Account Created via Laravel
          setIsModalVisible(true); 
        } else if (response.status === 422) {
          // Backend Validation Failed (e.g. email already exists in Firebase)
          const backendErrors = result.errors;
          const firstError = Object.values(backendErrors)[0] as string[];
          Alert.alert("Invalid Input", firstError[0]);
        } else {
          // Other Server Errors
          Alert.alert("Error", result.message || "An unexpected error occurred.");
        }
      } catch {
        Alert.alert("Connection Error", "Could not connect to the server. Ensure Laravel is running.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifySuccess = (code: string) => {
    console.log("Verification Successful! Security Code:", code);
    setIsModalVisible(false);
    setTimeout(() => {
        Alert.alert("Success", "Account Verified!");
        navigation.replace('Login');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {isModalVisible && <View style={styles.fullScreenCurtain} />}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>ChatApp</Text>
            <Text style={styles.subtitle}>Sign up</Text>
          </View>

          <View style={styles.card}>
            
            {/* USERNAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrapper, errors.username ? styles.inputErrorBorder : null]}>
                <User color={errors.username ? COLORS.error : COLORS.primary} size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter username"
                  placeholderTextColor={COLORS.placeholder}
                  value={username}
                  editable={!isLoading}
                  onChangeText={(val) => {
                    setUsername(val);
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>
              <ErrorLabel message={errors.username} />
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email ? styles.inputErrorBorder : null]}>
                <Mail color={errors.email ? COLORS.error : COLORS.primary} size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter valid email"
                  placeholderTextColor={COLORS.placeholder}
                  value={email}
                  editable={!isLoading}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <ErrorLabel message={errors.email} />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputErrorBorder : null]}>
                <Lock color={errors.password ? COLORS.error : COLORS.primary} size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter strong password"
                  placeholderTextColor={COLORS.placeholder}
                  value={password}
                  editable={!isLoading}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  style={styles.input}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity 
                    onPress={() => setSecureText(!secureText)} 
                    style={styles.eyeIcon}
                    disabled={isLoading}
                >
                  {secureText ? <EyeOff color={COLORS.primary} size={20} /> : <Eye color={COLORS.primary} size={20} />}
                </TouchableOpacity>
              </View>
              <ErrorLabel message={errors.password} />
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, isLoading && { opacity: 0.7 }]} 
              onPress={handleRegister} 
              activeOpacity={0.9}
              disabled={isLoading}
            >
              {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
              ) : (
                  <>
                    <Text style={styles.registerButtonText}>Create Account</Text>
                    <ArrowRight color={COLORS.white} size={20} style={styles.buttonIcon} />
                  </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')} disabled={isLoading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal 
        visible={isModalVisible} 
        email={email} 
        title="Verify Account" 
        onClose={() => setIsModalVisible(false)} 
        onVerify={handleVerifySuccess} 
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;