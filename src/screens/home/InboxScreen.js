import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const InboxScreen = () => {
  return (
    <View style={styles.container}>
      <Text>InboxScreen</Text>
    </View>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
