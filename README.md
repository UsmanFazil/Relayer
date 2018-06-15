### Follow these commands to run the project

1- Clone the repo first

2- Install dependencies
```
yarn
```

3- In a seprate terminal window go to project directory and run this command
```
yarn testrpc
```

4- In another seprate terminal window got to project directory and run these commands to start our Standard relayer API
```
yarn api
yarn server
```

5- Compile ts code into js by this command
``` 
yarn functions
```

## To create and post order on Relayer orderbook
```
yarn function:post
```

## To get the orderbook from Relayer
```
yarn function:orderbook
```

## To get order from Relayer's order book and fill it
```
yarn function:fill
```
