import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform, I18nManager } from 'react-native';
import { storeData, getData } from './utils/storageUtils';

const getDeviceLanguage = () => {
  let deviceLanguage = 'en'; // Default to English

  if (Platform.OS === 'ios') {
    deviceLanguage =
      NativeModules.SettingsManager?.settings?.AppleLocale || // Older iOS
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || // Newer iOS
      'en';
  } else if (Platform.OS === 'android') {
    deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
  }

  return deviceLanguage.split('-')[0]; // e.g. 'en' from 'en-US'
};

const resources = {
  en: {
    translation: {
      // Existing keys
      Welcome_to_Aoun: 'Welcome to Aoun',
      'Log in': 'Log in',
      'Sign up': 'Sign up',
      'Continue as Guest': 'Continue as Guest',
      'Login Your Account': 'Login Your Account',
      'Enter Your Email': 'Enter Your Email',
      'Enter Your Password': 'Enter Your Password',
      'Forgot Password?': 'Forgot Password?',
      Login: 'Login',
      'Create New Account?': 'Create New Account?',
      'Send Reset Link': 'Send Reset Link',
      'Reset Your Password': 'Reset Your Password',
      Profile: 'Profile',
      Language: 'Language',
      'Edit Information': 'Edit Information',
      'Full Name': 'Full Name',
      Password: 'Password',
      Save: 'Save',
      Edit: 'Edit',
      Notifications: 'Notifications',
      Success: 'Success',
      'Your information has been successfully saved.':
        'Your information has been successfully saved.',
      Logout: 'Logout',
      'Enter Your Email or KSU ID': 'Enter Your Email or KSU ID',
      'Dark Mode': 'Dark Mode',
      'Remember me': 'Remember me',
      Register: 'Register',
      'Create Your Account': 'Create Your Account',
      'Already Have an Account?': 'Already Have an Account?',
      'Continue With King Saud University ID': 'Continue With King Saud University ID',
      'Enter Your KSU ID': 'Enter Your KSU ID',

      // New keys for tasks
      'Create New Task': 'Create New Task',
      'Name': 'Name',
      'Description': 'Description',
      'Start Time': 'Start Time',
      'End Time': 'End Time',
      'Priority': 'Priority',
      'High': 'High',
      'Medium': 'Medium',
      'Low': 'Low',
      'Create Task': 'Create Task',
      'Invalid Time': 'Invalid Time',
      'End time cannot be before start time. It has been adjusted.':
        'End time cannot be before start time. It has been adjusted.',
      "You have got {{count}} tasks today to complete":
        "You have got {{count}} tasks today to complete",
      "Today's Tasks": "Today's Tasks",
      "Tasks": "Tasks",
      "No tasks for this date.": "No tasks for this date.",
      "Task": "Task",
      "Task updated successfully!": "Task updated successfully!",
      "Title": "Title",

      // Add more as needed
    },
  },
  ar: {
    translation: {
      // Existing Arabic keys
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

      // New Arabic keys for tasks
      'Create New Task': 'إنشاء مهمة جديدة',
      'Name': 'الاسم',
      'Description': 'الوصف',
      'Start Time': 'وقت البداية',
      'End Time': 'وقت النهاية',
      'Priority': 'الأولوية',
      'High': 'عالية',
      'Medium': 'متوسطة',
      'Low': 'منخفضة',
      'Create Task': 'إنشاء المهمة',
      'Invalid Time': 'وقت غير صالح',
      'End time cannot be before start time. It has been adjusted.':
        'لا يمكن أن يكون وقت النهاية قبل وقت البداية. تم التعديل.',
      "You have got {{count}} tasks today to complete":
        "لديك {{count}} مهام لإنجازها اليوم",
      "Today's Tasks": 'مهام اليوم',
      "Tasks": 'مهام',
      "No tasks for this date.": 'لا توجد مهام لهذا التاريخ.',
      "Task": "المهمة",
      "Task updated successfully!": "تم تحديث المهمة بنجاح!",
      "Title": "العنوان",

      // Add more as needed
    },
  },
};

const setRTL = async (lang) => {
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
      interpolation: { escapeValue: false },
    });
    await setRTL(selectedLanguage);
  } catch (error) {
    console.error('Error initializing i18n:', error);
  }
};

// Run i18n initialization before exporting
initializeI18n();

export const switchLanguage = async (navigation) => {
  const lang = i18n.language === 'en' ? 'ar' : 'en';
  await i18n.changeLanguage(lang);
  await storeData('userLanguage', lang);

  const shouldBeRTL = lang === 'ar';

  if (shouldBeRTL !== I18nManager.isRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    I18nManager.allowRTL(shouldBeRTL);
  }

  // If needed, you can forcibly reload the app or reset navigation
  // navigation.reset({ ... }) or a prompt to restart
};

export default i18n;
