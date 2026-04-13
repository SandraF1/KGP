---
title: Components and props
date: 2026-04-09
description: Components and props in React Native
---

Components and props

We can now re-examine the code for the use of components and props.

React Native is a component-based framework  Every mobile screen has exactly one default export component, which acts as the entry point for the page.  In the code above, LessonPage is the component corresponding to app/study/[lessonId].tsx.

Within the component, props are used to customise the content of the component.  It is props that make it possible to dynamically render the page's content. The code looks up the object corresponding to the lessonId prop and renders the other props (name, lowercase letter, pronunciation) defined in that instance of the LessonPage component.  In this way, the LessonPage component acts a template for the lesson objects but without requiring a separate component for each lesson.

```
import { getLessonNavigator } from "@/utils/lessonNavigator";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function LessonPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId: string }>();

  const lessons: Record<
    string,
    { name: string; lowercase: string; pronunciation: string }
  > = {
    U1L1M1: { name: "Alpha", lowercase: "α", pronunciation: "a as in father" },
    U1L1M2: { name: "Beta", lowercase: "β", pronunciation: "b as in ball" },
  };

  const lessonsData = lessons[params.lessonId ?? ""] || {
    name: "-",
    lowercase: "-",
  };

  const { prevLessonId, nextLessonId } = getLessonNavigator(
    params.lessonId ?? "",
  );
  return (
    <>
      <Stack.Screen options={{ title: lessonsData.name }} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>LessonId: {params.lessonId}</Text>
        <Text>name: {lessonsData.name}</Text>
        <Text> lowercase: {lessonsData.lowercase}</Text>
        <Text>pronunication: {lessonsData.pronunciation}</Text>

        {prevLessonId && (
          <Button
            title="Back"
            onPress={() => router.push(`/study/${prevLessonId}`)}
          />
        )}

        {nextLessonId && (
          <Button
            title="Next"
            onPress={() => router.push(`/study/${nextLessonId}`)}
          />
        )}
      </View>
    </>
  );
}
```

A simpler example of components and props is below.

```
import React from "react";
import { Text, View } from "react-native";

// Define props type
type LessonProps = {
  name: string;
  lowercase: string;
  pronunciation: string;
};

// Single Lesson component
const Lesson = (props: LessonProps) => {
  return (
    <View>
      <Text>
        {props.name}, {props.lowercase}, {props.pronunciation}
      </Text>
    </View>
  );
};

// Parent Lessons component
const Lessons = () => {
  return (
    <View>
      <Lesson name="Alpha" lowercase="α" pronunciation="a as in father" />
      <Lesson name="Beta" lowercase="β" pronunciation="b as in ball" />
    </View>
  );
};

// Default export
export default Lessons;
```
Source:
https://reactnative.dev/docs/tutorial
