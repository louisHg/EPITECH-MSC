
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Chart({ sparkline }) {

    const maxElement = sparkline.reduce(function (prev, curr) {
        return prev.price > curr.price ? prev.price : curr.price;
    });
    const minElement = sparkline.reduce(function (prev, curr) {
        return prev.price < curr.price ? prev.price : curr.price;
    });

    return (
        <ResponsiveContainer aspect={1} maxHeight={500} minWidth={600} minHeight={1}>
            <LineChart data={sparkline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval="preserveStartEnd"/>
                <YAxis type='number' domain={[dataMin => Math.round(dataMin - (minElement * 0.005)), dataMax => Math.round(dataMax + (maxElement * 0.005))]} />
                <Tooltip />
                <Legend />
                <Line name="Prix" type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }}  dot={false} isAnimationActive={false}/>
            </LineChart>
        </ResponsiveContainer>
    );
}

