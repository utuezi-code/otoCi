import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation des champs obligatoires
    const required = ['prenom', 'nom', 'date_naissance', 'telephone', 'email',
                      'ville', 'type_contrat', 'secteur', 'poste', 'anciennete',
                      'salaire_net', 'budget_vehicule', 'delai_achat'];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Champ requis manquant : ${field}` },
          { status: 400 }
        );
      }
    }

    // Générer un numéro de référence unique
    const ref = `ACI-2026-${Date.now().toString(36).toUpperCase()}`;

    const payload = {
      ref_number:           ref,
      statut:               'en_attente',
      prenom:               body.prenom,
      nom:                  body.nom,
      date_naissance:       body.date_naissance,
      sexe:                 body.sexe || null,
      telephone:            body.telephone,
      email:                body.email,
      ville:                body.ville,
      situation_familiale:  body.situation_familiale || null,
      type_contrat:         body.type_contrat,
      secteur:              body.secteur,
      poste:                body.poste,
      anciennete:           body.anciennete,
      salaire_net:          parseInt(body.salaire_net) || 0,
      autres_revenus:       parseInt(body.autres_revenus) || 0,
      charges_mensuelles:   parseInt(body.charges_mensuelles) || 0,
      budget_vehicule:      body.budget_vehicule,
      duree_remboursement:  body.duree_remboursement || null,
      apport_personnel:     body.apport_personnel || null,
      taux_acceptable:      body.taux_acceptable || null,
      marque_preferee:      body.marque_preferee || null,
      type_vehicule:        body.type_vehicule || null,
      motorisation:         body.motorisation || null,
      delai_achat:          body.delai_achat,
      commentaire:          body.commentaire || null,
    };

    const { error } = await supabase.from('inscriptions').insert([payload]);

    if (error) {
      console.error('[Supabase error]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ref_number: ref }, { status: 201 });

  } catch (err) {
    console.error('[API error]', err);
    return NextResponse.json({ error: 'Erreur serveur inattendue' }, { status: 500 });
  }
}
