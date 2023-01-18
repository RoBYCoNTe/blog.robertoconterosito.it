---
author: "Roberto Conte Rosito"
title: "How to use setValue with React Hook Form"
date: "2023-01-18"
description: "Don't loose your mind inside a React Hook Form form"
tags: [
	"reactjs",
	"react-hook-form",
	"set-value",
	"notes"
]
---

My dev notes about how to set value with React Hook Form.
Following the [official documentation](https://react-hook-form.com/api/useform/setvalue)
you can set a value with React Hook Form using the `setValue` method to change
it programmatically like this:

```jsx
const { setValue } = useForm();
...
setValue("firstName", "bill");
```

**But this is wrong!**

You have to use the `setValue` method to change the value of a field programmatically,
**but only** using the `useFormContext` hook instead of the `useForm` hook:

```jsx
const { setValue } = useFormContext();
...
// Somewhere inside the form
setValue("firstName", "bill");
```

**Remember:** the first one is used during initialization of the form,
the second one is used inside the form.
