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
// CHANGED: RefreshCcw to RefreshCw (or RotateCw)
import { ShieldCheck, X, RefreshCw } from 'lucide-react-native';

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
  
  const inputs = useRef<Array<TextInput | null>>([null, null, null, null]);

  useEffect(() => {
    if (visible) {
      setCode(['', '', '', '']);
      setTimer(59);
      const focusTimeout = setTimeout(() => {
        inputs.current[0]?.focus();
      }, 300);
      return () => clearTimeout(focusTimeout);
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
      animationType="fade" 
      transparent={true} 
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
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
            <Text style={styles.description}>
              Enter the code sent to{"\n"}
              <Text style={styles.emailText}>{email || 'your email'}</Text>
            </Text>

            <View style={styles.otpRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => { inputs.current[index] = el; }} 
                  style={[styles.otpBox, digit ? styles.otpBoxActive : null]}
                  maxLength={1}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor="#CBD5E1"
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
                <TouchableOpacity onPress={() => setTimer(59)} style={styles.resendBtn}>
                   {/* UPDATED ICON USAGE HERE */}
                  <RefreshCw size={14} color="#439acc" style={{marginRight: 5}} />
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
  description: { textAlign: 'center', color: '#64748B', marginBottom: 25, fontSize: 14, lineHeight: 20 },
  emailText: { fontWeight: '700', color: '#1E293B' },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  otpBox: {
    width: 60,
    height: 65,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  otpBoxActive: { borderColor: '#439acc', backgroundColor: '#FFF', borderWidth: 2 },
  primaryBtn: { backgroundColor: '#439acc', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  resendContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  resendText: { color: '#64748B', fontSize: 14 },
  timerText: { color: '#1E293B', fontWeight: '700', fontSize: 14 },
  resendBtn: { flexDirection: 'row', alignItems: 'center' }, // Added to center icon and text
  resendLink: { color: '#439acc', fontWeight: '800', fontSize: 14 },
});

export default VerificationModal;