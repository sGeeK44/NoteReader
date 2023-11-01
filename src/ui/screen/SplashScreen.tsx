import EighthDottedDouble from 'app/assets/eighth-dotted-double.svg';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from 'app/App';
import codePush, {DownloadProgress} from 'react-native-code-push';
import CodePush from 'react-native-code-push';
import {Text} from 'react-native-paper';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export function SplashScreen({navigation}: Props) {
  const [info, setInfo] = useState<string>('');
  const style = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInfo: {
      color: 'grey',
    },
  });

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
          navigation.navigate('MainScreen');
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

  return (
    <SafeAreaView style={style.screen}>
      <View>
        <EighthDottedDouble width="65" height="65" />
        <Text style={style.textInfo}>{info}</Text>
      </View>
    </SafeAreaView>
  );
}
