import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import {
  Button,
} from 'react-native-paper';
import { useDisableBackButton } from '../hook/navigation/useDisableBackButton';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}


export const MenuScreen = ({ navigation }: Props) => {
  useDisableBackButton();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    button: {
      marginVertical: 16,
    },
  });

  const handleReadPress = () => {
    navigation.navigate('ReadScreen')
  };

  const handleDictationPress = () => {
    navigation.navigate('DictationScreen')
  };

  const handleAboutPress = () => {
    navigation.navigate('PrivacyScreen')
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={handleReadPress} style={styles.button}>Read</Button>
      <Button onPress={handleDictationPress} style={styles.button}>Dictation</Button>
      <Button onPress={handleAboutPress} style={styles.button}>About</Button>
    </SafeAreaView>
  );
};
