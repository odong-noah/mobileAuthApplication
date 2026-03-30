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
  StyleSheet
} from 'react-native';

import { styles } from '../Assets/RegisterStyle'; 
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationModal from '../Components/VerificationModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [secureText, setSecureText] = useState(true);
  
  // MODAL STATE
  const [isModalVisible, setIsModalVisible] = useState(false);

  // STEP 1: User clicks Register
  const handleRegister = () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    Keyboard.dismiss();
    setIsModalVisible(true); 
  };

  // STEP 2: Verification Successful
  const handleVerifySuccess = (code: string) => {
    console.log("Account verified with code:", code);
    
    setIsModalVisible(false);
    
    // Small timeout ensures modal is closed before showing the alert
    setTimeout(() => {
        Alert.alert("Account Verified", "Your account is now active. Please sign in.");
        navigation.replace('Login');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* CURTAIN OVERLAY: Hides the form while verification is active */}
      {isModalVisible && (
        <View style={localStyles.fullScreenCurtain} />
      )}

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
            {/* USERNAME FIELD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <User color="#439acc" size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter username"
                  placeholderTextColor="#94A3B8"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* EMAIL FIELD */}
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

            {/* PASSWORD FIELD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock color="#439acc" size={20} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter strong password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity 
                  onPress={() => setSecureText(!secureText)} 
                  style={styles.eyeIcon}
                >
                  {secureText ? <EyeOff color="#439acc" size={20} /> : <Eye color="#439acc" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister} 
              activeOpacity={0.9}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
              {/* FIXED: Moved inline marginLeft to localStyles */}
              <ArrowRight color="#FFF" size={20} style={localStyles.buttonIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.replace('Login')}
              activeOpacity={0.7}
            >
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
  fullScreenCurtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#439acc',
    zIndex: 10,
  },
  buttonIcon: {
    marginLeft: 8,
  }
});

export default RegisterScreen;