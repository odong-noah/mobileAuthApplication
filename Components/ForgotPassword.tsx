import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { Mail, Lock, Key, X} from 'lucide-react-native';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ visible, onClose }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    if (!email.includes('@')) return Alert.alert("Invalid Email", "Please enter a valid email address.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (code.length !== 4) return Alert.alert("Error", "Please enter the 4-digit code.");
    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) return Alert.alert("Error", "Password must be at least 6 characters.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Password updated successfully!");
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setCode('');
    setNewPassword('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={modalStyles.overlay}>
        {/* Match status bar to the background color when modal is open */}
        <StatusBar backgroundColor="#439acc" barStyle="light-content" />
        
        <View style={modalStyles.container}>
          <TouchableOpacity style={modalStyles.closeBtn} onPress={handleClose}>
            <X color="#94A3B8" size={24} />
          </TouchableOpacity>

          {step === 1 && (
            <View style={modalStyles.content}>
              <View style={modalStyles.iconCircle}><Mail color="#439acc" size={30} /></View>
              <Text style={modalStyles.title}>Forgot Password</Text>
              <Text style={modalStyles.description}>Enter your email to receive a 4-digit reset code.</Text>
              
              <TextInput 
                style={modalStyles.input} 
                placeholder="Email address" 
                placeholderTextColor="#94A3B8"
                value={email} 
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TouchableOpacity style={modalStyles.primaryBtn} onPress={handleVerifyEmail}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={modalStyles.btnText}>Send Code</Text>}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={modalStyles.content}>
              <View style={modalStyles.iconCircle}><Key color="#439acc" size={30} /></View>
              <Text style={modalStyles.title}>Verify Email</Text>
              <Text style={modalStyles.description}>Enter the 4-digit code sent to {email}</Text>
              
              <TextInput 
                style={[modalStyles.input, { textAlign: 'center', fontSize: 28, letterSpacing: 10 }]} 
                placeholder="0000" 
                placeholderTextColor="#CBD5E1"
                value={code} 
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={4}
              />
              
              <TouchableOpacity style={modalStyles.primaryBtn} onPress={handleVerifyCode}>
                <Text style={modalStyles.btnText}>Verify Code</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={modalStyles.content}>
              <View style={modalStyles.iconCircle}><Lock color="#439acc" size={30} /></View>
              <Text style={modalStyles.title}>New Password</Text>
              <Text style={modalStyles.description}>Set a new password for your account.</Text>
              
              <TextInput 
                style={modalStyles.input} 
                placeholder="New Password" 
                placeholderTextColor="#94A3B8"
                value={newPassword} 
                onChangeText={setNewPassword}
                secureTextEntry
              />
              
              <TouchableOpacity style={modalStyles.primaryBtn} onPress={handleResetPassword}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={modalStyles.btnText}>Update Password</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: '#439acc', // Your specific brand color
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    width: '88%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 30, 
    padding: 24, 
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  closeBtn: { 
    alignSelf: 'flex-end',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 20
  },
  content: { alignItems: 'center', paddingBottom: 10 },
  iconCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#E0F2FE', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  description: { textAlign: 'center', color: '#64748B', marginTop: 10, marginBottom: 25, fontSize: 15, lineHeight: 22 },
  input: { 
    width: '100%', 
    backgroundColor: '#F8FAFC', 
    borderRadius: 16, 
    padding: 18, 
    fontSize: 16, 
    color: '#1E293B', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0' 
  },
  primaryBtn: { 
    backgroundColor: '#439acc', 
    width: '100%', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#439acc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default ForgotPasswordModal;