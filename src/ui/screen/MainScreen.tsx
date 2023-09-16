import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { NavigationProp } from "@react-navigation/native"
import { RootStackParamList } from 'app/App';

export interface Props {
  navigation: NavigationProp<RootStackParamList>
}

export const MainScreen = ({ navigation }: Props) => {
  const [tempo, setTempo] = useState<string>('60');

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    score: {
      flex: 1,
      paddingHorizontal: 10,
    },
    text: { color: 'black', fontSize: 25 },
  });
  return (
    <SafeAreaView style={styles.content}>
      <TextInput
        style={styles.text}
        onChangeText={value => setTempo(value)}
        value={tempo}
      />
      <Button
        title="Start"
        onPress={() => {
          navigation.navigate('TrainScreen', { tempo: parseInt(tempo, 10) });
        }} />
    </SafeAreaView>
  );
};
