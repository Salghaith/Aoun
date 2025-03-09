import { PermissionsAndroid, Platform } from "react-native";

async function requestFileUploadPermission() {
  if (Platform.OS === "android") {
    try {
      if (Platform.Version >= 33) {
        // 🔹 Android 13+ (Needs separate permissions)
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] !== PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] !== PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("❌ File access permission denied!");
        } else {
          console.log("✅ File access permission granted!");
        }
      } else {
        // 🔹 Android 12 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("❌ File access permission denied!");
        } else {
          console.log("✅ File access permission granted!");
        }
      }
    } catch (error) {
      console.error("⚠️ Error requesting file access permission:", error);
    }
  } else {
    console.log("📂 iOS handles file access automatically with Document Picker.");
  }
}

export { requestFileUploadPermission };
