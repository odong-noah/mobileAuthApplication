import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Keyboard
} from 'react-native';
import { ShieldCheck, X, } from 'lucide-react-native';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onVerify: (code: string) => void;
}

const VerificationModal = ({ visible, onClose, email, onVerify }: VerificationModalProps) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  
  // Pre-allocate the array to avoid indexing errors
  const inputs = useRef<Array<TextInput | null>>([null, null, null, null]);

  useEffect(() => {
    if (visible) {
      setCode(['', '', '', '']);
      setTimer(59);
      // Give the modal 200ms to animate in before popping keyboard
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 200);
    }
  }, [visible]);

  useEffect(() => {
    let interval: any;
    if (visible && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [visible, timer]);

  const handleInput = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1); 
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length === 4) {
      Keyboard.dismiss();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onVerify(fullCode);
      }, 1000);
    }
  };

  return (
    <Modal 
      visible={visible} 
      animationType="fade" // Use fade for faster perceived response
      transparent={true} 
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* We move StatusBar here to ensure it doesn't conflict with Modal render */}
        {visible && <StatusBar backgroundColor="#439acc" barStyle="light-content" />}
        
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color="#94A3B8" size={24} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <ShieldCheck color="#439acc" size={36} />
            </View>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.description}>Sent to {email || 'your email'}</Text>

            <View style={styles.otpRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  // FIX: Use curly braces so the function returns VOID (Standard React/TS requirement)
                  ref={(el) => { 
                    inputs.current[index] = el; 
                  }}
                  style={[styles.otpBox, digit ? styles.otpBoxActive : null]}
                  maxLength={1}
                  keyboardType="number-pad"
                  onChangeText={(text) => handleInput(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  value={digit}
                />
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.primaryBtn, { opacity: code.join('').length === 4 ? 1 : 0.6 }]} 
              onPress={handleSubmit}
              disabled={loading || code.join('').length < 4}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Verify Account</Text>}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>Resend in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={() => setTimer(59)}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#439acc', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', backgroundColor: '#FFFFFF', borderRadius: 30, padding: 24, elevation: 10 },
  closeBtn: { alignSelf: 'flex-end', backgroundColor: '#F8FAFC', padding: 6, borderRadius: 20 },
  content: { alignItems: 'center' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  description: { textAlign: 'center', color: '#64748B', marginBottom: 25 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  otpBox: { width: 60, height: 65, backgroundColor: '#F8FAFC', borderRadius: 15, borderWidth: 1.5, borderColor: '#E2E8F0', fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1E293B' },
  otpBoxActive: { borderColor: '#439acc', borderWidth: 2, backgroundColor: '#FFF' },
  primaryBtn: { backgroundColor: '#439acc', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  resendContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  resendText: { color: '#64748B', fontSize: 14 },
  timerText: { color: '#1E293B', fontWeight: '700', fontSize: 14 },
  resendLink: { color: '#439acc', fontWeight: '800', fontSize: 14 },
});

export default VerificationModal;