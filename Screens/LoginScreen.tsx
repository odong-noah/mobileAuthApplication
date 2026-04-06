import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar, ActivityIndicator, StyleSheet, Keyboard
} from 'react-native';

import { styles } from '../Assets/LoginStyle'; 
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import ForgotPasswordModal from '../Components/ForgotPassword';
import VerificationModal from '../Components/VerificationModal';
import PasswordReset from '../Components/PasswordReset';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const COLORS = {
  primary: "#439acc",
  white: "#FFF",
  overlay: "rgba(0,0,0,0.6)"
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // AUTH STATES
  const [authStep, setAuthStep] = useState(0); // 0: Login, 1: Forgot, 2: OTP, 3: Reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');

  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

  // Clear fields when entering screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setEmail('');
        setPassword('');
        setIsLoading(false);
      };
    }, [])
  );

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setForgotEmail('');
    setVerifiedOtp('');
  };

  // --- API LOGIC: LOGIN ---
  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) return Alert.alert("Error", "Please fill in all fields.");
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.status === 200) {
        resetForm();
        Alert.alert("Success", "Login successful!");
        // navigation.replace('Home'); // Uncomment when Home screen is ready
      } else {
        Alert.alert("Login Failed", result.message || "Check your credentials.");
      }
    } catch {
      Alert.alert("Connection Error", "Check your backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORGOT PASS STEP 1: Request OTP ---
  const handleForgotSubmit = async (enteredEmail: string) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: enteredEmail, type: 'reset' }),
      });
      const result = await response.json();

      if (response.ok) {
        setForgotEmail(enteredEmail);
        setAuthStep(2);
      } else {
        Alert.alert("Error", result.message || "Email not found.");
      }
    } catch {
      Alert.alert("Error", "Network request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORGOT PASS STEP 2: Verify Code ---
  const handleVerifyCode = (code: string) => {
    setVerifiedOtp(code);
    setAuthStep(3);
  };

  // --- FORGOT PASS STEP 3: Final Reset ---
  const handlePasswordUpdate = async (newPassword: string) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
            email: forgotEmail, 
            otp: verifiedOtp, 
            password: newPassword 
        }),
      });

      if (response.ok) {
        setAuthStep(0);
        resetForm();
        setTimeout(() => Alert.alert("Success", "Password updated! Please login."), 500);
      } else {
        const result = await response.json();
        Alert.alert("Reset Failed", result.message || "Invalid requirements.");
      }
    } catch {
      Alert.alert("Error", "Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {authStep > 0 && <View style={localStyles.overlay} />}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>ChatApp</Text>
            <Text style={styles.subtitle}>Sign in</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail color={COLORS.primary} size={20} style={styles.inputIcon} /> 
                <TextInput
                  placeholder="Enter email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock color={COLORS.primary} size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  style={styles.input}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity 
                    onPress={() => setSecureText(!secureText)} 
                    disabled={isLoading}
                    style={styles.eyeIcon}
                >
                  {secureText ? <EyeOff color={COLORS.primary} size={20} /> : <Eye color={COLORS.primary} size={20} />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setAuthStep(1)} disabled={isLoading}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && localStyles.btnDisabled]} 
              onPress={handleLogin} 
              disabled={isLoading}
            >
              {isLoading && authStep === 0 ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <ArrowRight color={COLORS.white} size={20} style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')} disabled={isLoading}>
              <Text style={styles.registerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordModal 
        visible={authStep === 1} 
        onClose={() => setAuthStep(0)} 
        onSubmit={handleForgotSubmit} 
      />
      
      <VerificationModal 
        visible={authStep === 2} 
        email={forgotEmail} 
        title="Verify Email" 
        onClose={() => setAuthStep(0)} 
        onVerify={handleVerifyCode} 
      />
      
      <PasswordReset 
        visible={authStep === 3} 
        onClose={() => setAuthStep(0)} 
        onSubmit={handlePasswordUpdate} 
      />
      
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  btnDisabled: { 
    opacity: 0.7 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: COLORS.overlay, 
    zIndex: 1 
  }
});

export default LoginScreen;