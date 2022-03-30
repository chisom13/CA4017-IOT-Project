import React, { useState, useEffect } from 'react';
import { LineChart, Grid, AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

export default function ChartScreen({ teslaValue }) {
	const [value, setValue] = useState([0]);

	useEffect(() => {
		getTeslaData();
	}, [teslaValue]);

	// Updates the array of values and limits it to only 10 values
	const getTeslaData = () => {
		setValue((prevData) => {
			const arr = [...prevData, teslaValue];
			if (value.length >= 10) {
				arr.splice(0, 1);
				return arr;
			} else {
				return arr;
			}
		});
	};

	return (
		<AreaChart
			style={{
				height: 200,
				marginBottom: 40,
				backgroundColor: '#e7e7e7',
				borderWidth: 1,
			}}
			gridMin={20}
			gridMax={200}
			data={value}
			svg={{ fill: '#00c0cc' }}
			// contentInset={{ top: 20, bottom: 20 }}
			curve={shape.curveNatural}
		>
			<Grid />
		</AreaChart>
	);
}
