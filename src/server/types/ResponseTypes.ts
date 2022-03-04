export type ResponseType = {
  type: "collection" | "resource"
};

export type ResponseCommande = {
  commande: {
    date_commande: Date,
    date_livraison: Date,
    id: string,
    mail_client: string,
    montant: number,
    nom_client: string,
    items?: ResponseItem[]
  }
};

export type ResponseCommandeLinks = {
  links: {
    items?: { href: string },
    self?: { href: string }
  }
};

export type ResponseItem = {
  id: number,
  libelle: string,
  quantite: number,
  tarif: number
};