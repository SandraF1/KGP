---
title: Reusable components
date: 2026-04-10
description: A reusable grid picker
---


# Creating a grid-based picker

## What is a picker?

A picker is a selection interface.  It can be a drop-down, but here we will define a grid-based picker to accommodate many selectable units. The focus is on creating a reusable component that will render on several different screens.

## Importing necessary components

```
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
```

We will be using Pressable to create pressable units in a grid.

## Data

For convenience, we hardcode the data in the grid picker component definition, but in practice it can be stored elsewhere and imported into the screen that uses the picker

```
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

const animals: AnimalOption[] = [
  { id: 1, label: "Dog", value: "dog" },
  { id: 2, label: "Cat", value: "cat" },
  { id: 3, label: "Bird", value: "bird" },
];

## Component definition

```
export default function App() {
  const [animal, setAnimal] = useState<Animal | null>(null);

  return (
    <View style={styles.container}>

      {/* GRID */}
      <View style={styles.grid}>
        {animals.map((item) => {
          const isSelected = animal === item.value;

          return (
            <Pressable
              key={item.id}
              onPress={() => setAnimal(item.value)}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
              ]}
            >
              <Textf
                style={[
                  styles.text,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* OUTPUT */}
      <Text style={styles.result}>
        Selected: {animal ?? "None"}
      </Text>

    </View>
  );
}
```

- The grid component is mapped over, returning a pressable component corresponding to the item id and with text embedded corresponding to the item label.
- In addition, styling is applied conditionally so that the currently selected item has a specific styling for its pressable area and text. In practice, this happens when the mapping function iterates over each item in the array and the user selects one of the values from the grid.

## Defining grid styling

```
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  card: {
    width: "40%",
    padding: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    alignItems: "center",
  },

  selectedCard: {
    backgroundColor: "#4f46e5",
  },

  text: {
    fontSize: 16,
  },

  selectedText: {
    color: "white",
    fontWeight: "bold",
  },

  result: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
```

Source:
ChatGPT
https://www.tricentis.com/learn/build-a-react-native-picker-tutorial-with-examples
