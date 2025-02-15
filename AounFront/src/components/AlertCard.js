import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AlertCard = ({type, message}) => {
  const alertStyles = {
    success: {
      backgroundColor: '#D1FAE5',
      borderColor: '#10B981',
      textColor: '#065F46',
      iconName: 'checkmark-circle-outline',
    },
    info: {
      backgroundColor: '#DBEAFE',
      borderColor: '#3B82F6',
      textColor: '#1E40AF',
      iconName: 'information-circle-outline',
    },
    warning: {
      backgroundColor: '#FEF3C7',
      borderColor: '#F59E0B',
      textColor: '#92400E',
      iconName: 'warning-outline',
    },
    error: {
      backgroundColor: '#FEE2E2',
      borderColor: '#EF4444',
      textColor: '#7F1D1D',
      iconName: 'close-circle-outline',
    },
  };

  const {backgroundColor, borderColor, textColor, iconName} =
    alertStyles[type] || alertStyles.info;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.alertBox,
        {backgroundColor, borderLeftColor: borderColor},
      ]}>
      <Icon name={iconName} size={20} color={textColor} style={styles.icon} />
      <Text style={[styles.text, {color: textColor}]}>{message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderLeftWidth: 4,
    borderRadius: 8,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});

export default AlertCard;
