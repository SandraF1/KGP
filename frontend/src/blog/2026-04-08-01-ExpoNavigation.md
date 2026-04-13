---
title: Expo routing
date: 2026-04-08
description: Setting up Expo navigation
---

# Expo routing

## Some important facts

### All screens or pages must be placed in the app folder

- For example, frontend/app or src/app.
- This is because by default Expo looks up the pages in the app folder.
- Each file in the app folder (excluding _layout.tsx, which contains navigation information) corresponds to a unique page in the app.  
- When navigation occurs, Expo router looks up the corresponding file name in the directory.  In other words, folder and file naming are significant because Expo uses them to create navigation.
- Note that although URLs are not visible in mobile apps, they are still used internally for navigation.

### index.tsx is the initial route

- By default, Expo looks up the index.tsx file in the app folder.
- index.tsx corresponds to app/, which is the project root.
- This screen will render first, and in that sense is your mobile app's homepage.

### Root _layout.tsx renders first

- The _layout.tsx inside the app folder renders first.
- It defines the navigation structure for the folder, for example, tab navigation or stack (linear) navigation.
- It must render first because Expo needs to know how the screens will be organised before rendering them.
- A _layout.tsx file can also be placed in subfolders, and this again will be rendered first within that folder before the other files.  This happens often with nested navigation.

## File-based routing in Expo

### Stack navigation

This enables navigation between pages, linear or branching.

```
import {Stack} from 'expo-router';

export default function Layout() {
return (
<Stack>
<Stack.Screen
name='index'
options={{title: 'Home'}}/>
<Stack.Screen
name='study'
options={{title: 'Study'}}/>
</Stack>)}
```

- name refers to the file name and must be spelt exactly the same way. Note: Lower case is recommended for expo screens and routing.  If the file name has two words, use kebab case (eg 'quiz-bank').
options refers to the title that will be shown in the app bar, usually at the top of the screen.
- Note also that for stack navigation, the order of the screens is not important, except that index must come first.

### Tab navigation

This refers to the use of tabs as navigation, on the bottom, top or side of the screen.  

```
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="study"
        options={{
          title: "Study",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  )
}


- Note:  Unlike stack navigation, order is important in tab navigation.

### Nested navigation

Nested navigation is common in apps. For example, you can have tab navigation defined for the app overall, in the _layout.tsx in the app folder.  Then, you might have _layout.tsx in a subfolder with stack navigation.
 

Sources:
https://docs.expo.dev/router/basics/core-concepts/
https://docs.expo.dev/router/basics/notation/
https://docs.expo.dev/router/basics/layout/
https://medium.com/@tharunbalaji110/expo-router-my-journey-from-next-js-to-react-native-navigation-db97b0542dbd