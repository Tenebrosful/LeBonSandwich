export type ResponseType = {
  type: "collection" | "resource"
};

export type ResponseCollection = {
  count: number
} & ResponseType;

export type ResponseAllCommandes = {
  commandes: {
      created_at: Date,
      id: string,
      livraison: Date,
      nom: string,
      status: number,
      links: ResponseCommandeLinksInner
  } []
} & ResponseCollection;

export type ResponseCommande = {
  date_commande: Date,
  date_livraison: Date,
  id: string,
  mail_client: string,
  montant: number,
  nom_client: string,
  items?: ResponseItem[]
} & ResponseCommandeLinks;

export type ResponseCommandeLinks = { 
  links: ResponseCommandeLinksInner
};

export type ResponseCommandeLinksInner = { 
  items: { href: string },
  self: { href: string }
};

export type ResponseItem = {
  id: number,
  libelle: string,
  quantite: number,
  tarif: number
};