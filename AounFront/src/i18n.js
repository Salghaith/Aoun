import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {NativeModules, Platform, I18nManager} from 'react-native';
import {storeData, getData} from './utils/storageUtils';
import RNRestart from 'react-native-restart';

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
      'Continue With King Saud University ID':
        'Continue With King Saud University ID',
      'Enter Your KSU ID': 'Enter Your KSU ID',

      // New keys for tasks
      'Create New Task': 'Create New Task',
      Name: 'Name',
      Description: 'Description',
      'Start Time': 'Start Time',
      'End Time': 'End Time',
      Priority: 'Priority',
      High: 'High',
      Medium: 'Medium',
      Low: 'Low',
      'Create Task': 'Create Task',
      'Invalid Time': 'Invalid Time',
      'End time cannot be before start time. It has been adjusted.':
        'End time cannot be before start time. It has been adjusted.',
      'You have got {{count}} tasks today to complete':
        'You have got {{count}} tasks today to complete',
      "Today's Tasks": "Today's Tasks",
      Tasks: 'Tasks',
      'No tasks for this date.': 'No tasks for this date.',
      Task: 'Task',
      'Task updated successfully!': 'Task updated successfully!',
      Title: 'Title',

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
      Name: 'الاسم',
      Description: 'الوصف',
      'Start Time': 'وقت البداية',
      'End Time': 'وقت النهاية',
      Priority: 'الأولوية',
      High: 'عالية',
      Medium: 'متوسطة',
      Low: 'منخفضة',
      'Create Task': 'إنشاء المهمة',
      'Invalid Time': 'وقت غير صالح',
      'End time cannot be before start time. It has been adjusted.':
        'لا يمكن أن يكون وقت النهاية قبل وقت البداية. تم التعديل.',
      'You have got {{count}} tasks today to complete':
        'لديك {{count}} مهام لإنجازها اليوم',
      "Today's Tasks": 'مهام اليوم',
      Tasks: 'مهام',
      'No tasks for this date.': 'لا توجد مهام لهذا التاريخ.',
      Task: 'المهمة',
      'Task updated successfully!': 'تم تحديث المهمة بنجاح!',
      Title: 'العنوان',
      'Maximum Break Duration': 'أطول مدة استراحة',
      'Longest break duration': 'أطول مدة استراحة',
      Sunday: 'الأحد',
      Monday: 'الاثنين',
      Tuesday: 'الثلاثاء',
      Wednesday: 'الأربعاء',
      Thursday: 'الخميس',
      'Study hours': 'ساعات الدراسة',
      "Set the day's time range": 'حدد نطاق الوقت لليوم',
      'Upload Failed': 'فشل في التحميل',
      "We couldn't upload your files. Please try again.":
        'تعذر تحميل ملفاتك. حاول مرة أخرى.',
      'Permission Denied': 'تم رفض الإذن',
      'Storage access is required to upload files.':
        'يلزم الوصول إلى التخزين لتحميل الملفات.',
      'File too large': 'الملف كبير جداً',
      'Ask me anything': 'اسألني أي شيء',
      'Delete Task?': 'هل تريد حذف المهمة؟',
      'Are you sure you want to delete this task? This action cannot be undone.':
        'هل أنت متأكد أنك تريد حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء.',
      Cancel: 'إلغاء',
      Delete: 'حذف',
      'Final Exam Details': 'تفاصيل الاختبار النهائي',
      'Pick a date': 'اختر التاريخ',
      'Start time': 'وقت البداية',
      'End time': 'وقت النهاية',
      'No saved chats yet.': 'لا توجد محادثات محفوظة بعد.',
      'Previous Chats': 'المحادثات السابقة',
      'No upcoming tasks!': 'لا توجد مهام قادمة!',
      'Day Ends': 'نهاية اليوم',
      'Day Begins': 'بداية اليوم',
      'Longest break': 'أطول استراحة',
      Breaks: 'الاستراحات',
      'Off Days': 'أيام الراحة',
      Schedule: 'الجدول',
      'Add new lecture': 'إضافة محاضرة جديدة',
      'Section number': 'رقم الشعبة',
      'Lectures on': 'محاضرات يوم',
      'overlap in section': 'تداخل في الشعبة',
      'Please select a day for all lectures': 'يرجى اختيار يوم لكل المحاضرات',
      'Section number is required': 'رقم الشعبة مطلوب',
      'Start and end times cannot be the same.':
        'لا يمكن أن يكون وقت البداية والنهاية متماثلين.',
      'End time must be after start time.':
        'يجب أن يكون وقت النهاية بعد وقت البداية.',
      'Start time must be between 8:00 AM and 7:00 PM':
        'وقت البداية يجب أن يكون بين 8:00 صباحًا و7:00 مساءً',
      'Delete Subject': 'حذف المادة',
      'Add section': 'إضافة شعبة',
      Final: 'نهائي',
      'Subject code': 'رمز المادة',
      'Subject name': 'اسم المادة',
      'Edit subject': 'تعديل المادة',
      'Add subject manually': 'إضافة مادة يدويًا',
      Error: 'خطأ',
      Deleted: 'تم الحذف',
      'Subject has been removed.': 'تم حذف المادة.',
      'Are you sure you want to delete this subject?':
        'هل أنت متأكد أنك تريد حذف هذه المادة؟',
      'Subject updated': 'تم تحديث المادة',
      Validation: 'التحقق',
      'Section number is duplicated.': 'رقم الشعبة مكرر.',
      'Please enter at least one valid section and lecture.':
        'يرجى إدخال شعبة ومحاضرة واحدة على الأقل بشكل صحيح.',
      'Please enter the subject code.': 'يرجى إدخال رمز المادة.',
      'Please enter the subject name.': 'يرجى إدخال اسم المادة.',
      'Password reset email sent!': 'تم إرسال بريد إعادة تعيين كلمة المرور!',
      'Please check your inbox.': 'يرجى التحقق من بريدك الوارد.',
      'My Schedule': 'جدولي',
      'Schedule Generation': 'إنشاء الجدول',
      'No subjects added yet. Please add one to begin.':
        'لم تتم إضافة أي مواد بعد. يرجى إضافة مادة للبدء.',
      'Generate Schedule': 'إنشاء الجدول',
      Hi: 'مرحبًا',
      "don't forget to check your tasks for today. Keep making progress!":
        'لا تنسَ مراجعة مهامك اليوم. واصل التقدم!',
      'Up Coming Classes': 'المحاضرات القادمة',
      'No schedule found.': 'لم يتم العثور على جدول.',
      'To Do': 'المهام',
      'Good morning': 'صباح الخير',
      'Good afternoon': 'مساء الخير',
      'Good evening': 'مساء الخير',
      'Number of schedules created': 'عدد الجداول التي تم إنشاؤها',
      'Enter Your LMS Password': 'ادخل كلمة مرور نظام LMS',
      'No schedule saved yet. Generate a schedule or import one from LMS.':
        'لم يتم حفظ أي جدول بعد. أنشئ جدولًا أو استورده من نظام LMS.',
      'You already have a saved schedule. Please delete it first before importing a new one.':
        'لديك جدول محفوظ بالفعل. يرجى حذفه أولًا قبل استيراد جدول جديد.',
      Warning: 'تحذير',
      'You are not allowed to import a schedule from LMS. Please generate your own schedule or register as a KSU student.':
        'غير مسموح لك باستيراد جدول من LMS. يرجى إنشاء جدولك أو التسجيل كطالب في جامعة الملك سعود.',
      'Schedule deleted successfully.': 'تم حذف الجدول بنجاح.',
      'Are you sure you want to delete your saved schedule?':
        'هل أنت متأكد أنك تريد حذف جدولك المحفوظ؟',
      Filters: 'التصفيات',
      'You already have a saved schedule. Please delete it first before saving a new one.':
        'لديك جدول محفوظ بالفعل. يرجى حذفه أولًا قبل حفظ جدول جديد.',
      'Schedule saved successfully.': 'تم حفظ الجدول بنجاح.',
      "Hello! I'm here to help. Ask me anything and I'll do my best to assist you.":
        'مرحبًا! أنا هنا للمساعدة. اسألني أي شيء وسأبذل قصارى جهدي لمساعدتك.',
      'Delete Schedule': 'حذف الجدول',
      Import: 'استيراد',
      'My Schedule': 'جدولي',
      'Import LMS Calendar': 'استيراد المهام من LMS',
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

  // Force a full app restart for RTL/LTR and language changes to take effect
  setTimeout(() => {
    RNRestart.Restart();
  }, 300);
};

export default i18n;
