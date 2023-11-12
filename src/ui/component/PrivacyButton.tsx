import { IconButton } from 'react-native-paper';

import { useNavigation } from '../hook/navigation/useExtendedNavigation';
import { RootStackParamList } from 'app/App';

export const PrivacyButton = () => {
  const navigation = useNavigation<RootStackParamList>();

  return (
    <IconButton onPress={() => navigation.navigate('PrivacyScreen')} icon='information' />
  );
};
