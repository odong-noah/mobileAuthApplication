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
  StatusBar
} from 'react-native';

import { styles } from '../Assets/LoginStyle.tsx'; 
// Note: If ArrowRight still causes an error, change it to ChevronRight
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import ForgotPasswordModal from '../Components/ForgotPassword.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("Success", "Welcome back!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
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

              {/* FIXED TYPO HERE: setIsModalVisible */}
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
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
            <TouchableOpacity 
              onPress={() => navigation.replace('Register')} 
              activeOpacity={0.7} 
            >
              <Text style={styles.registerLink}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ADDED THE MODAL COMPONENT HERE */}
      <ForgotPasswordModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
      
    </SafeAreaView>
  );
};

export default LoginScreen;