---
author: "Roberto Conte Rosito"
title: "How to use useRef with React Hook Form"
date: "2023-01-30"
description: "Handle refs with React Hook Form"
tags: [
	"reactjs",
	"react-hook-form",
	"use-ref",
	"notes"
]
---

_Welcome back to my dev notes!_

Today I was in trouble for a while because I wanted to use a ref inside a React-Hook-Form form
with an input of type `file` and I couldn't do it.

The problem was quite simple, suppose you have a form like this:

```jsx
const { register } = useFormContext();
const fileInputRef = useRef(null);
const handleClick = useCallback(() => {
  fileInputRef.current.click();
}, [fileInputRef]);
return (
  <>
    <input type="file" ref={fileInputRef} {...register("file")} />
    <button onClick={handleClick}>Upload</button>
  </>
);
```

And guess what? It didn't work. The `fileInputRef` was `null` inside the `handleClick` function and I couldn't understand why. After googling for a while I found the solution: you have to use the `register` method in a different way to make it work:

```jsx
const { register } = useFormContext();
const { ref, ...inputProps } = register("file");
const fileInputRef = useRef(null);
const handleClick = useCallback(() => {
  fileInputRef.current.click();
}, [fileInputRef]);

return (
  <>
    <input
      type="file"
      ref={(e) => {
        fileInputRef.current = e;
        ref(e);
      }}
      {...inputProps}
    />
    <button onClick={handleClick}>Upload</button>
  </>
);
```

I hope this will help you if you are in trouble with refs and React Hook Form.

**Notes**: this is a dev note, not a tutorial. If you want to learn more about React Hook Form, check out the [official documentation](https://react-hook-form.com/).
