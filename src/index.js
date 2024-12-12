import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./UserContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <ChakraProvider>
          <UserProvider>
            <Layout />
          </UserProvider>
          
        </ChakraProvider>
        
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
