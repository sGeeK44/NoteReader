import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import { RNVexFlowSVGContext } from 'react-native-vexflow-canvas';

export const MusicScore = () => {
    const [svg, setSvg] = useState<ReactNode>();
    const styles = StyleSheet.create({
        content: {
            backgroundColor: '#f2f2f2'
        },
    });
    return (
        <ScrollView>
            <View style={styles.content}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    const context = new RNVexFlowSVGContext(width, 1000);
                    setSvg(context.render())
                }}>{svg}
            </View>
        </ScrollView>
    );
};
