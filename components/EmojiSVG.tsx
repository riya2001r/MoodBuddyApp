// EmojiSVG.tsx
import React, { useState, useEffect } from 'react';
import {TouchableOpacity, Animated, StyleSheet, Text, View} from 'react-native';
import Svg, { Circle, Path, G, LinearGradient, Stop, Defs } from 'react-native-svg';
import {Mood} from "@/components/MoodCalendar";


interface EmojiSVGProps {
    type: Mood | undefined;
    size?: number;
    style?: any;
    animated?: boolean;
}

const EmojiSVG: React.FC<EmojiSVGProps> = ({ type, size = 30, style = {}, animated = false }) => {
    const [rotateAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (animated) {
            startRotationAnimation();
        }
    }, [animated]);

    const startRotationAnimation = () => {
        Animated.sequence([
            Animated.timing(rotateAnim, {
                toValue: 0.05,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: -0.05,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    };

    const hoverOrPress = () => {
        if (animated) {
            startRotationAnimation();
        }
    };

    const animatedStyle = animated ? {
        transform: [
            { perspective: 800 },
            { rotateY: rotateAnim.interpolate({
                    inputRange: [-0.05, 0, 0.05],
                    outputRange: ['-5deg', '0deg', '5deg']
                })},
            { scale: rotateAnim.interpolate({
                    inputRange: [-0.05, 0, 0.05],
                    outputRange: [0.95, 1, 0.95]
                })}
        ]
    } : {};

    const renderSVGEmoji = () => {
        // Define viewBox and other common properties for SVGs
        const viewBox = "0 0 64 64";
        const outlineColor = "#664E27";

        switch(type) {
            case '😀': // Happy
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="happyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFE78D" />
                                <Stop offset="100%" stopColor="#FFCC4D" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#happyGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M49,38c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round"/>
                        <Circle cx="20.5" cy="24.5" r="5" fill="#664E27" />
                        <Circle cx="43.5" cy="24.5" r="5" fill="#664E27" />
                    </Svg>
                );
            case '😢': // Sad
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="sadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFE78D" />
                                <Stop offset="100%" stopColor="#FFCC4D" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#sadGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M19,46c4.2-3.1,13.6-3.1,17.8,0" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
                        <Circle cx="20.5" cy="24.5" r="5" fill="#664E27" />
                        <Circle cx="43.5" cy="24.5" r="5" fill="#664E27" />
                        <Path d="M44,42c0,0,7,5.9,7,9c0,2-1,3-3,3s-4-1-4-1" fill="#65B1EF" stroke="#664E27" strokeWidth="1.5"/>
                    </Svg>
                );
            case '😐': // Neutral
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="neutralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFE78D" />
                                <Stop offset="100%" stopColor="#FFCC4D" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#neutralGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M20,42h24" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
                        <Circle cx="20.5" cy="24.5" r="5" fill="#664E27" />
                        <Circle cx="43.5" cy="24.5" r="5" fill="#664E27" />
                    </Svg>
                );
            case '😲': // Surprise
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="surpriseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFE78D" />
                                <Stop offset="100%" stopColor="#FFCC4D" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#surpriseGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Circle cx="32" cy="42" r="9" fill="#664E27" />
                        <Circle cx="20.5" cy="24.5" r="5" fill="#664E27" />
                        <Circle cx="43.5" cy="24.5" r="5" fill="#664E27" />
                    </Svg>
                );
            case '😨': // Fear
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="fearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFE78D" />
                                <Stop offset="100%" stopColor="#FFCC4D" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#fearGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M25,43c0,4.4,3.6,8,8,8c4.4,0,8-3.6,8-8" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round"/>
                        <Path d="M22,26c0,0-2-4-7-4s-7,4-7,4" fill="none" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M56,26c0,0-2-4-7-4s-7,4-7,4" fill="none" stroke={outlineColor} strokeWidth="2" />
                    </Svg>
                );
            case '🤢': // Disgust
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="disgustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#B5E655" />
                                <Stop offset="100%" stopColor="#88C057" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#disgustGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M19,46c4.2-3.1,13.6-3.1,17.8,0" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
                        <Circle cx="20.5" cy="24.5" r="5" fill="#664E27" />
                        <Circle cx="43.5" cy="24.5" r="5" fill="#664E27" />
                        <Path d="M25,35c-1.9-1.1-7.1-2.1-13.8,1.9" fill="none" stroke="#664E27" strokeWidth="2.5" strokeLinecap="round" />
                    </Svg>
                );
            case '😠': // Angry
                return (
                    <Svg width={size} height={size} viewBox={viewBox}>
                        <Defs>
                            <LinearGradient id="angryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFDD67" />
                                <Stop offset="100%" stopColor="#FF6D3F" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx="32" cy="32" r="30" fill="url(#angryGradient)" stroke={outlineColor} strokeWidth="2" />
                        <Path d="M19,46c4.2-3.1,13.6-3.1,17.8,0" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
                        <Path d="M13,22l12,5" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
                        <Path d="M51,22l-12,5" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
                        <Circle cx="20.5" cy="27.5" r="5" fill="#664E27" />
                        <Circle cx="43.5" cy="27.5" r="5" fill="#664E27" />
                    </Svg>
                );
            default: // Fallback to text emoji
                return (
                    <Text style={{fontSize: size, textAlign: 'center'}}>{type}</Text>
                );
        }
    };

    const Content = animated ? Animated.View : View;

    return (
        <TouchableOpacity
            onPress={hoverOrPress}
            style={[styles.container, style]}
            disabled={!animated} // Disable when not animated
        >
            <Content style={[animatedStyle]}>
                {renderSVGEmoji()}
            </Content>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default EmojiSVG;