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
  StyleSheet
} from 'react-native';

import { styles } from '../Assets/LoginStyle'; 
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';

import ForgotPasswordModal from '../Components/ForgotPassword';
import VerificationModal from '../Components/VerificationModal';
import PasswordReset from '../Components/PasswordReset';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  // CONSOLIDATED STEP STATE
  // 0: None, 1: ForgotEmail, 2: VerifyCode, 3: NewPassword
  const [authStep, setAuthStep] = useState(0);
  const [forgotEmail, setForgotEmail] = useState('');

  // STEP 1 -> 2
  const handleForgotSubmit = (enteredEmail: string) => {
    setForgotEmail(enteredEmail); 
    setAuthStep(2); // Direct switch
  };

  // STEP 2 -> 3
  const handleVerifyCode = (code: string) => {
    console.log("Verified:", code);
    setAuthStep(3); // Direct switch
  };

  // STEP 3 -> Finish
  const handlePasswordUpdate = (newPassword: string) => {
    console.log("Final Password Update received:", newPassword); 
    setAuthStep(0); // Close everything
    setTimeout(() => {
        Alert.alert("Success", "Password updated! You can now login.");
    }, 500);
  };

  const handleLogin = () => {
    if (!email || !password) return Alert.alert("Error", "Fill all fields");
    Alert.alert("Success", "Welcome back!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* CURTAIN OVERLAY: This stays up during the whole process to hide the login screen */}
      {authStep > 0 && (
        <View style={localStyles.fullScreenCurtain} />
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>ChatApp</Text>
            <Text style={styles.subtitle}>Sign in</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail color="#439acc" size={20} style={styles.inputIcon} /> 
                <TextInput
                  placeholder="Enter valid email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                  <Text style={styles.label}>Password</Text>
              </View>
              <View style={styles.inputWrapper}>
                <Lock color="#439acc" size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                  {secureText ? <EyeOff color="#439acc" size={20} /> : <Eye color="#439acc" size={20} />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setAuthStep(1)}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.9}>
              <Text style={styles.loginButtonText}>Sign In</Text>
              <ArrowRight color="#FFF" size={20} style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')} activeOpacity={0.7}>
              <Text style={styles.registerLink}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL COMPONENTS - SWITCHED BY STEP */}
      <ForgotPasswordModal 
        visible={authStep === 1} 
        onClose={() => setAuthStep(0)} 
        onSubmit={handleForgotSubmit}
      />

      <VerificationModal 
        visible={authStep === 2}
        email={forgotEmail}
        title="Reset Password"
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
  fullScreenCurtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#439acc',
    zIndex: 10, // Higher than login UI, lower than Modals
  }
});

export default LoginScreen;