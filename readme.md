# **PAYBROKERS INTEGRATION PAYIN AND PAYOUT**
To get started you need your paybroker access keys and your SSL access certificates

### 1- Save our certificates in your aplication

### 2- Run: 'yarn add paybrokers-v3' or 'npm install paybrokers-v3'

## First connection in PayIn methods
> async function main() {
> const payInPayBrokers = new PayInPayBrokers(
>    "YOUR LOGIN",
>    "YOUR PASSWORD",
>    "YOUR CERTICATED PATH",
>    "YOUR KEY PATH"
>  );

>  const connection = await payInPayBrokers.connect();
>  console.log("My access token is: ", connection);
>}
