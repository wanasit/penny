penny
=====

A natural language currency parser in Javascript. (A modified version of [Chrono](https://github.com/wanasit/chrono))

```javascript
> penny.parse('This is $25')
[ { index: 8,
    text: '$25',
    number: 25,
    numberMin: undefined,
    numberMax: undefined,
    currency: 'USD',
    tags: { GeneralNumberParser: true } } ]

> penny.parse('年収：800万円～2000万円')
[ { index: 3,
    text: '800万円～2000万円',
    number: 8000000,
    numberMin: 8000000,
    numberMax: 20000000,
    currency: 'JPY',
    tags:
    { GeneralNumberParser: true,
      MergeRangeResult: true } } ]

```

#### Node.js 

    npm install penny-node

#### Browser

    <script src="https://rawgithub.com/wanasit/penny/master/penny.min.js"></script>


