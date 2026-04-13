---
title: Expo nested navigation
date: 2026-04-08
description: Combining tab and nested navigation
---

# Nested navigation

- Now that we have set up tab navigation for our project, we can nest stacked navigation in one of the folders.  What this means in practice is that we can access parts of the app via tab navigation and then navigate back and forth within that subsection using stack navigation.
- Assumptions:  You have set up tab navigation for the app overall, and stack navigation within one of the tab folders.  Also, in terms of file structure, you can eventually replace the file names with dynamic routing, but for the purposes of this tutorial, we will assume hardcoded file names.

## Setting up nested stack navigation

- Navigation requires navigation elements on each page within a folder to connect the pages.  Here's what the code looks like:

```
import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Lesson01() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Lesson 01</Text>
      <Button
        title="Go to lesson 2"
        onPress={() => router.push("/study/lesson-02")}
      />
    </View>
  );
}
```

Likewise, back and forth for the second screen:

```
import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Lesson02() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Lesson 02</Text>
      <Button
        title="Go to lesson 1"
        onPress={() => router.push("/study/lesson-01")}
      />

      <Button
        title="Go to lesson 3"
        onPress={() => router.push("/study/lesson-03")}
      />
    </View>
  );
}
```


- Note that routing is relative to the app folder.
- You can use 'router.back' instead of 'router.push' to navigation from lesson 2 back to lesson 1.
- Note also that we are using linear stack navigation here, which allows back and forth navigation, but is different from hierarchical navigation, which allows users to navigate or jump using a tree or site directory.

Source:
https://docs.expo.dev/router/basics/navigation/