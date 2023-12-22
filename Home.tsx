import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

import GridLayout from './GridLayput';

/**
 * MQTT
 */
import MQTT from '@openrc/react-native-mqtt';

const client = MQTT.connect(
  'wss://9b7b323ee67e46d18f9317162c8e8841.s1.eu.hivemq.cloud:8884/mqtt',
  {
    port: 8884,
    protocol: 'wss',
    username: 'sergiu.doncila',
    password: 'QWEasd!@#123',
  },
);

client.on('closed', function () {
  console.log('mqtt event closed');
});

client.on('error', function (msg) {
  console.log('mqtt event error', msg);
});

client.on('connect', function () {
  console.log('connected mqtt');
});

const Home = () => {
  const [data, setdata] = React.useState([
    {id: 1, text: 'Temperatura', uri: require('./assets/temp.png'), value: 0},
    {id: 2, text: 'Umeditatea', uri: require('./assets/water.png'), value: 0},
    {
      id: 3,
      text: 'Light',
      uri: require('./assets/light.png'),
      value: 4,
    },
    {
      id: 4,
      text: 'Ventilare',
      uri: require('./assets/fan.png'),
      value: 4,
    },
    {id: 5, text: 'Battery', uri: require('./assets/battery.png'), value: 0},
    {
      id: 6,
      text: 'Energy',
      uri: require('./assets/energy.png'),
      value: 0,
    },
  ]);

  useEffect(() => {
    client.subscribe(
      [
        'agrobot/sensors/#',
        'microlab/agro/device/invertor/chargingPower-1',
        'microlab/agro/device/invertor/pVoltage-1',
      ],
      {qos: 0},
    );
    client.on('message', function (topic, message) {
      const jsonMsg = JSON.parse(message.toString());
      console.log(jsonMsg);

      const tempData = [...data];
      if (jsonMsg.temp) {
        tempData[0].value = `${jsonMsg.temp + '℃'}`;
      }
      if (jsonMsg.hum) {
        tempData[1].value = jsonMsg.hum;
      }

      if (jsonMsg.chargingPower) {
        tempData[4].value = jsonMsg.chargingPower + 'W';
      }

      if (jsonMsg.pVoltage) {
        console.log('>jsonMsg', jsonMsg);

        tempData[5].value = jsonMsg.pVoltage + 'V';
      }

      setdata(tempData);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#AF9ED7'}}>
      <View>
        <Image
          source={require('./assets/greenhouse.png')}
          style={{width: 300, height: 200, alignSelf: 'center'}}
          resizeMode="contain"
        />
      </View>
      <GridLayout data={data} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
