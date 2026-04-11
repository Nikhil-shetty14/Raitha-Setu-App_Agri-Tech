import { db } from './firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const MANDI_CONTACTS = [
  { name: '📱 Raitha Helpline (State)', phone: '1800-425-3553', type: 'Toll-Free Support', order: 0 },
  { name: 'Davanagere APMC', phone: '08192-255044', type: 'Office-Secretary', order: 1 },
  { name: 'Tiptur Coconut Mandi', phone: '08134-250156', type: 'Specialized', order: 2 },
  { name: 'Mysuru Fruit & Veg', phone: '0821-2521101', type: 'Official', order: 3 },
  { name: 'Hassan Coffee/Spice', phone: '08172-256186', type: 'State Support', order: 4 },
  { name: 'Kolar Tomato Market', phone: '08152-222217', type: 'Official', order: 5 },
];

const BANNERS = [
  { title: 'Organic Boost', sub: 'Eco-friendly fertilizer for your fields', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800' },
  { title: 'New Mahindra Series', sub: 'Upgrade your tractor with 0% EMI', img: 'https://images.unsplash.com/photo-1594488651083-294578c77161?q=80&w=800' },
  { title: 'Karnataka Subsidies', sub: 'Register for seed distribution now', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800' },
];

const MARKETS = [
  // ━━━ BANGALORE REGION ━━━
  { name: 'Yeshwanthpur APMC', type: 'APMC Market', lat: 13.0234, lng: 77.5501, prices: { 'Onion': 1125, 'Tomato': 1090, 'Potato': 1542, 'Rice': 3833, 'Wheat': 3026, 'Maize': 1860 }, contact: '080-23371695' },
  { name: 'K.R. Puram Mandi', type: 'Local Mandi', lat: 13.0112, lng: 77.7058, prices: { 'Onion': 1050, 'Tomato': 1200, 'Potato': 1480, 'Rice': 3900, 'Wheat': 2950, 'Maize': 1920 }, contact: '1800-425-3553' },
  { name: 'Malleswaram Market', type: 'Local Mandi', lat: 12.9984, lng: 77.5714, prices: { 'Onion': 1180, 'Tomato': 1050, 'Potato': 1600, 'Rice': 3750, 'Wheat': 3100, 'Maize': 1800 }, contact: '1800-425-3553' },
  { name: 'Ramanagara APMC', type: 'APMC Market', lat: 12.7233, lng: 77.2764, prices: { 'Onion': 1100, 'Tomato': 1400, 'Potato': 1520, 'Rice': 4100, 'Wheat': 2880, 'Maize': 2000 }, contact: '080-27274455' },
  { name: 'Channapatna Mandi', type: 'Local Mandi', lat: 12.6465, lng: 77.1996, prices: { 'Onion': 1080, 'Tomato': 1350, 'Potato': 1490, 'Rice': 4050, 'Wheat': 2920, 'Maize': 1950 }, contact: '1800-425-3553' },
  // ━━━ MYSORE REGION ━━━
  { name: 'Mysuru Mandi', type: 'Local Mandi', lat: 12.2958, lng: 76.6394, prices: { 'Onion': 1180, 'Tomato': 1050, 'Potato': 1600, 'Rice': 3750, 'Wheat': 3100, 'Maize': 1800 }, contact: '0821-2521101' },
  { name: 'Nanjangud APMC', type: 'APMC Market', lat: 12.1158, lng: 76.6800, prices: { 'Onion': 1160, 'Tomato': 1080, 'Potato': 1580, 'Rice': 3800, 'Wheat': 3050, 'Maize': 1820 }, contact: '08221-226027' },
  { name: 'Hunsur Mandi', type: 'Local Mandi', lat: 12.3088, lng: 76.2908, prices: { 'Onion': 1200, 'Tomato': 1020, 'Potato': 1620, 'Rice': 3700, 'Wheat': 3150, 'Maize': 1780 }, contact: '1800-425-3553' },
  // ━━━ HASSAN REGION ━━━
  { name: 'Hassan APMC', type: 'APMC Market', lat: 13.0033, lng: 76.1004, prices: { 'Onion': 1080, 'Tomato': 1150, 'Potato': 1500, 'Rice': 3900, 'Wheat': 2950, 'Maize': 1900 }, contact: '08172-256186' },
  { name: 'Arsikere APMC', type: 'APMC Market', lat: 13.3135, lng: 76.2570, prices: { 'Onion': 1060, 'Tomato': 1220, 'Potato': 1480, 'Rice': 3950, 'Wheat': 2900, 'Maize': 1980 }, contact: '08174-232203' },
];

const SCHEMES = [
  { title: "PM-KISAN", desc: "Get ₹6,000 yearly in your bank account for farming needs.", eligible: true, applyLink: "https://pmkisan.gov.in/RegistrationFormNew.aspx", lang: 'English' },
  { title: "Kisan Credit Card (KCC)", desc: "Low-interest loans for seeds, fertilizers, and equipment.", eligible: true, applyLink: "https://www.myscheme.gov.in/schemes/kcc", lang: 'English' },
  { title: "Fasal Bima Yojana", desc: "Comprehensive insurance cover against crop failure.", eligible: true, applyLink: "https://pmfby.gov.in/", lang: 'English' },
  { title: "PM-KISAN (ಕನ್ನಡ)", titleKn: "PM-KISAN", desc: "ಪ್ರತಿ ವರ್ಷ ₹6,000 ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.", eligible: true, applyLink: "https://pmkisan.gov.in/RegistrationFormNew.aspx", lang: 'Kannada' },
  { title: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)", desc: "ಬೀಜಗಳು ಮತ್ತು ರಸಗೊಬ್ಬರಗಳಿಗಾಗಿ ಕಡಿಮೆ ಬಡ್ಡಿಯ ಸಾಲ.", eligible: true, applyLink: "https://www.myscheme.gov.in/schemes/kcc", lang: 'Kannada' },
];

export const seedDatabase = async (force = false) => {
  try {
    // 1. Mandi Contacts
    const contactSnap = await getDocs(collection(db, 'mandiContacts'));
    if (contactSnap.empty || force) {
      console.log('Seeding Mandi Contacts...');
      const batch = writeBatch(db);
      MANDI_CONTACTS.forEach((c) => {
        const ref = doc(collection(db, 'mandiContacts'));
        batch.set(ref, c);
      });
      await batch.commit();
    }

    // 2. Banners
    const bannerSnap = await getDocs(collection(db, 'banners'));
    if (bannerSnap.empty || force) {
      console.log('Seeding Banners...');
      const batch = writeBatch(db);
      BANNERS.forEach((b) => {
        const ref = doc(collection(db, 'banners'));
        batch.set(ref, b);
      });
      await batch.commit();
    }

    // 3. Markets
    const marketSnap = await getDocs(collection(db, 'markets'));
    if (marketSnap.empty || force) {
      console.log('Seeding Markets...');
      const batch = writeBatch(db);
      MARKETS.forEach((m) => {
        const ref = doc(collection(db, 'markets'));
        batch.set(ref, m);
      });
      await batch.commit();
    }

    // 4. Schemes
    const schemeSnap = await getDocs(collection(db, 'schemes'));
    if (schemeSnap.empty || force) {
      console.log('Seeding Schemes...');
      const batch = writeBatch(db);
      SCHEMES.forEach((s) => {
        const ref = doc(collection(db, 'schemes'));
        batch.set(ref, s);
      });
      await batch.commit();
    }

    console.log('Database Seeding Complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
