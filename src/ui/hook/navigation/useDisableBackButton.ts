import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useDisableBackButton = () => {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);
};
