var express = require("express"),
  bonnou = require("./routes/bonnou");

var app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get("/favicon.ico", function(req, res) {
  res.end();
  return;
});
app.get("/api", bonnou.findAll);
app.get("/api/:id", bonnou.findById);
app.get("*", function(req, res) {
  res.status(404).send({ error: "bonnou not found" });
});

app.listen(process.env.PORT || 3000);
console.log(`Listening on port ${process.env.PORT}...`);
