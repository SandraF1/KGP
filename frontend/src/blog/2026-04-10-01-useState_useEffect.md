---
title: useState and useEffect
date: 2026-04-10
description: useState and useEffect
---


# Definition of hooks

React is a component-based library.  Every component has a beginning, middle and end, or more technically, a mounting, updating and unmounting phase.  Hooks are functions that allow functional components to use state and side effects by connecting with the component lifecycle.  For example, a code block may run after the component first mounts, state may be changed during updates and clean up occurs after the component unmounts.




## useState

useState is a built-in React hook.  It helps manage state, which allows React to track the value of declared variables.  An example is below.

```
import React, { useState } from "react";
import { View, Text, Button } from "react-native";

export default function AlphabetCounter(): JSX.Element {
  const fullAlphabet: string[] = ["α", "β", "γ"];



  const [alphabetCount, setAlphabetCount] = useState<number>(0);

  const isEnd: boolean = alphabetCount >= fullAlphabet.length;

  const currentAlphabet: string = isEnd
    ? "End"
    : fullAlphabet[alphabetCount];

  function handleButtonClick(): void {
    if (alphabetCount < fullAlphabet.length - 1) {
      setAlphabetCount((prev) => prev + 1);
    }
  }

  return (
    <View>
      <Text>Alphabet tracker</Text>

      <Text>
        {alphabetCount + 1} corresponds to {currentAlphabet}
      </Text>

      <Button title="Next letter" onPress={handleButtonClick} />
    </View>
  );
}
```

## useEffect

useEffect is a hook that performs actions in functional components.  It runs after the component first renders and can be configured to run again when the value of its dependency array changes. An empty dependency array (empty square brackets) means that it will run only once after initial render.


An example is below.

```
import React, { useState, useEffect } from "react";

function Counter(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("Start clicking!");
const fullAlphabet: string[] = ["α", "β", "γ"];

const isEnd: boolean = count >=fullAlphabet.length;

const currentAlphabet: string = isEnd ? "" : fullAlphabet[count];

  useEffect(() => {
    if (count === 0) {
      setMessage("Start clicking!");
    } else if (count < fullAlphabet.length) {
      setMessage(`${count+1} corresponds to ${currentAlphabet}`);
    } else {
      setMessage("End of counting");
    }
  }, [count]);

  return (
    <div>
      <h1>{count}</h1>
      <p>{message}</p>

      <button onClick={() => setCount(prev => prev + 1)}
 disabled={count >= fullAlphabet.length}>
        Increase

      </button>
    </div>
  );
}

export default Counter;
```

Note:  useEffect is not strictly necessary to update the message above. A tidier example is below, but the above was included to demonstrate how useEffect works.

```
import React, { useState } from "react";

function Counter(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const fullAlphabet: string[] = ["α", "β", "γ"];

  const message =
    count === 0
      ? "Start clicking!"
      : count < fullAlphabet.length
      ? `${count + 1} corresponds to ${fullAlphabet[count]}`
      : "End of counting";

  function handleIncrease(): void {
    setCount((prev) => prev + 1);
  }

  function handleReset(): void {
    setCount(0);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Alphabet Counter</h1>

      <h2>Count: {count}</h2>

      <p>{message}</p>

      <button onClick={handleIncrease}
 disabled={count >= fullAlphabet.length}>Increase</button>

      <button onClick={handleReset} style={{ marginLeft: 10 }}>
        Reset
      </button>
    </div>
  );
}

export default Counter;
```

## useState and useEffect together

Together, useState and useEffect can help track state in an app.  The flow works this way:
- useState initialises a variable with a default value
- After first render, useEffect runs and triggers a function (for example, setState)
- The function (setState or other) internally updates the state/value of the variable
- The state change triggers a rerendering of the component
- useState contains this new value and the UI renders and reflects the change in value
- This is repeated every time the useEffect dependency changes, or else it may happen just once if the dependency is left empty

Source:
https://www.contentful.com/blog/react-usestate-hook/
https://www.syncfusion.com/blogs/post/react-useeffect-usestate-hooks
https://medium.com/@magahcicek/react-native-state-and-lifecycle-core-concepts-and-how-to-use-them-a0a2e637f6cd