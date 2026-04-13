---
title: Styling in React Native
date: 2026-04-10
description: inline, component-based and global style sheets
---


# Styling

Styling in React Native mobile apps can be configured via a styles object, either inline or global.  

## Inline styling

For inline styling, styles are defined within each component on the page.

```
<View style={{padding: 24, backgroundColor: "blue"}}/>
```

## StyleSheet styles per component 

You can also use a stylesheet object for each screen or component.

```
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MyApp = () => (
<View style={styles.container}>
<Text style={styles.title}>Hi!</Text>
</View>);

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 24,
backgroundColor: "#7E1F86"},

title: {
marginTop: 10,
borderWidth: 2,
borderColor: "#A14DA0",
borderRadius: 4,
backgroundColor: '#91C4F2',
color: '#7E1F96',
textAlign: 'center',
fontSize: 24,
fontWeight: 'bold',},});

export default MyApp;
```


## Global stylesheets

If you want to have reusable, consistent styling, consider using a global stylesheet.

file path:  src/styles/globalStyles.ts
```
import {StyleSheet} from 'react-native';

export const globalStyles = 
StyleSheet.create({
container: {
flex: 1,
padding: 24,
backgroundColor: "#7E1F86"},

title: {
marginTop: 10,
borderWidth: 2,
borderColor: "#A14DA0",
borderRadius: 4,
backgroundColor: '#91C4F2',

color: '#7E1F96',
textAlign: 'center',
fontSize: 24,
fontWeight: 'bold',},});

```


file path:  src/app/homepage.tsx
```
import React from 'react';
import {View, Text} from 'react-native';
import {globalStyles} from "@/styles/globalStyles";

const MyApp = () => (
<View style={globalStyles.container}>
<Text style={globalStyles.title}>Hi!</Text>
</View>
)

export default MyApp;
```

Source:
https://reactnative.dev/docs/stylesheet 


