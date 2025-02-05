import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager, NativeModules, Platform} from 'react-native';

// Get the device language safely
const getDeviceLanguage = () => {
  let deviceLanguage = 'en'; // Default to English

  if (Platform.OS === 'ios') {
    deviceLanguage =
      NativeModules.SettingsManager?.settings?.AppleLocale || // Older iOS versions
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || // Newer iOS versions
      'en';
  } else if (Platform.OS === 'android') {
    deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
  }

  return deviceLanguage.split('-')[0]; // Extract "en" from "en-US"
};

const languageCode = getDeviceLanguage();

const resources = {
  en: {
    translation: {
      Welcome_to_Aoun: 'Welcome to Aoun',
    },
  },
  ar: {
    translation: {
      'Welcome to \nAoun': 'مرحبًا بك في عون',
      'Log in': 'تسجيل الدخول',
      'Sign up': 'تسجيل',
      'Continue as Guest': 'المتابعة كزائر',
      'Login Your Account': 'سجل الدخول لحسابك',
      'Enter Your Email': 'ادخل بريدك الالكتروني',
      'Enter Your Password': 'ادخل كلمة المرور',
      'Forgot Password?': 'هل نسيت كلمة المرور؟',
      'Login': 'تسجيل',
      'Create New Account?': 'إنشاء حساب جديد؟',
      'Send Reset Link': 'إرسال رابط إعادة التعيين',
      'Reset Your Password': 'إعادة تعيين كلمة المرور',
      'Profile': 'حسابي',
      'Language': 'اللغة',
      'Edit Information': 'تعديل المعلومات',
      'Full Name': 'الاسم الكامل',
      'Password': 'كلمة المرور',
      'Save': 'حفظ',
      'Edit': 'تعديل',
      'Notifications': 'الإشعارات',
      'Success': 'نجاح',
      'Your information has been successfully saved.': 'تم حفظ معلوماتك بنجاح.',
      'Logout': 'تسجيل خروج',
    }
    

  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: languageCode, // Use the device language as default
  fallbackLng: 'en', // Fallback to English if the language is not supported
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

export default i18n;
