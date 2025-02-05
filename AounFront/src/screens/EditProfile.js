import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image, Alert} from 'react-native';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import {useTranslation} from 'react-i18next';

const EditProfileScreen = ({navigation}) => {
    const {t} = useTranslation();
    const [isEditable, setIsEditable] = useState(false);
    const [name, setName] = useState('Khaled Alharbi');
    const [email, setEmail] = useState('johndoe@example.com');
    const [password, setPassword] = useState('********');

    const handleEditSave = () => {
        if (isEditable) {
            // Save logic
            Alert.alert(t('Success'), t('Your information has been successfully saved.'));
        }
        setIsEditable(!isEditable);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.title}>{t('Edit Information')}</Text>
            </View>

            <View style={styles.ProfileContainer}>
                <Image
                    style={styles.image}
                    source={require('../assets/images/ProfilePng.png')}
                />
            </View>

            <View style={styles.EditContainer}>
                <InputField
                    type="text"
                    title={t('Full Name')}
                    placeholder={name}
                    value={isEditable ? name : ''}
                    editable={isEditable}
                    onChangeText={setName}
                    icon="user"
                    style={styles.inputField}
                />
                <InputField
                    type="email"
                    title={t('Enter Your Email')}
                    placeholder={email}
                    value={isEditable ? email : ''}
                    editable={isEditable}
                    onChangeText={setEmail}
                    icon="mail"
                    style={styles.inputField}
                />
                <InputField
                    type="password"
                    title={t('Password')}
                    placeholder={password}
                    value={isEditable ? password : ''}
                    editable={isEditable}
                    onChangeText={setPassword}
                    icon="lock"
                    style={styles.inputField}
                />

                <LoginButton
                title={isEditable ? t('Save') : t('Edit')}
                onPress={handleEditSave}
                style={styles.loginButton}
                />

            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C2128',
        flex: 1,
    },

    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
    },

    title: {
        fontSize: 26,
        fontWeight: '600',
        color: 'white',
        marginLeft: 32,
        marginTop: 18,
    },

    ProfileContainer: {
        alignItems: 'center',
        marginTop: 40,
    },

    image: {
        alignItems: 'center',
        width: 105,
        height: 105,
        borderRadius: 52.5, // Circular image
    },

    EditContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },

    inputField: {
        marginBottom: 25, // Added space between inputs
    },

    loginButton: {
        marginTop: 30, // Added space above the login button
    },
});

export default EditProfileScreen;
