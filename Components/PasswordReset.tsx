import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Lock, X, Eye, EyeOff } from 'lucide-react-native';

interface PasswordResetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const PasswordReset = ({ visible, onClose, onSubmit }: PasswordResetProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [visible]);

  const handleReset = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSubmit(password);
    }, 1500);
  };

  // Logic helper for button state
  const isFormValid = password && confirmPassword && !loading;

  return (
    <Modal 
      visible={visible} 
      animationType="fade" 
      transparent={true} 
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {visible && <StatusBar backgroundColor="#439acc" barStyle="light-content" />}
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color="#94A3B8" size={24} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Lock color="#439acc" size={36} />
            </View>
            
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.description}>
              Please enter and confirm your{"\n"}new secure password.
            </Text>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, password ? styles.inputActive : null]}
                placeholder="New Password"
                placeholderTextColor="#CBD5E1"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => { setPassword(text); setError(''); }}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, confirmPassword ? styles.inputActive : null]}
                placeholder="Confirm New Password"
                placeholderTextColor="#CBD5E1"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              // FIXED: Removed the inline style object { opacity: ..., marginTop: ... }
              style={[
                styles.primaryBtn, 
                !isFormValid && styles.btnDisabled
              ]} 
              onPress={handleReset}
              disabled={!isFormValid}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: '#439acc', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    width: '90%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 30, 
    padding: 24, 
    elevation: 10 
  },
  closeBtn: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#F8FAFC', 
    padding: 6, 
    borderRadius: 20 
  },
  content: { 
    alignItems: 'center' 
  },
  iconCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#E0F2FE', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#0F172A' 
  },
  description: { 
    textAlign: 'center', 
    color: '#64748B', 
    marginBottom: 25, 
    fontSize: 14, 
    lineHeight: 20 
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1E293B',
  },
  inputActive: { 
    borderColor: '#439acc', 
    backgroundColor: '#FFF' 
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 15,
    fontWeight: '600'
  },
  primaryBtn: { 
    backgroundColor: '#439acc', 
    width: '100%', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    marginTop: 10 // FIXED: Moved from inline style
  },
  // NEW STYLE: For the disabled/loading button state
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});

export default PasswordReset;