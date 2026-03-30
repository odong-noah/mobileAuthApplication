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
import { Mail, X } from 'lucide-react-native';

// FIX 1: Add onSubmit to the interface to remove the red line in LoginScreen
interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void; // This is the missing piece
}

const ForgotPasswordModal = ({ visible, onClose, onSubmit }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    // Basic validation
    if (!email.includes('@')) {
      return Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    setLoading(true);
    
    // Simulate API call to send code
    setTimeout(() => {
      setLoading(false);
      
      // FIX 2: Instead of setStep(2), we call onSubmit to trigger the next modal in LoginScreen
      onSubmit(email); 
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleClose}>
      <View style={modalStyles.overlay}>
        <StatusBar backgroundColor="#439acc" barStyle="light-content" />
        
        <View style={modalStyles.container}>
          <TouchableOpacity style={modalStyles.closeBtn} onPress={handleClose}>
            <X color="#94A3B8" size={24} />
          </TouchableOpacity>

          <View style={modalStyles.content}>
            <View style={modalStyles.iconCircle}>
              <Mail color="#439acc" size={30} />
            </View>
            <Text style={modalStyles.title}>Forgot Password</Text>
            <Text style={modalStyles.description}>
              Enter the email address associated with your account to receive a reset code.
            </Text>
            
            <TextInput 
              style={[modalStyles.input, email ? {borderColor: '#439acc'} : null]} 
              placeholder="Email address" 
              placeholderTextColor="#94A3B8"
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TouchableOpacity 
              style={[modalStyles.primaryBtn, { opacity: email ? 1 : 0.7 }]} 
              onPress={handleVerifyEmail}
              disabled={loading || !email}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={modalStyles.btnText}>Send Code</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(67, 154, 204, 0.98)', // Using your brand color with slight transparency
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    width: '88%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 30, 
    padding: 24, 
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
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default ForgotPasswordModal;