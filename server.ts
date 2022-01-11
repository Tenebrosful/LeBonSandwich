//@ts-ignore

import * as express from "express";


const app = express();
const port = 5000;

let commandes = {
    "type": "collection",
    "count": 3,
    "commandes": [
        {
        "id": "AuTR4-65ZTY",
        "mail_client": "jan.neymar@yaboo.fr",
        "date_commande": "2022-01-05 12:00:23",
        "montant": 25.95
        },
        {
        "id": "657GT-I8G443",
        "mail_client": "jan.neplin@gmal.fr",
        "date_commande": "2022-01-06 16:05:47",
        "montant": 42.95
        },
        {
        "id": "K9J67-4D6F5",
        "mail_client": "claude.francois@grorange.fr",
        "date_commande": "2022-01-07 17:36:45",
        "montant": 14.95
        },
    ]
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/commande", (req, res) => {
    res.send(commandes);
})

app.use(((req, res) => {
    res.sendStatus(404)
}))

app.listen(port, function () {
    console.log(`Server up and running at localhost:${port}`)
})