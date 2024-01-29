import { SafeAreaView, StyleSheet, View } from 'react-native';
import { RootStackParamList } from 'app/App';
import { RouteProp } from '@react-navigation/native';
import { Button } from 'react-native-paper';

interface Props {
  route: RouteProp<RootStackParamList, 'TrainDictationScreen'>;
}

export const TrainDictationScreen = ({ route }: Props) => {
  const { tempo, nbMeasure, clef, notation, noteRange } = route.params;
  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    score: {
      flex: 1,
      paddingHorizontal: 10,
    },
    buttons: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'space-around',
    },
    text: { color: 'black', fontSize: 25 },
  });

  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.score}>
      </View>
      <View style={styles.buttons}>
        <Button
          icon="play"
          mode="contained"
          onPress={() => {
          }}>
          Start
        </Button>
      </View>
    </SafeAreaView>
  );
};
