import React, { useState, useCallback } from 'react';
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
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { styles } from '../Assets/RegisterStyle'; 
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationModal from '../Components/VerificationModal';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const COLORS = {
  primary: "#439acc",
  error: "#EF4444",
  placeholder: "#94A3B8",
  white: "#FFF"
};

/**
 * Helper component for error messages (Moved outside for performance)
 */
const ErrorLabel = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <View style={localStyles.errorLabelContainer}>
      <AlertCircle color={COLORS.error} size={14} />
      <Text style={localStyles.errorLabelText}>{message}</Text>
    </View>
  );
};

const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Clears fields when the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setErrors({});
      };
    }, [])
  );

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setErrors({});
  };

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
      newErrors.password = "Must include Upper, Lower, Number & Special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleRegisterInitiate = async () => {
    const isAllEmpty = !username.trim() && !email.trim() && !password.trim();

    if (isAllEmpty) {
      Alert.alert("Registration Failed", "All fields are empty.");
      return;
    }

    if (validateForm()) {
      Keyboard.dismiss();
      setIsLoading(true);

      try {
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
        
        const response = await fetch(`${baseUrl}/api/send-otp`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
          },
          // FIX: Add the 'type' field here
          body: JSON.stringify({ 
            email: email,
            type: 'register' 
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setIsModalVisible(true); 
        } else {
          // If status is 422 (Validation error), Laravel returns specific messages
          const errorMessage = result.message || result.errors?.email?.[0] || "Could not send verification code.";
          Alert.alert("Error", errorMessage);
        }
      } catch{
        Alert.alert("Connection Error", "Ensure Laravel is running.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifySuccess = async (code: string) => {
    setIsLoading(true);
    try {
      const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
      
      // We send all credentials + the OTP for final verification and storage
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username, email, password, otp: code }),
      });

      const result = await response.json();

      if (response.status === 201) {
        setIsModalVisible(false);
        resetForm(); // Clear fields
        setTimeout(() => {
          Alert.alert("Success", "Account Verified & Created!");
          navigation.replace('Login');
        }, 500);
      } else {
        Alert.alert("Verification Failed", result.message || "Invalid Code.");
      }
    } catch  {
      Alert.alert("Error", "Final registration failed.");
    } finally {
      setIsLoading(false);
    }
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
              <View style={[styles.inputWrapper, errors.username ? localStyles.inputError : null]}>
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
              <View style={[styles.inputWrapper, errors.email ? localStyles.inputError : null]}>
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
              <View style={[styles.inputWrapper, errors.password ? localStyles.inputError : null]}>
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
              style={[styles.registerButton, isLoading && localStyles.btnDisabled]} 
              onPress={handleRegisterInitiate} 
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

const localStyles = StyleSheet.create({
  errorLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  errorLabelText: {
    color: COLORS.error,
    fontSize: 12,
    marginLeft: 4,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  }
});

export default RegisterScreen;