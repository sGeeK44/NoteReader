/* eslint-disable @typescript-eslint/ban-types */
import {
    NavigationProp,
    StackActions,
    useNavigation as useNativeNavigation,
} from '@react-navigation/native';

export type NavigationextendedProp = {
    replace(name: string): void;
};

export type NavigationHelperProp<T extends {}> = NavigationextendedProp & NavigationProp<T>;

export const useNavigation = <T extends {}>(): NavigationHelperProp<T> => {
    const navigation = useNativeNavigation<NavigationHelperProp<T>>();

    navigation.replace = (name) => {
        navigation.dispatch({
            ...StackActions.replace(name),
            target: navigation.getState().key,
        });
    };

    return navigation;
};
