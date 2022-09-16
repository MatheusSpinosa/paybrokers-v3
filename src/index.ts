import { PayInPayBrokers } from "./PayInPayBrokers";
import { PayOutPayBrokers } from "./PayOutPayBrokers";

async function main() {
  const payInPayBrokers = new PayInPayBrokers(
    "YOUR LOGIN",
    "YOUR PASSWORD",
    "YOUR CERTICATED PATH",
    "YOUR KEY PATH"
  );

  const connection = await payInPayBrokers.connect();
  console.log("My access token is: ", connection);
}

export { PayInPayBrokers, PayOutPayBrokers };
