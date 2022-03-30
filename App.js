import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	SafeAreaView,
} from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { db } from './firebase';
import { set, ref } from 'firebase/database';
import ChartScreen from './components/Chart';
import { Audio } from 'expo-av';

export default function App() {
	// Initializing variables and creating a state for them
	const [data, setData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});
	const [subscription, setSubscription] = useState(null);
	const [sound, setSound] = useState();
	const [fast, setFast] = useState(true);

	// Slows down the rate values are updated
	const _slow = () => {
		Magnetometer.setUpdateInterval(1000);
		setFast(false);
	};

	// Speeds up the rate values are up dated
	const _fast = () => {
		Magnetometer.setUpdateInterval(150);
		setFast(true);
	};

	const _subscribe = () => {
		setSubscription(
			Magnetometer.addListener((result) => {
				setData(result);
			})
		);
	};

	const _unsubscribe = () => {
		subscription && subscription.remove();
		setSubscription(null);
	};

	// Plays sound
	const playSound = async () => {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(
			require('./assets/beep-23.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	};

	// Used to turn on and off the sensor
	useEffect(() => {
		_subscribe();
		return () => _unsubscribe();
	}, []);

	// Initializing the values of x, y and z
	const { x, y, z } = data;

	// Calculating the overall magnetic field around the device
	const microTesla = Math.sqrt(x * x + y * y + z * z);

	// Updated the values in firebase database
	function updateValues(xValue, yValue, zValue, micTeslaVal) {
		set(ref(db, 'xyzValues/'), {
			x: xValue,
			y: yValue,
			z: zValue,
		}).then(() => {
			set(ref(db, 'teslaValue/'), {
				microTesla: micTeslaVal,
			});
		});
	}

	// Calls the updateValues function while playing sound if value is greater than 70
	useEffect(() => {
		updateValues(x, y, z, microTesla);
		if (microTesla >= 70) {
			playSound();
			return sound
				? () => {
						console.log('Unloading Sound');
						sound.unloadAsync();
				  }
				: undefined;
		} else {
			return sound
				? () => {
						console.log('Stop Sound');
						sound.stopAsync();
				  }
				: undefined;
		}
	}, [microTesla]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#aa9eac' }}>
			<View style={styles.container}>
				<View>
					<Text style={styles.title}>Metal Detector</Text>
					<View
						style={
							microTesla >= 70
								? [styles.teslaArea, styles.teslaAreaMax]
								: styles.teslaArea
						}
					>
						<Text
							style={
								microTesla >= 70
									? [styles.telsa, styles.testlaMax]
									: styles.telsa
							}
						>
							{round(microTesla)} μT
						</Text>
					</View>
				</View>
				<ChartScreen teslaValue={microTesla} />
				<View style={{ marginBottom: 100 }}>
					<View style={styles.xyzArea}>
						<Text style={[styles.text, styles.x]}>x: {round(x)}</Text>
						<Text style={[styles.text, styles.y]}>y: {round(y)}</Text>
						<Text style={[styles.text, styles.z]}>z: {round(z)}</Text>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={subscription ? _unsubscribe : _subscribe}
							style={
								subscription
									? [styles.button, styles.on]
									: [styles.button, styles.off]
							}
						>
							<Text style={styles.btn_txt1}>{subscription ? 'On' : 'Off'}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={_slow}
							style={
								!fast
									? [styles.button, styles.middleButton, styles.slow]
									: [styles.button, styles.middleButton]
							}
						>
							<Text style={styles.btn_txt2}>Slow</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={_fast}
							style={fast ? [styles.button, styles.fast] : [styles.button]}
						>
							<Text style={styles.btn_txt2}>Fast</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

function round(n) {
	if (!n) {
		return 0;
	}
	return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: 10,
	},
	text: {
		textAlign: 'center',
		flex: 1,
		borderWidth: 1,
		paddingVertical: 10,
		fontSize: 18,
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	x: {
		backgroundColor: '#6FA8DC',
	},
	y: {
		backgroundColor: '#ffd966',
	},
	z: {
		backgroundColor: '#e06666',
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'stretch',
		marginTop: 15,
	},
	button: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',
		padding: 10,
	},
	middleButton: {
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: '#ccc',
	},
	telsa: {
		fontSize: 32,
		textAlign: 'center',
		fontWeight: '600',
		color: '#38761d',
	},
	xyzArea: {
		flexDirection: 'row',
	},
	teslaArea: {
		backgroundColor: '#e7e7e7',
		height: 200,
		width: 200,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		borderWidth: 5,
		borderColor: '#38761d',
	},
	teslaAreaMax: {
		backgroundColor: '#e7e7e7',
		borderColor: '#990000',
	},
	testlaMax: {
		color: '#990000',
	},
	on: {
		backgroundColor: 'green',
	},
	off: {
		backgroundColor: 'red',
	},
	btn_txt1: {
		color: 'white',
		fontWeight: '600',
	},
	btn_txt2: {
		color: 'black',
		fontWeight: '600',
	},
	slow: {
		backgroundColor: 'pink',
	},
	fast: {
		backgroundColor: 'lightblue',
	},
	title: {
		fontSize: 42,
		alignSelf: 'center',
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 15,
		textDecorationLine: 'underline',
	},
});
