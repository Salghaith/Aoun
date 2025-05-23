import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const HamburgerMenu = ({onClose, sessions, onSelectSession}) => {
  const {t} = useTranslation();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={[{flex: 1}, styles.menuContainer]}>
      <Animated.View style={[{transform: [{translateX: slideAnim}]}]}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{t('Previous Chats')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={sessions}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.messageItem}
              onPress={() => onSelectSession(item.id)}>
              <Text style={styles.messageText}>
                {item.sessionName ||
                  `Chat ${new Date(
                    item.createdAt?.toDate?.(),
                  ).toLocaleString()}`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>{t('No saved chats yet.')}</Text>
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default HamburgerMenu;
// ✅ STYLES
const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '90%',
    backgroundColor: '#1F262E',
    paddingHorizontal: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  messageItem: {
    backgroundColor: '#2E3A45',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0084FF',
  },
  messageText: {
    color: '#E0E0E0',
    fontSize: 15,
  },
  emptyMessage: {
    color: '#AAA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
