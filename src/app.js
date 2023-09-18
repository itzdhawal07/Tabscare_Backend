require("dotenv").config();
const { testConnection } = require('./connections/sequelize');

const express = require("express");
var bodyparser = require("body-parser");
const i18n = require("./i18n/i18n");
const http = require("http");
const https = require("https");
var fs = require('fs');
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { PORT } = require("../config/key");

// const server = https.createServer({
// 	key: fs.readFileSync('./certs/mymeeting.key', 'utf8'), 
// 	cert: fs.readFileSync('./certs/mymeeting.crt', 'utf8'),
// 	ca: fs.readFileSync('./certs/mymeeting.ca.cert', 'utf8')
// },app);

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance

// TODO: Only till alfa remove in beta and change mobile side to json.
app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json({ limit: "500mb" }));

// cors
app.use(cors({
	origin: "*",
	credentials:true,//access-control-allow-credentials:true
	optionSuccessStatus:200
}));
app.options("*", cors());

// language file
app.use(i18n);

// app.use((req, res, next) => {
// 	req.io = io;
// 	return next();
// });

// connecting to database
testConnection();

// routing
app.get("/", (req, res) => {
	res.send("Testing from the node.");
});

const auth = require("./routes/auth.route");
app.use("/api/v1/auth", auth);

const user = require("./routes/user.route");
app.use("/api/v1/user", user);

const category = require("./routes/category.route");
app.use("/api/v1/category", category);

const product = require("./routes/product.route");
app.use("/api/v1/product", product);

const search = require("./routes/search.route");
app.use("/api/v1/search", search);

// const location = require("./routes/location.route");
// app.use("/api/v1/location", location);

const address = require("./routes/address.route");
app.use("/api/v1/address", address);

const prescription = require("./routes/prescription.route");
app.use("/api/v1/prescription", prescription);

const wishlist = require("./routes/wishlist.route");
app.use("/api/v1/wishlist", wishlist);

const cart = require("./routes/cart.route");
app.use("/api/v1/cart", cart);

const checkout = require("./routes/checkout.route");
app.use("/api/v1/checkout", checkout);

const order = require("./routes/order.route");
app.use("/api/v1/order", order);

const manufacturer = require('./routes/manufacturer.route');
app.use("/api/v1/manufacturer", manufacturer);

//Server Connection
server.listen(PORT, () => {
	console.log("server listening on port : -> ", PORT);
});