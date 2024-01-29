import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import { DictationScreenViewModel } from './DictationScreenViewModel';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const viewModel = new DictationScreenViewModel();

export const DictationScreen = ({ navigation }: Props) => {

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'space-between',
    }
  });

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};
