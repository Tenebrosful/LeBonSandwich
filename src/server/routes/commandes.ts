import * as express from "express";
const commandes = express.Router();

const persistDataCommandes = [
    {
        date_commande: "2022-01-05 12:00:23",
        id: "AuTR4-65ZTY",
        mail_client: "jan.neymar@yaboo.fr",
        montant: 25.95
    },
    {
        date_commande: "2022-01-06 16:05:47",
        id: "657GT-I8G443",
        mail_client: "jan.neplin@gmal.fr",
        montant: 42.95
    },
    {
        date_commande: "2022-01-07 17:36:45",
        date_livraison: "2022-01-08 12:30",
        id: "K9J67-4D6F5",
        mail_client: "claude.francois@grorange.fr",
        montant: 14.95,
        nom_client: "claude francois"
    },
];

commandes.get("/", (req, res) => {
    const returnData = persistDataCommandes.map(v => {
        return { date_commande: v.date_commande, id: v.id, mail_client: v.mail_client, montant: v.montant };
    });
    
    res.status(200).json({
        commandes: returnData,
        count: returnData.length,
        type: "collection"
    });
});

    res.status(200).json(resData);
});

export default commandes;