---
title: Sequential navigation logic
date: 2026-04-09
description: How to add back and forth navigation logic 
---

#  Why use sequential navigation logic?

We are using dynamic routing.  The [lessonId].tsx template page can be configured to include reusable navigate back and forth buttons.

##  The necessary files:

- We will need a lessonOrder.ts hardcoding the order of the files.
- We will need a lessonNavigator.ts file to define the sequential navigation logic.
- We will need to add buttons that use the above to navigate back and forth between the pages.

## lessonOrder.ts

frontend/data/lessonOrder.ts (data folder parallel to app folder)

```
export const lessonOrder =[
'U1L1M1',
'U1L1M2',
];
```

This is hardcoded in the frontend now, but can eventually be fetched from a database.

## lessonNavigator.ts

frontend/utils/lessonNavigator.ts (utils folder parallel to app folder)

```
import { lessonOrder } from "@/data/lessonOrder";

export function getLessonNavigator(currentId: string) {
  const currentIndex = lessonOrder.indexOf(currentId);

  const prevLessonId = currentIndex > 0 ? lessonOrder[currentIndex - 1] : null;
  const nextLessonId =
    currentIndex >= 0 && currentIndex < lessonOrder.length - 1
      ? lessonOrder[currentIndex + 1]
      : null;

  return { prevLessonId, nextLessonId };
}
```

- indexOf retrieves the index of the current page, essentially converting its position in the lessonOrder array to a number.  Note that this uses 0 indexing so the first page has an index of 0.
- The prevLessonId logic is:  If the currentIndex is at least 1 (a previous file exists at index 0 or greater), the previousLessonId is a number equal to the current index minus one. Otherwise, the ternary operator defaults the value of prevLessonId to null (prev button will be disabled/not rendered).
- The nextLessonId logic is:  If the current index is greater than or equal to 0 (it exists) and the currentIndex is less than the index of the last page (there is a next file), then the nextLessonId will be the current index plus one.  Otherwise, the ternary operator defaults to null (next button will be disabled/not rendered).
 

## Back and forth buttons on the [lessonId].tsx page

```
import { getLessonNavigator } from "@/utils/lessonNavigator";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function LessonPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId: string }>();

  const lessons: Record<string, { name: string; lowercase: string }> = {
    U1L1M1: { name: "Alpha", lowercase: "α" },
    U1L1M2: { name: "Beta", lowercase: "β" },
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

- Note that the LessonNavigator must be imported to be available.
- The null operator ensures that the Buttons only render where a previous or next lessonId exists.
- The button uses the router.push command to navigate dynamically to the previous or next page.

Source:
ChatGPT

