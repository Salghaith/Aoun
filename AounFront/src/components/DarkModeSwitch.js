import React, {useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, Animated} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';

const DarkModeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDarkMode ? 30 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  const toggleSwitch = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      activeOpacity={0.7}
      style={[
        styles.switch,
        {backgroundColor: isDarkMode ? '#183153' : '#73C0FC'},
      ]}>
      <Animated.View
        style={[
          styles.sunMoonContainer,
          {transform: [{translateX: isDarkMode ? 0 : 30}]},
        ]}>
        {!isDarkMode ? (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={5} fill="#ffd43b" />
            <Path
              fill="#ffd43b"
              d="M21 13h-1a1 1 0 010-2h1a1 1 0 010 2zM4 13H3a1 1 0 010-2h1a1 1 0 010 2zM17.66 7.34a1 1 0 01-.66-.29 1 1 0 010-1.41l.71-.71a1 1 0 011.41 1.41l-.71.71a1 1 0 01-.75.29zM5.64 19.36a1 1 0 01-.71-.29 1 1 0 010-1.41l.71-.66a1 1 0 011.41 1.41l-.71.71a1 1 0 01-.7.24zM12 2a1 1 0 01-1-1V0a1 1 0 012 0v1a1 1 0 01-1 1zM12 22a1 1 0 01-1-1v-1a1 1 0 012 0v1a1 1 0 01-1 1zM6.34 7.34a1 1 0 01-.7-.29l-.71-.71a1 1 0 011.41-1.41l.71.71a1 1 0 010 1.41 1 1 0 01-.71.29zM18.36 19.36a1 1 0 01-.7-.29l-.66-.71a1 1 0 011.36-1.36l.71.71a1 1 0 010 1.41 1 1 0 01-.71.24z"
            />
          </Svg>
        ) : (
          <Svg width={24} height={24} viewBox="0 0 384 512" fill="#ffffff">
            <Path d="M223.5 32C100 32 0 132.3 0 256s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
          </Svg>
        )}
      </Animated.View>
      <Animated.View style={[styles.slider, {transform: [{translateX}]}]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 64,
    height: 34,
    borderRadius: 30,
    position: 'relative',
    justifyContent: 'center',
  },
  slider: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#e8e8e8',
    borderRadius: 15,
    bottom: 2,
    left: 2,
  },
  sunMoonContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: 5,
    left: 5,
  },
});

export default DarkModeSwitcher;
