import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripecheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const Stripecheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    eror: "",
    address: "",
  });

  const token = isAutheticated() && isAutheticated().token;
  const userId = isAutheticated() && isAutheticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const makePayment = () => {
    const body = {
      token,
      products,
    };
    const hearders = {
      "content-type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      hearders,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);

        const { status } = response;
        console.log("STATUS", status);
        const orderData = {
          products: products,
          transaction_id: response.transaction_id,
          amount: response.transaction_id.amount,
        };
        // createOrder(user, token, orderData);
        //Todo empty the card
        cartEmpty(() => {
          console.log("did we got a crash");
        });
        //TODO: force rel setReload
        setReload(!reload);
      })
      .catch((error) => console.log(error));
  };

  const showStripeButton = () => {
    return isAutheticated() ? (
      <StripecheckoutButton
        stripeKey="pk_test_51HBIlVElH1UyXDxXLtHzMMkcKQUcuXvgitXynyZglhVkKJdVqSyo7d49ZZrMFpSwOWOwaqWiQzABTonWlS1e7hrE00rVLwxjmc"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buying a products"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success"> Pay with stripe</button>
      </StripecheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className=" text-white"> Stripecheckout {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};
export default Stripecheckout;
