import { StyleSheet, Platform } from 'react-native';
const COLORS = {
  primary: "#439acc",
  error: "#EF4444",
  placeholder: "#94A3B8",
  white: "#FFF"
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#439acc', 
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: '#edf0f4',
    marginTop: 14,
  },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: '#E2E8F0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    flexDirection: 'row',
    backgroundColor: '#439acc',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 16,
    color: '#fcfdff',
  },
  loginLink: {
    fontSize: 16,
    color: '#0e0e10',
    fontWeight: '700',
  },
  fullScreenCurtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#439acc',
    zIndex: 10,
  },
  buttonIcon: {
    marginLeft: 8,
  },

   inputErrorBorder: {
    borderColor: COLORS.error,
    borderWidth: 1.2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
});