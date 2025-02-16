import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {NativeModules, Platform, I18nManager} from 'react-native';
import {storeData, getData} from './utils/storageUtils';

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
      'Login Your Account': 'تسجيل الدخول',
      'Enter Your Email': 'ادخل بريدك الالكتروني',
      'Enter Your Password': 'ادخل كلمة المرور',
      'Forgot Password?': 'هل نسيت كلمة المرور؟',
      Login: 'دخول',
      'Create New Account?': 'إنشاء حساب جديد؟',
      'Send Reset Link': 'إرسال رابط إعادة التعيين',
      'Reset Your Password': 'إعادة تعيين كلمة المرور',
      Profile: 'حسابي',
      Language: 'اللغة',
      'Edit Information': 'تعديل المعلومات',
      'Full Name': 'الاسم الكامل',
      Password: 'كلمة المرور',
      Save: 'حفظ',
      Edit: 'تعديل',
      Notifications: 'الإشعارات',
      Success: 'نجاح',
      'Your information has been successfully saved.': 'تم حفظ معلوماتك بنجاح.',
      Logout: 'تسجيل خروج',
      'Enter Your Email or KSU ID': 'ادخل بريدك الالكتروني او الرقم الجامعي',
      'Dark Mode': 'الوضع الليلي',
      'Remember me': 'تذكرني',
      Register: 'تسجيل',
      'Create Your Account': 'أنشئ حساب جديد',
      'Already Have an Account?': 'لديك حساب بالفعل؟',
      'Continue With King Saud University ID': 'أكمل باستخدام الرقم الجامعي',
      'Enter Your KSU ID': 'ادخل رقمك الجامعي',
      '': '',
      '': '',
      '': '',
      '': '',
    },
  },
};

const setRTL = async lang => {
  const shouldBeRTL = lang === 'ar'; // Only check for Arabic

  if (shouldBeRTL !== I18nManager.isRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    I18nManager.allowRTL(shouldBeRTL);
  }
};

// Initialize i18n
const initializeI18n = async () => {
  try {
    const storedLang = await getData('userLanguage');
    const selectedLanguage = storedLang || getDeviceLanguage();

    await i18n.use(initReactI18next).init({
      resources,
      lng: selectedLanguage,
      fallbackLng: 'en',
      interpolation: {escapeValue: false},
    });
    await setRTL(selectedLanguage);
  } catch (error) {
    console.error('Error initializing i18n:', error);
  }
};

// Run i18n initialization before exporting
initializeI18n();

export const switchLanguage = async navigation => {
  const lang = i18n.language === 'en' ? 'ar' : 'en';
  await i18n.changeLanguage(lang);
  await storeData('userLanguage', lang);

  const shouldBeRTL = lang === 'ar';

  if (shouldBeRTL !== I18nManager.isRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    I18nManager.allowRTL(shouldBeRTL);
  }
};

export default i18n;
