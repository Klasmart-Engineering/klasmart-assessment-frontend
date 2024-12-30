# frontend-state

This repo is meant to be used for React frontend applications, including Micro Frontends.

Under the hood the library utilizes [Recoil](https://recoiljs.org/). It exposes the same functions, but renamed (Recoil -> Global) to hide the underlying technology, incase it would change in the future.

## Installation

```bash
npm install @kl-engineering/frontend-state
```

## Usage
```jsx
// providers.tsx
<GlobalStateProvider cookieDomain="example.com">
...
</GlobalStateProvider>

// atoms.ts
export const specialNumberState = atom({
    key: `specialNumber`,
    default: 42,
});

// Component.tsx
...
const [ specialNumber, setSpecialNumber ] = useGlobalState(specialNumberState);

return (
    <>
        <span>{specialNumber}</span>
        <input onChange={(event) => setSpecialNumber(event.currentTarget.value)}/>
    </>
);
...
```

## Predefined atom states
The library also comes with a few predefined atom states.
* `localeState`: automatically syncs with the **locale** cookie for the specified cookie domain.
