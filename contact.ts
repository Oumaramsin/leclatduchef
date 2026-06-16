import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

import fs from 'fs';

dotenv.config();

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Clés reCAPTCHA
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || 'VOTRE_CLE_SECRETE_RECAPTCHA';
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '6LdeKiItAAAAAIhJ1Io_hsmdquX2TsMWfNAR8oSy';


app.get('/', (req, res) => {
  try {
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace('__RECAPTCHA_SITE_KEY__', RECAPTCHA_SITE_KEY);
    res.send(html);
  } catch (error) {
    res.status(500).send("Erreur lors du chargement de la page.");
  }
});

// Servir les autres fichiers du site web (CSS, images)
app.use(express.static('.'));

app.post('/api/contact', async (req, res) => {
  const { 
    prenom, nom, email, telephone, prestation, 
    convives, evenement, lieu, message, 
    'g-recaptcha-response': recaptchaResponse 
  } = req.body;

  // 1. Vérification du CAPTCHA
  if (!recaptchaResponse) {
    return res.status(400).json({ success: false, message: 'Le CAPTCHA est manquant.' });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
    const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json() as any;

    if (!recaptchaData.success) {
      return res.status(400).json({ success: false, message: 'La validation du CAPTCHA a échoué.' });
    }

    // 2. Configuration de Nodemailer pour l'envoi d'email
    // À REMPLACER PAR VOS VRAIS IDENTIFIANTS D'EMAIL
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER || 'votre_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'votre_mot_de_passe_application'
      }
    });

    const mailOptions = {
      from: `"${prenom} ${nom}" <${process.env.EMAIL_USER || 'votre_email@gmail.com'}>`,
      replyTo: email,
      to: 'contact@leclatduchef.fr', // L'adresse qui recevra les devis
      subject: `Nouveau devis : ${prestation} - ${prenom} ${nom}`,
      text: `
Vous avez reçu une nouvelle demande de devis sur L'Éclat du Chef.

Informations du client :
- Prénom : ${prenom}
- Nom : ${nom}
- Email : ${email}
- Téléphone : ${telephone}

Détails de l'événement :
- Prestation : ${prestation}
- Nombre de convives : ${convives}
- Date : ${evenement || 'Non précisée'}
- Lieu : ${lieu || 'Non précisé'}

Message supplémentaire :
${message || 'Aucun message'}
      `
    };

    // 3. Envoi de l'email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Votre demande a bien été envoyée !' });

  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
});

app.listen(port, () => {
  console.log(`Le serveur backend tourne sur http://localhost:${port}`);
});
