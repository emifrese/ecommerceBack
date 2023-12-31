const express = require("express");
const cors = require("cors");
const app = express();
const mercadopago = require("mercadopago");

app.use(express.json());

const allowDomains = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowDomains.includes(origin) !== -1) {
      //El origen del request esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(cors(corsOptions));

mercadopago.configure({
  // access_token: "TEST-6542795390100724-072316-855ebe1badc867c81d6a09fad25912be-130460434",
  access_token:
    "APP_USR-6225908954155218-072316-3d8c5b2169fb7227dfce83b7a87e9a17-1431662596",
});

app.get("/", function (req, res) {
  res.send("el servidor de mercado pago funciona");
});

app.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.unit_price),
        quantity: Number(req.body.quantity),
        currency_id: "ARS",
      },
    ],
    back_urls: {
      success: process.env.FRONTEND_URL,
      failure: process.env.FRONTEND_URL,
      pending: "",
    },
    auto_return: "approved",
    // payment_methods: {
    //   excluded_payment_types: [
    //     {
    //       id: "credit_card",
    //     },
    //     {
    //       id: "ticket",
    //     },
    //   ],
    // },
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
