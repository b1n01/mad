# Mad

Coming soon...

# AST
The Mad abstract syntax tree is composed by six possible nodes: [element](#element), [terminal](#terminal), [inline](#inline), [attribute](#attribute), [component](#component), [argument](#argument).

<a name="element"></a>
```
ELEMENT = {
    category: "element",
    type: "p"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"quote"|"pre",
    value: [TERMINAL|INLINE],
    attrs: [ATTRIBUTE]
}
```

<a name="terminal"></a>
```
TERMIANL = {
    category: "terminal",
    type: "empty"|"string",
    value: STRING|NULL
}
```

<a name="inline"></a>
```
INLINE = {
    category: "inline",
    type: "strong"|"italic"|"strike"|"code",
    value: [TERMINAL|INLINE]
}
```

<a name="attribute"></a>
```
ATTRIBUTE = {
    category: "attribute",
    type: "id"|"class"|"bool"|"named",
    name: STRING|NULL,
    value: STRING|NULL
}
```

<a name="component"></a>
```
COMPONENT {
    category: "component",
    name: STRING,
    value:[ARGUMENT]
}
```

<a name="argument"></a>
```
ARGUMENT = {
    category: "argument",
    type: "string"|"component",
    name: STRING,
    value: STRING|COMPONENT
}
```