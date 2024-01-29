import Logo from 'app/assets/logo.svg';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from 'app/ui/hook/navigation/useExtendedNavigation';
import { RootStackParamList } from 'app/App';
import codePush, { DownloadProgress } from 'react-native-code-push';
import CodePush from 'react-native-code-push';
import { Text } from 'react-native-paper';
import { useDisableBackButton } from '../hook/navigation/useDisableBackButton';

export function SplashScreen() {
  useDisableBackButton();
  const navigation = useNavigation<RootStackParamList>();
  const [info, setInfo] = useState<string>('');

  const style = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    textInfo: {
      marginTop: 10,
      color: 'grey',
      textAlign: 'center',
      fontSize: 20,
    },
  });

  if (__DEV__) {
    useEffect(() => {
      navigation.replace('MenuScreen');
    })
  }
  else {
    codePush.sync(
      {
        deploymentKey: 'CODE_PUSH_DEPLOYMENT_KEY',
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      (status: CodePush.SyncStatus) => {
        switch (status) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            setInfo('checking-update');
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setInfo('downloading-package');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setInfo('installing-update');
            break;
          case CodePush.SyncStatus.UPDATE_IGNORED:
            setInfo('update-ignored');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            setInfo('update-installed');
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
          case CodePush.SyncStatus.UP_TO_DATE:
            setInfo('loading-app');
            navigation.replace('MenuScreen');
            break;
        }
      },
      (progress: DownloadProgress) => {
        setInfo(
          `downloading-package ${Math.round(
            (progress.receivedBytes / progress.totalBytes) * 100,
          )}`,
        );
      },
    );
  }

  return (
    <SafeAreaView style={style.screen}>
      <View>
        <Logo width="200" height="200" />
        <Text style={style.textInfo}>{info}</Text>
      </View>
    </SafeAreaView>
  );
}
