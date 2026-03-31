import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#439acc', // Light Slate background to make the white card "pop"
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
    marginBottom: 32,
  },
 
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A', // Very dark slate
    letterSpacing: -0.5,
    marginBottom:8,
  },
  subtitle: {
    fontSize: 20,
    color: '#e6eaef',
    marginTop: 6,
  },
  // --- THE CARD ---
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    // Professional Shadow
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10, // For Android
    borderWidth: Platform.OS === 'ios' ? 0 : 1, // Subtle border for Android
    borderColor: '#E2E8F0',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
    marginBottom:14,
  },
  forgotText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    marginTop:16,
    marginLeft:205,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Slightly greyed out input
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
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#439acc',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    // Indigo shadow
    shadowColor: '#466ee5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#eff2f5',
  },
  registerLink: {
    fontSize: 16,
    color: '#040311',
    fontWeight: '700',
  },

   fullScreenCurtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#439acc',
    zIndex: 10,
  },
  // NEW STYLE: Added to resolve the ESLint warning
  buttonIcon: {
    marginLeft: 8,
  }
});