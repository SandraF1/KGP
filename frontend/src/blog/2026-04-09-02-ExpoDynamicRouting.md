---
title: Expo dynamic routing
date: 2026-04-09
description: How Expo handles dynamic routing
---

# How dynamic routing works through file naming conventions

A file with square brackets in Expo allows for dynamic routing.  Expo extracts whatever data occupies the placeholder in [] in the internal URL-like route, here a lessonId of type string.  This becomes available as params.lessonId in the component.  This placeholder value is determined by navigation actions such as router.push("/study/U1L1M1"), which update the current route.


```
import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";

export default function LessonPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId: string }>();

  const lessons: Record<string, { name: string; lowercase: string }> = {
    'U1L1M1': { name: "Alpha", lowercase: "α" },
    'U1L1M2': { name: "Beta", lowercase: "β" },
  };

  const lessonsData = lessons[params.lessonId ?? ""] || {
    name: "-",
    lowercase: "-",
  };
  return (
    <>
      <Stack.Screen options={{ title: lessonsData.name }} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>LessonId: {params.lessonId}</Text>
        <Text>name: {lessonsData.name}</Text>
        <Text> lowercase: {lessonsData.lowercase}</Text>

      
      </View>
    </>
  );
}
```

## Type definitions

Record defines the types of the key-value pairs.  It means that the lessons object can have any key of type string, not just the hardcoded values we have temporarily defined here.  This allows TypeScript to look up a lesson safely (without the wrong shape).

##  How values are passed in via dynamic routing

const lessonsData will look up the lessons object corresponding to the lessonId and extract its properties, making them available to this specific [lessonId] file.

## A homepage still required

You will still need to define a starting point for the folder containing the dynamic routing. For example, the file below is the first screen in the study folder and redirects to the first mini unit in the list of screens.  Thereafter, dynamic routing can handle navigation.

```
/study/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function StudyIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/study/U1L1M1");
  }, []);
  return null;
}

```

With this setup, LessonPage now acts as a gateway or template for all lesson screens, which are dynamically rendered.



Source:  https://www.codesofphoenix.com/articles/expo/expo-router-nav#dyn