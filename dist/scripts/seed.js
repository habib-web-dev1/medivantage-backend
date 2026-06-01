"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Medicine_1 = __importDefault(require("../models/Medicine"));
const Disease_1 = __importDefault(require("../models/Disease"));
const User_1 = __importDefault(require("../models/User"));
// ─── 50 Medicines ─────────────────────────────────────────────────────────────
const medicineData = [
    // ── Antibiotics (8) ──────────────────────────────────────────────────────
    {
        brandName: "Amoxil",
        genericName: "Amoxicillin",
        price: 12.5,
        stock: 500,
        category: "Antibiotics",
        description: "A broad-spectrum penicillin antibiotic for bacterial infections.",
        uses: "Treats ear infections, pneumonia, strep throat, UTIs, and skin infections.",
        sideEffects: "Nausea, vomiting, diarrhea, rash, allergic reactions.",
        precautions: "Inform doctor of penicillin allergy. Complete the full course.",
    },
    {
        brandName: "Zithromax",
        genericName: "Azithromycin",
        price: 18.75,
        stock: 350,
        category: "Antibiotics",
        description: "A macrolide antibiotic effective against a wide range of bacteria.",
        uses: "Treats respiratory infections, skin infections, ear infections, and STIs.",
        sideEffects: "Stomach upset, diarrhea, nausea, abdominal pain, cardiac arrhythmias.",
        precautions: "Avoid antacids containing aluminum or magnesium within 2 hours.",
    },
    {
        brandName: "Cipro",
        genericName: "Ciprofloxacin",
        price: 22.0,
        stock: 280,
        category: "Antibiotics",
        description: "A fluoroquinolone antibiotic for serious bacterial infections.",
        uses: "Treats UTIs, respiratory infections, bone and joint infections, anthrax.",
        sideEffects: "Tendon damage, nausea, diarrhea, dizziness, photosensitivity.",
        precautions: "Avoid prolonged sun exposure. Do not take with dairy products.",
    },
    {
        brandName: "Keflex",
        genericName: "Cephalexin",
        price: 15.0,
        stock: 400,
        category: "Antibiotics",
        description: "A first-generation cephalosporin antibiotic.",
        uses: "Treats skin infections, bone infections, ear infections, and UTIs.",
        sideEffects: "Diarrhea, nausea, stomach upset, and allergic reactions.",
        precautions: "Use with caution in penicillin-allergic patients. Complete full course.",
    },
    {
        brandName: "Flagyl",
        genericName: "Metronidazole",
        price: 14.0,
        stock: 320,
        category: "Antibiotics",
        description: "An antibiotic and antiprotozoal medication.",
        uses: "Treats bacterial vaginosis, trichomoniasis, C. difficile, and anaerobic infections.",
        sideEffects: "Metallic taste, nausea, headache, dizziness, dark urine.",
        precautions: "Avoid alcohol during treatment and 48 hours after. Do not use in first trimester.",
    },
    {
        brandName: "Vibramycin",
        genericName: "Doxycycline",
        price: 19.5,
        stock: 300,
        category: "Antibiotics",
        description: "A tetracycline antibiotic with broad-spectrum activity.",
        uses: "Treats acne, Lyme disease, malaria prevention, chlamydia, and respiratory infections.",
        sideEffects: "Photosensitivity, nausea, esophageal irritation, and yeast infections.",
        precautions: "Take with full glass of water. Avoid sun exposure. Not for children under 8.",
    },
    {
        brandName: "Bactrim",
        genericName: "Trimethoprim-Sulfamethoxazole",
        price: 11.0,
        stock: 360,
        category: "Antibiotics",
        description: "A combination antibiotic sulfonamide.",
        uses: "Treats UTIs, ear infections, traveler's diarrhea, and Pneumocystis pneumonia.",
        sideEffects: "Rash, nausea, vomiting, photosensitivity, and Stevens-Johnson syndrome.",
        precautions: "Drink plenty of fluids. Avoid in sulfa allergy. Monitor kidney function.",
    },
    {
        brandName: "Cleocin",
        genericName: "Clindamycin",
        price: 23.0,
        stock: 250,
        category: "Antibiotics",
        description: "A lincosamide antibiotic for serious anaerobic infections.",
        uses: "Treats skin infections, dental infections, bone infections, and pelvic inflammatory disease.",
        sideEffects: "Diarrhea, C. difficile colitis, nausea, and rash.",
        precautions: "Report severe diarrhea immediately. Complete full course as prescribed.",
    },
    // ── Fever / Pain (7) ─────────────────────────────────────────────────────
    {
        brandName: "Calpol",
        genericName: "Paracetamol",
        price: 8.99,
        stock: 1200,
        category: "Fever/Pain",
        description: "An analgesic and antipyretic for pain relief and fever reduction.",
        uses: "Relieves mild to moderate pain, headaches, muscle aches, and reduces fever.",
        sideEffects: "Liver damage with overdose, nausea, rash in rare cases.",
        precautions: "Do not exceed 4g/day. Avoid alcohol. Check other medications for paracetamol.",
    },
    {
        brandName: "Advil",
        genericName: "Ibuprofen",
        price: 9.49,
        stock: 900,
        category: "Fever/Pain",
        description: "An NSAID that reduces fever, pain, and inflammation.",
        uses: "Treats fever, headache, toothache, back pain, arthritis, and menstrual cramps.",
        sideEffects: "Stomach upset, heartburn, nausea, dizziness, increased bleeding risk.",
        precautions: "Take with food. Avoid in kidney disease, ulcers, or pregnancy.",
    },
    {
        brandName: "Bayer",
        genericName: "Aspirin",
        price: 7.5,
        stock: 800,
        category: "Fever/Pain",
        description: "A salicylate drug for pain, fever, and inflammation.",
        uses: "Treats pain, fever, inflammation; low-dose prevents heart attacks and strokes.",
        sideEffects: "Stomach irritation, bleeding, tinnitus, Reye's syndrome in children.",
        precautions: "Do not give to children under 16. Avoid in bleeding disorders or ulcers.",
    },
    {
        brandName: "Voltaren",
        genericName: "Diclofenac",
        price: 17.0,
        stock: 420,
        category: "Fever/Pain",
        description: "An NSAID used for pain and inflammatory conditions.",
        uses: "Treats arthritis, ankylosing spondylitis, menstrual pain, and acute gout.",
        sideEffects: "GI upset, headache, dizziness, elevated liver enzymes, fluid retention.",
        precautions: "Take with food. Monitor liver and kidney function. Avoid in heart failure.",
    },
    {
        brandName: "Ultram",
        genericName: "Tramadol",
        price: 35.0,
        stock: 180,
        category: "Fever/Pain",
        description: "A centrally acting opioid analgesic for moderate to severe pain.",
        uses: "Treats moderate to moderately severe pain including post-surgical and chronic pain.",
        sideEffects: "Dizziness, nausea, constipation, headache, and risk of dependence.",
        precautions: "Avoid alcohol. Do not use with MAOIs. Risk of seizures at high doses.",
    },
    {
        brandName: "Celebrex",
        genericName: "Celecoxib",
        price: 48.0,
        stock: 200,
        category: "Fever/Pain",
        description: "A COX-2 selective NSAID with reduced GI side effects.",
        uses: "Treats osteoarthritis, rheumatoid arthritis, acute pain, and menstrual pain.",
        sideEffects: "Stomach pain, diarrhea, headache, and increased cardiovascular risk.",
        precautions: "Avoid in sulfa allergy. Monitor blood pressure. Use lowest effective dose.",
    },
    {
        brandName: "Toradol",
        genericName: "Ketorolac",
        price: 26.0,
        stock: 150,
        category: "Fever/Pain",
        description: "A potent NSAID for short-term management of moderate to severe pain.",
        uses: "Post-operative pain, renal colic, and acute musculoskeletal pain.",
        sideEffects: "GI bleeding, kidney impairment, headache, and dizziness.",
        precautions: "Limit use to 5 days. Avoid in elderly, renal impairment, or GI bleeding history.",
    },
    // ── Cardiovascular (7) ───────────────────────────────────────────────────
    {
        brandName: "Lipitor",
        genericName: "Atorvastatin",
        price: 45.0,
        stock: 250,
        category: "Cardiovascular",
        description: "A statin that lowers LDL cholesterol and reduces cardiovascular risk.",
        uses: "Treats high cholesterol, prevents heart attacks and strokes in high-risk patients.",
        sideEffects: "Muscle pain, liver enzyme elevation, digestive problems, rhabdomyolysis.",
        precautions: "Avoid grapefruit juice. Report unexplained muscle pain. Monitor liver function.",
    },
    {
        brandName: "Zestril",
        genericName: "Lisinopril",
        price: 32.0,
        stock: 300,
        category: "Cardiovascular",
        description: "An ACE inhibitor for high blood pressure and heart failure.",
        uses: "Controls hypertension, treats heart failure, protects kidneys in diabetic patients.",
        sideEffects: "Dry cough, dizziness, elevated potassium, angioedema.",
        precautions: "Do not use during pregnancy. Monitor potassium and kidney function.",
    },
    {
        brandName: "Lopressor",
        genericName: "Metoprolol",
        price: 28.5,
        stock: 320,
        category: "Cardiovascular",
        description: "A beta-blocker for hypertension, angina, and heart failure.",
        uses: "Controls hypertension, prevents angina, manages heart failure.",
        sideEffects: "Fatigue, dizziness, bradycardia, cold extremities, depression.",
        precautions: "Do not stop abruptly. Monitor heart rate. Avoid in severe asthma.",
    },
    {
        brandName: "Norvasc",
        genericName: "Amlodipine",
        price: 38.5,
        stock: 320,
        category: "Cardiovascular",
        description: "A calcium channel blocker for hypertension and angina.",
        uses: "Controls high blood pressure, prevents chest pain, reduces cardiovascular events.",
        sideEffects: "Ankle swelling, flushing, palpitations, dizziness, fatigue.",
        precautions: "Do not stop abruptly. Monitor blood pressure. Limit grapefruit.",
    },
    {
        brandName: "Coumadin",
        genericName: "Warfarin",
        price: 22.0,
        stock: 200,
        category: "Cardiovascular",
        description: "An anticoagulant that prevents blood clot formation.",
        uses: "Prevents and treats deep vein thrombosis, pulmonary embolism, and stroke in atrial fibrillation.",
        sideEffects: "Bleeding, bruising, hair loss, and skin necrosis.",
        precautions: "Regular INR monitoring required. Many drug and food interactions. Avoid injury.",
    },
    {
        brandName: "Lanoxin",
        genericName: "Digoxin",
        price: 30.0,
        stock: 180,
        category: "Cardiovascular",
        description: "A cardiac glycoside that strengthens heart contractions.",
        uses: "Treats heart failure and atrial fibrillation by slowing and strengthening heartbeat.",
        sideEffects: "Nausea, vomiting, visual disturbances, arrhythmias, and toxicity.",
        precautions: "Narrow therapeutic window. Monitor digoxin levels and electrolytes regularly.",
    },
    {
        brandName: "Plavix",
        genericName: "Clopidogrel",
        price: 55.0,
        stock: 220,
        category: "Cardiovascular",
        description: "An antiplatelet agent that prevents blood clots.",
        uses: "Prevents heart attacks and strokes in patients with cardiovascular disease.",
        sideEffects: "Bleeding, bruising, stomach pain, and rash.",
        precautions: "Avoid omeprazole. Inform surgeon before procedures. Monitor for bleeding.",
    },
    // ── Respiratory (6) ──────────────────────────────────────────────────────
    {
        brandName: "Ventolin",
        genericName: "Salbutamol",
        price: 55.0,
        stock: 150,
        category: "Respiratory",
        description: "A short-acting beta-2 agonist bronchodilator for acute asthma relief.",
        uses: "Relieves bronchospasm in asthma, COPD, and exercise-induced bronchoconstriction.",
        sideEffects: "Tremor, palpitations, headache, nervousness, hypokalemia.",
        precautions: "Shake inhaler before use. Rinse mouth after use. Seek emergency care if no relief.",
    },
    {
        brandName: "Singulair",
        genericName: "Montelukast",
        price: 42.0,
        stock: 200,
        category: "Respiratory",
        description: "A leukotriene receptor antagonist for asthma and allergic rhinitis.",
        uses: "Prevents asthma attacks, treats seasonal allergic rhinitis.",
        sideEffects: "Headache, stomach pain, nausea, neuropsychiatric events.",
        precautions: "Report mood changes. Take in the evening for asthma prevention.",
    },
    {
        brandName: "Flonase",
        genericName: "Fluticasone",
        price: 27.99,
        stock: 380,
        category: "Respiratory",
        description: "An intranasal corticosteroid for allergic rhinitis.",
        uses: "Treats seasonal and perennial allergic rhinitis and nasal polyps.",
        sideEffects: "Nasal irritation, nosebleeds, headache, throat irritation.",
        precautions: "Avoid spraying into eyes. Full effect may take 1-2 weeks.",
    },
    {
        brandName: "Spiriva",
        genericName: "Tiotropium",
        price: 68.0,
        stock: 120,
        category: "Respiratory",
        description: "A long-acting anticholinergic bronchodilator for COPD.",
        uses: "Maintains bronchodilation in COPD, reduces exacerbations.",
        sideEffects: "Dry mouth, constipation, urinary retention, blurred vision.",
        precautions: "Not for acute bronchospasm. Avoid in narrow-angle glaucoma.",
    },
    {
        brandName: "Pulmicort",
        genericName: "Budesonide",
        price: 62.0,
        stock: 140,
        category: "Respiratory",
        description: "An inhaled corticosteroid for long-term asthma control.",
        uses: "Prevents asthma attacks, reduces airway inflammation in COPD.",
        sideEffects: "Oral thrush, hoarseness, cough, and adrenal suppression with high doses.",
        precautions: "Rinse mouth after each use. Not for acute attacks. Taper slowly if stopping.",
    },
    {
        brandName: "Robitussin",
        genericName: "Guaifenesin",
        price: 10.5,
        stock: 600,
        category: "Respiratory",
        description: "An expectorant that thins and loosens mucus in the airways.",
        uses: "Relieves chest congestion from colds, bronchitis, and respiratory infections.",
        sideEffects: "Nausea, vomiting, dizziness, and headache.",
        precautions: "Drink plenty of fluids. Do not use with persistent cough from smoking.",
    },
    // ── Vitamins (5) ─────────────────────────────────────────────────────────
    {
        brandName: "Celin",
        genericName: "Vitamin C",
        price: 11.99,
        stock: 1000,
        category: "Vitamins",
        description: "High-dose vitamin C for immune support and antioxidant protection.",
        uses: "Boosts immune system, aids collagen synthesis, enhances iron absorption.",
        sideEffects: "Diarrhea, nausea, kidney stones with very high doses.",
        precautions: "Doses above 2000mg/day may cause adverse effects.",
    },
    {
        brandName: "D-Rise",
        genericName: "Vitamin D3",
        price: 14.5,
        stock: 800,
        category: "Vitamins",
        description: "Vitamin D3 supplement for bone health and immune support.",
        uses: "Prevents vitamin D deficiency, supports calcium absorption and bone density.",
        sideEffects: "Hypercalcemia with excessive doses, nausea, weakness.",
        precautions: "Consult doctor if you have kidney disease or take thiazide diuretics.",
    },
    {
        brandName: "Folvite",
        genericName: "Folic Acid",
        price: 9.0,
        stock: 600,
        category: "Vitamins",
        description: "A B-vitamin essential for DNA synthesis and red blood cell formation.",
        uses: "Prevents neural tube defects in pregnancy, treats folate deficiency anemia.",
        sideEffects: "Rarely causes side effects; high doses may mask B12 deficiency.",
        precautions: "Essential during pregnancy. Consult doctor if taking anticonvulsants.",
    },
    {
        brandName: "Neurobion",
        genericName: "Vitamin B Complex",
        price: 13.0,
        stock: 700,
        category: "Vitamins",
        description: "A combination of B vitamins (B1, B6, B12) for nerve health.",
        uses: "Treats B vitamin deficiencies, supports nerve function, reduces fatigue.",
        sideEffects: "Nausea, skin flushing with high niacin doses, and urine discoloration.",
        precautions: "Inform doctor of all medications. High doses of B6 can cause nerve damage.",
    },
    {
        brandName: "Evion",
        genericName: "Vitamin E",
        price: 16.0,
        stock: 500,
        category: "Vitamins",
        description: "A fat-soluble antioxidant vitamin for cell protection.",
        uses: "Supports immune function, skin health, and protects cells from oxidative damage.",
        sideEffects: "Nausea, diarrhea, and increased bleeding risk at high doses.",
        precautions: "High doses may increase bleeding risk. Consult doctor before surgery.",
    },
    // ── Supplements (6) ──────────────────────────────────────────────────────
    {
        brandName: "Zincovit",
        genericName: "Zinc",
        price: 13.5,
        stock: 500,
        category: "Supplements",
        description: "A zinc supplement supporting immune function and wound healing.",
        uses: "Treats zinc deficiency, supports immune system, aids wound healing.",
        sideEffects: "Nausea, vomiting, stomach cramps, copper deficiency with long-term use.",
        precautions: "Do not exceed recommended dose. Take with food to reduce stomach upset.",
    },
    {
        brandName: "Omacor",
        genericName: "Omega-3",
        price: 24.99,
        stock: 450,
        category: "Supplements",
        description: "Concentrated omega-3 fatty acids from purified fish oil.",
        uses: "Supports cardiovascular health, reduces triglycerides, anti-inflammatory effects.",
        sideEffects: "Fishy aftertaste, burping, nausea, loose stools.",
        precautions: "May increase bleeding risk. Consult doctor if taking anticoagulants.",
    },
    {
        brandName: "Ferrous Sulfate",
        genericName: "Iron",
        price: 10.0,
        stock: 700,
        category: "Supplements",
        description: "An iron supplement for iron deficiency anemia.",
        uses: "Treats iron deficiency anemia, restores iron stores, supports red blood cell production.",
        sideEffects: "Constipation, nausea, dark stools, stomach cramps.",
        precautions: "Take on empty stomach for best absorption. Keep away from children.",
    },
    {
        brandName: "Caltrate",
        genericName: "Calcium Carbonate",
        price: 12.0,
        stock: 600,
        category: "Supplements",
        description: "A calcium supplement for bone health and osteoporosis prevention.",
        uses: "Prevents and treats calcium deficiency, supports bone density and muscle function.",
        sideEffects: "Constipation, gas, bloating, and hypercalcemia with excessive doses.",
        precautions: "Take with food for best absorption. Avoid with certain antibiotics.",
    },
    {
        brandName: "Magnesium Oxide",
        genericName: "Magnesium",
        price: 11.5,
        stock: 550,
        category: "Supplements",
        description: "A magnesium supplement for muscle and nerve function.",
        uses: "Treats magnesium deficiency, relieves muscle cramps, supports heart rhythm.",
        sideEffects: "Diarrhea, nausea, stomach cramps, and low blood pressure.",
        precautions: "Avoid in kidney disease. May interact with antibiotics and diuretics.",
    },
    {
        brandName: "Probio-5",
        genericName: "Probiotic Blend",
        price: 29.99,
        stock: 300,
        category: "Supplements",
        description: "A multi-strain probiotic for gut health and immune support.",
        uses: "Restores gut flora after antibiotics, treats IBS, and supports digestive health.",
        sideEffects: "Bloating, gas, and mild digestive discomfort initially.",
        precautions: "Refrigerate after opening. Consult doctor if immunocompromised.",
    },
    // ── Antihistamines (3) ───────────────────────────────────────────────────
    {
        brandName: "Zyrtec",
        genericName: "Cetirizine",
        price: 16.5,
        stock: 600,
        category: "Antihistamines",
        description: "A second-generation antihistamine for allergic symptoms.",
        uses: "Relieves hay fever, hives, itching, runny nose, and allergy symptoms.",
        sideEffects: "Drowsiness, dry mouth, headache, dizziness.",
        precautions: "Use caution when driving. Avoid alcohol. Reduce dose in kidney impairment.",
    },
    {
        brandName: "Claritin",
        genericName: "Loratadine",
        price: 14.0,
        stock: 650,
        category: "Antihistamines",
        description: "A non-drowsy second-generation antihistamine.",
        uses: "Treats hay fever, hives, and chronic idiopathic urticaria.",
        sideEffects: "Headache, dry mouth, fatigue, and nervousness.",
        precautions: "Reduce dose in liver or kidney impairment. Avoid in phenylketonuria.",
    },
    {
        brandName: "Benadryl",
        genericName: "Diphenhydramine",
        price: 9.99,
        stock: 700,
        category: "Antihistamines",
        description: "A first-generation antihistamine with sedative properties.",
        uses: "Treats allergies, hay fever, hives, motion sickness, and insomnia.",
        sideEffects: "Drowsiness, dry mouth, blurred vision, urinary retention, constipation.",
        precautions: "Do not drive or operate machinery. Avoid in elderly patients. Avoid alcohol.",
    },
    // ── Diabetes (4) ─────────────────────────────────────────────────────────
    {
        brandName: "Glucophage",
        genericName: "Metformin",
        price: 18.0,
        stock: 400,
        category: "Diabetes",
        description: "A biguanide antidiabetic that reduces hepatic glucose production.",
        uses: "First-line treatment for type 2 diabetes, also used in PCOS.",
        sideEffects: "Nausea, diarrhea, stomach upset, and rarely lactic acidosis.",
        precautions: "Hold before contrast procedures. Monitor kidney function. Take with meals.",
    },
    {
        brandName: "Lantus",
        genericName: "Insulin Glargine",
        price: 95.0,
        stock: 100,
        category: "Diabetes",
        description: "A long-acting basal insulin analog for blood sugar control.",
        uses: "Controls blood sugar in type 1 and type 2 diabetes as basal insulin.",
        sideEffects: "Hypoglycemia, injection site reactions, weight gain.",
        precautions: "Do not mix with other insulins. Rotate injection sites. Monitor blood glucose.",
    },
    {
        brandName: "Januvia",
        genericName: "Sitagliptin",
        price: 72.0,
        stock: 150,
        category: "Diabetes",
        description: "A DPP-4 inhibitor that improves blood sugar control.",
        uses: "Treats type 2 diabetes as monotherapy or in combination with other antidiabetics.",
        sideEffects: "Upper respiratory infection, headache, nasopharyngitis, pancreatitis.",
        precautions: "Reduce dose in kidney impairment. Discontinue if pancreatitis suspected.",
    },
    {
        brandName: "Jardiance",
        genericName: "Empagliflozin",
        price: 88.0,
        stock: 120,
        category: "Diabetes",
        description: "An SGLT2 inhibitor that lowers blood sugar by increasing urinary glucose excretion.",
        uses: "Treats type 2 diabetes, reduces cardiovascular death risk, and treats heart failure.",
        sideEffects: "UTIs, genital yeast infections, increased urination, DKA.",
        precautions: "Hold before surgery. Maintain hydration. Monitor for DKA symptoms.",
    },
    // ── Gastrointestinal (4) ─────────────────────────────────────────────────
    {
        brandName: "Prilosec",
        genericName: "Omeprazole",
        price: 20.0,
        stock: 500,
        category: "Gastrointestinal",
        description: "A proton pump inhibitor that reduces stomach acid production.",
        uses: "Treats GERD, peptic ulcers, Zollinger-Ellison syndrome, and H. pylori.",
        sideEffects: "Headache, diarrhea, nausea, vitamin B12 deficiency with long-term use.",
        precautions: "Take 30-60 minutes before meals. Long-term use may reduce magnesium levels.",
    },
    {
        brandName: "Zofran",
        genericName: "Ondansetron",
        price: 34.0,
        stock: 280,
        category: "Gastrointestinal",
        description: "A 5-HT3 receptor antagonist antiemetic.",
        uses: "Prevents nausea and vomiting from chemotherapy, radiation, and surgery.",
        sideEffects: "Headache, constipation, dizziness, and QT prolongation.",
        precautions: "Monitor ECG in patients with cardiac conditions. Avoid in congenital long QT.",
    },
    {
        brandName: "Imodium",
        genericName: "Loperamide",
        price: 8.5,
        stock: 600,
        category: "Gastrointestinal",
        description: "An antidiarrheal agent that slows intestinal motility.",
        uses: "Treats acute and chronic diarrhea, reduces ileostomy output.",
        sideEffects: "Constipation, abdominal cramping, dizziness, and nausea.",
        precautions: "Do not use in bloody diarrhea or high fever. Seek care if no improvement in 2 days.",
    },
    {
        brandName: "Dulcolax",
        genericName: "Bisacodyl",
        price: 7.99,
        stock: 500,
        category: "Gastrointestinal",
        description: "A stimulant laxative for constipation relief.",
        uses: "Treats constipation and prepares bowel for procedures.",
        sideEffects: "Abdominal cramps, diarrhea, nausea, and electrolyte imbalance.",
        precautions: "Do not use long-term. Do not crush tablets. Avoid in bowel obstruction.",
    },
];
// ─── 30 Diseases ──────────────────────────────────────────────────────────────
function buildDiseaseData(medMap) {
    const get = (...names) => names
        .map((n) => medMap.get(n))
        .filter((id) => id !== undefined);
    return [
        // ── LOW (8) ────────────────────────────────────────────────────────────
        {
            name: "Common Cold",
            symptoms: [
                "runny nose",
                "sneezing",
                "sore throat",
                "mild fever",
                "nasal congestion",
            ],
            description: "A viral upper respiratory tract infection caused most often by rhinoviruses.",
            precautions: [
                "Rest adequately",
                "Stay hydrated",
                "Wash hands frequently",
                "Avoid close contact",
            ],
            suggestedMeds: get("Paracetamol", "Vitamin C", "Cetirizine"),
            emergencyLevel: "low",
        },
        {
            name: "Allergic Rhinitis",
            symptoms: [
                "sneezing",
                "runny nose",
                "itchy eyes",
                "nasal congestion",
                "watery eyes",
            ],
            description: "An allergic response causing cold-like symptoms triggered by allergens such as pollen or dust.",
            precautions: [
                "Avoid known allergens",
                "Keep windows closed during high pollen season",
                "Use air purifiers",
                "Shower after outdoor activities",
            ],
            suggestedMeds: get("Cetirizine", "Loratadine", "Fluticasone"),
            emergencyLevel: "low",
        },
        {
            name: "Gastroenteritis",
            symptoms: [
                "nausea",
                "vomiting",
                "diarrhea",
                "stomach cramps",
                "mild fever",
            ],
            description: "Inflammation of the stomach and intestines caused by viral or bacterial infection.",
            precautions: [
                "Stay hydrated with oral rehydration salts",
                "Eat bland foods",
                "Wash hands thoroughly",
                "Avoid dairy temporarily",
            ],
            suggestedMeds: get("Paracetamol", "Zinc", "Loperamide", "Probiotic Blend"),
            emergencyLevel: "low",
        },
        {
            name: "Conjunctivitis",
            symptoms: [
                "red eyes",
                "eye discharge",
                "itchy eyes",
                "watery eyes",
                "eye crusting",
            ],
            description: "Inflammation of the conjunctiva, commonly known as pink eye, caused by infection or allergy.",
            precautions: [
                "Do not touch eyes",
                "Wash hands frequently",
                "Do not share towels",
                "Avoid contact lenses until resolved",
            ],
            suggestedMeds: get("Cetirizine", "Vitamin C"),
            emergencyLevel: "low",
        },
        {
            name: "Constipation",
            symptoms: [
                "infrequent bowel movements",
                "hard stools",
                "straining",
                "abdominal bloating",
                "stomach discomfort",
            ],
            description: "A condition where bowel movements are infrequent or difficult to pass.",
            precautions: [
                "Increase fiber intake",
                "Drink plenty of water",
                "Exercise regularly",
                "Do not ignore urge to defecate",
            ],
            suggestedMeds: get("Bisacodyl", "Magnesium", "Probiotic Blend"),
            emergencyLevel: "low",
        },
        {
            name: "Mild Acne",
            symptoms: [
                "pimples",
                "blackheads",
                "whiteheads",
                "oily skin",
                "skin inflammation",
            ],
            description: "A skin condition that occurs when hair follicles become plugged with oil and dead skin cells.",
            precautions: [
                "Wash face twice daily",
                "Avoid touching face",
                "Use non-comedogenic products",
                "Change pillowcases frequently",
            ],
            suggestedMeds: get("Doxycycline", "Vitamin E", "Zinc"),
            emergencyLevel: "low",
        },
        {
            name: "Insomnia",
            symptoms: [
                "difficulty falling asleep",
                "waking at night",
                "fatigue",
                "irritability",
                "difficulty concentrating",
            ],
            description: "A sleep disorder characterized by difficulty falling or staying asleep.",
            precautions: [
                "Maintain regular sleep schedule",
                "Avoid caffeine after noon",
                "Limit screen time before bed",
                "Create a relaxing bedtime routine",
            ],
            suggestedMeds: get("Diphenhydramine", "Magnesium", "Vitamin B Complex"),
            emergencyLevel: "low",
        },
        {
            name: "Vitamin D Deficiency",
            symptoms: [
                "fatigue",
                "bone pain",
                "muscle weakness",
                "depression",
                "frequent infections",
            ],
            description: "A condition caused by insufficient vitamin D, affecting bone health and immune function.",
            precautions: [
                "Get regular sun exposure",
                "Eat vitamin D-rich foods",
                "Take supplements as prescribed",
                "Regular blood tests",
            ],
            suggestedMeds: get("Vitamin D3", "Calcium Carbonate", "Omega-3"),
            emergencyLevel: "low",
        },
        // ── MEDIUM (12) ────────────────────────────────────────────────────────
        {
            name: "Influenza",
            symptoms: [
                "high fever",
                "body aches",
                "fatigue",
                "headache",
                "chills",
                "sore throat",
            ],
            description: "A contagious respiratory illness caused by influenza viruses infecting the nose, throat, and lungs.",
            precautions: [
                "Annual flu vaccination",
                "Rest and stay hydrated",
                "Avoid contact with others",
                "Cover coughs and sneezes",
            ],
            suggestedMeds: get("Paracetamol", "Ibuprofen", "Vitamin C"),
            emergencyLevel: "medium",
        },
        {
            name: "Acute Bronchitis",
            symptoms: [
                "persistent cough",
                "mucus production",
                "fatigue",
                "shortness of breath",
                "chest discomfort",
            ],
            description: "Inflammation of the bronchial tubes usually caused by viral infection.",
            precautions: [
                "Avoid smoking",
                "Use a humidifier",
                "Stay hydrated",
                "Rest",
                "Avoid lung irritants",
            ],
            suggestedMeds: get("Salbutamol", "Montelukast", "Guaifenesin", "Paracetamol"),
            emergencyLevel: "medium",
        },
        {
            name: "Migraine",
            symptoms: [
                "severe headache",
                "nausea",
                "light sensitivity",
                "throbbing pain",
                "visual aura",
            ],
            description: "A neurological condition characterized by intense, debilitating headaches often with nausea and light sensitivity.",
            precautions: [
                "Identify and avoid triggers",
                "Maintain regular sleep schedule",
                "Stay hydrated",
                "Manage stress",
            ],
            suggestedMeds: get("Ibuprofen", "Aspirin", "Paracetamol"),
            emergencyLevel: "medium",
        },
        {
            name: "Iron Deficiency Anemia",
            symptoms: [
                "fatigue",
                "weakness",
                "pale skin",
                "shortness of breath",
                "dizziness",
                "cold hands and feet",
            ],
            description: "A condition where the blood lacks enough healthy red blood cells due to insufficient iron.",
            precautions: [
                "Eat iron-rich foods",
                "Take supplements as prescribed",
                "Avoid tea and coffee with meals",
                "Regular blood tests",
            ],
            suggestedMeds: get("Iron", "Folic Acid", "Vitamin C"),
            emergencyLevel: "medium",
        },
        {
            name: "Urinary Tract Infection",
            symptoms: [
                "burning urination",
                "frequent urination",
                "pelvic pain",
                "cloudy urine",
                "strong urine odor",
            ],
            description: "A bacterial infection affecting any part of the urinary system, most commonly the bladder.",
            precautions: [
                "Drink plenty of water",
                "Urinate after intercourse",
                "Wipe front to back",
                "Avoid irritating products",
            ],
            suggestedMeds: get("Ciprofloxacin", "Trimethoprim-Sulfamethoxazole"),
            emergencyLevel: "medium",
        },
        {
            name: "Type 2 Diabetes",
            symptoms: [
                "increased thirst",
                "frequent urination",
                "fatigue",
                "blurred vision",
                "slow healing wounds",
                "tingling hands",
            ],
            description: "A chronic condition affecting how the body processes blood sugar (glucose).",
            precautions: [
                "Monitor blood glucose regularly",
                "Follow diabetic diet",
                "Exercise regularly",
                "Take medications as prescribed",
            ],
            suggestedMeds: get("Metformin", "Sitagliptin", "Empagliflozin"),
            emergencyLevel: "medium",
        },
        {
            name: "Hypertension",
            symptoms: [
                "headache",
                "dizziness",
                "blurred vision",
                "chest pain",
                "shortness of breath",
                "nosebleeds",
            ],
            description: "A chronic condition where blood pressure in the arteries is persistently elevated.",
            precautions: [
                "Reduce sodium intake",
                "Exercise regularly",
                "Limit alcohol",
                "Take medications as prescribed",
                "Monitor blood pressure daily",
            ],
            suggestedMeds: get("Lisinopril", "Amlodipine", "Metoprolol"),
            emergencyLevel: "medium",
        },
        {
            name: "Asthma",
            symptoms: [
                "wheezing",
                "shortness of breath",
                "chest tightness",
                "coughing at night",
                "difficulty breathing",
            ],
            description: "A chronic respiratory condition causing airway inflammation and narrowing.",
            precautions: [
                "Avoid triggers",
                "Always carry rescue inhaler",
                "Follow asthma action plan",
                "Get annual flu vaccine",
            ],
            suggestedMeds: get("Salbutamol", "Budesonide", "Montelukast", "Tiotropium"),
            emergencyLevel: "medium",
        },
        {
            name: "GERD",
            symptoms: [
                "heartburn",
                "acid reflux",
                "chest pain",
                "difficulty swallowing",
                "regurgitation",
                "chronic cough",
            ],
            description: "Gastroesophageal reflux disease where stomach acid frequently flows back into the esophagus.",
            precautions: [
                "Avoid trigger foods",
                "Eat smaller meals",
                "Do not lie down after eating",
                "Elevate head of bed",
            ],
            suggestedMeds: get("Omeprazole", "Calcium Carbonate"),
            emergencyLevel: "medium",
        },
        {
            name: "Skin Infection (Cellulitis)",
            symptoms: [
                "red skin",
                "swelling",
                "warmth",
                "pain",
                "fever",
                "skin tenderness",
            ],
            description: "A bacterial skin infection affecting the deeper layers of skin and subcutaneous tissue.",
            precautions: [
                "Keep wound clean and covered",
                "Complete antibiotic course",
                "Elevate affected limb",
                "Monitor for spreading redness",
            ],
            suggestedMeds: get("Cephalexin", "Clindamycin", "Amoxicillin"),
            emergencyLevel: "medium",
        },
        {
            name: "Peptic Ulcer",
            symptoms: [
                "burning stomach pain",
                "nausea",
                "bloating",
                "heartburn",
                "dark stools",
                "loss of appetite",
            ],
            description: "Open sores that develop on the inner lining of the stomach or upper small intestine.",
            precautions: [
                "Avoid NSAIDs",
                "Limit alcohol",
                "Quit smoking",
                "Eat smaller frequent meals",
                "Reduce stress",
            ],
            suggestedMeds: get("Omeprazole", "Amoxicillin", "Metronidazole"),
            emergencyLevel: "medium",
        },
        {
            name: "Anxiety Disorder",
            symptoms: [
                "excessive worry",
                "restlessness",
                "fatigue",
                "difficulty concentrating",
                "muscle tension",
                "sleep problems",
            ],
            description: "A mental health condition characterized by persistent, excessive worry and fear.",
            precautions: [
                "Practice relaxation techniques",
                "Regular exercise",
                "Limit caffeine",
                "Seek therapy",
                "Maintain social connections",
            ],
            suggestedMeds: get("Vitamin B Complex", "Magnesium", "Omega-3"),
            emergencyLevel: "medium",
        },
        // ── HIGH (6) ───────────────────────────────────────────────────────────
        {
            name: "Pneumonia",
            symptoms: [
                "chest pain",
                "productive cough",
                "high fever",
                "difficulty breathing",
                "fatigue",
                "chills",
            ],
            description: "A lung infection that inflames the air sacs in one or both lungs, which may fill with fluid.",
            precautions: [
                "Complete antibiotic course",
                "Rest and hydration",
                "Pneumococcal vaccination",
                "Avoid smoking",
            ],
            suggestedMeds: get("Amoxicillin", "Azithromycin", "Paracetamol"),
            emergencyLevel: "high",
        },
        {
            name: "Deep Vein Thrombosis",
            symptoms: [
                "leg swelling",
                "leg pain",
                "redness",
                "warmth in leg",
                "leg cramps",
            ],
            description: "A blood clot that forms in a deep vein, usually in the legs, which can be life-threatening if it travels to the lungs.",
            precautions: [
                "Move legs regularly on long trips",
                "Stay hydrated",
                "Wear compression stockings",
                "Take prescribed anticoagulants",
            ],
            suggestedMeds: get("Warfarin", "Aspirin"),
            emergencyLevel: "high",
        },
        {
            name: "Atrial Fibrillation",
            symptoms: [
                "irregular heartbeat",
                "palpitations",
                "shortness of breath",
                "fatigue",
                "dizziness",
                "chest pain",
            ],
            description: "An irregular and often rapid heart rate that can increase the risk of stroke and heart failure.",
            precautions: [
                "Take medications as prescribed",
                "Monitor heart rate",
                "Limit alcohol and caffeine",
                "Manage stress",
            ],
            suggestedMeds: get("Digoxin", "Warfarin", "Metoprolol"),
            emergencyLevel: "high",
        },
        {
            name: "Severe Asthma Attack",
            symptoms: [
                "severe shortness of breath",
                "inability to speak full sentences",
                "blue lips",
                "rapid breathing",
                "chest tightness",
            ],
            description: "A life-threatening exacerbation of asthma requiring immediate medical intervention.",
            precautions: [
                "Use rescue inhaler immediately",
                "Call emergency services",
                "Sit upright",
                "Do not lie down",
                "Avoid triggers",
            ],
            suggestedMeds: get("Salbutamol", "Budesonide"),
            emergencyLevel: "high",
        },
        {
            name: "Diabetic Ketoacidosis",
            symptoms: [
                "excessive thirst",
                "frequent urination",
                "nausea",
                "abdominal pain",
                "fruity breath",
                "confusion",
            ],
            description: "A serious diabetes complication where the body produces excess blood acids (ketones).",
            precautions: [
                "Monitor blood glucose regularly",
                "Take insulin as prescribed",
                "Stay hydrated",
                "Seek emergency care immediately",
            ],
            suggestedMeds: get("Insulin Glargine", "Metformin"),
            emergencyLevel: "high",
        },
        {
            name: "Sepsis",
            symptoms: [
                "high fever",
                "rapid heart rate",
                "rapid breathing",
                "confusion",
                "extreme fatigue",
                "low blood pressure",
            ],
            description: "A life-threatening response to infection that can lead to tissue damage, organ failure, and death.",
            precautions: [
                "Seek emergency care immediately",
                "Complete antibiotic courses",
                "Maintain vaccinations",
                "Treat infections promptly",
            ],
            suggestedMeds: get("Ciprofloxacin", "Amoxicillin", "Clindamycin"),
            emergencyLevel: "high",
        },
        // ── CRITICAL (4) ──────────────────────────────────────────────────────
        {
            name: "Hypertensive Crisis",
            symptoms: [
                "severe headache",
                "chest pain",
                "shortness of breath",
                "dizziness",
                "blurred vision",
                "nosebleed",
            ],
            description: "A severe increase in blood pressure that can lead to stroke, heart attack, or organ damage.",
            precautions: [
                "Seek emergency care immediately",
                "Monitor blood pressure daily",
                "Take medications as prescribed",
                "Reduce sodium intake",
            ],
            suggestedMeds: get("Lisinopril", "Amlodipine"),
            emergencyLevel: "critical",
        },
        {
            name: "Appendicitis",
            symptoms: [
                "severe abdominal pain",
                "nausea",
                "vomiting",
                "fever",
                "loss of appetite",
                "rebound tenderness",
            ],
            description: "Inflammation of the appendix requiring emergency surgical intervention.",
            precautions: [
                "Seek emergency care immediately",
                "Do not eat or drink before surgery",
                "Do not apply heat to abdomen",
            ],
            suggestedMeds: get("Ciprofloxacin", "Amoxicillin"),
            emergencyLevel: "critical",
        },
        {
            name: "Acute Myocardial Infarction",
            symptoms: [
                "crushing chest pain",
                "left arm pain",
                "shortness of breath",
                "sweating",
                "nausea",
                "jaw pain",
            ],
            description: "A heart attack caused by blocked blood flow to the heart muscle, requiring immediate emergency care.",
            precautions: [
                "Call emergency services immediately",
                "Chew aspirin if not allergic",
                "Rest and stay calm",
                "Do not drive yourself",
            ],
            suggestedMeds: get("Aspirin", "Clopidogrel", "Atorvastatin"),
            emergencyLevel: "critical",
        },
        {
            name: "Anaphylaxis",
            symptoms: [
                "throat swelling",
                "difficulty breathing",
                "hives",
                "rapid pulse",
                "dizziness",
                "loss of consciousness",
            ],
            description: "A severe, potentially life-threatening allergic reaction requiring immediate epinephrine treatment.",
            precautions: [
                "Seek emergency care immediately",
                "Use epinephrine auto-injector if available",
                "Avoid known allergens",
                "Wear medical alert bracelet",
            ],
            suggestedMeds: get("Diphenhydramine", "Cetirizine"),
            emergencyLevel: "critical",
        },
    ];
}
// ─── 10 Doctors + 1 Admin ─────────────────────────────────────────────────────
const doctorData = [
    {
        firstName: "Sarah",
        lastName: "Jenkins",
        email: "sarah.jenkins@medivantage.com",
        password: "Doctor123!",
        specialization: "Cardiology",
        licenseNumber: "MD-2024-001",
        experienceYears: 12,
        bio: "Board-certified cardiologist specializing in interventional cardiology and heart failure management.",
    },
    {
        firstName: "James",
        lastName: "Okafor",
        email: "james.okafor@medivantage.com",
        password: "Doctor123!",
        specialization: "Pulmonology",
        licenseNumber: "MD-2024-002",
        experienceYears: 9,
        bio: "Pulmonologist with expertise in asthma, COPD, and sleep-disordered breathing.",
    },
    {
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@medivantage.com",
        password: "Doctor123!",
        specialization: "Endocrinology",
        licenseNumber: "MD-2024-003",
        experienceYears: 11,
        bio: "Endocrinologist focused on diabetes management, thyroid disorders, and metabolic diseases.",
    },
    {
        firstName: "Michael",
        lastName: "Torres",
        email: "michael.torres@medivantage.com",
        password: "Doctor123!",
        specialization: "Gastroenterology",
        licenseNumber: "MD-2024-004",
        experienceYears: 14,
        bio: "Gastroenterologist specializing in IBD, GERD, and advanced endoscopic procedures.",
    },
    {
        firstName: "Aisha",
        lastName: "Rahman",
        email: "aisha.rahman@medivantage.com",
        password: "Doctor123!",
        specialization: "Neurology",
        licenseNumber: "MD-2024-005",
        experienceYears: 10,
        bio: "Neurologist with expertise in migraine management, epilepsy, and stroke rehabilitation.",
    },
    {
        firstName: "David",
        lastName: "Chen",
        email: "david.chen@medivantage.com",
        password: "Doctor123!",
        specialization: "Orthopedics",
        licenseNumber: "MD-2024-006",
        experienceYears: 16,
        bio: "Orthopedic surgeon specializing in joint replacement, sports injuries, and spine disorders.",
    },
    {
        firstName: "Fatima",
        lastName: "Al-Hassan",
        email: "fatima.alhassan@medivantage.com",
        password: "Doctor123!",
        specialization: "Pediatrics",
        licenseNumber: "MD-2024-007",
        experienceYears: 8,
        bio: "Pediatrician dedicated to child health, development, and preventive care from birth to adolescence.",
    },
    {
        firstName: "Robert",
        lastName: "Nguyen",
        email: "robert.nguyen@medivantage.com",
        password: "Doctor123!",
        specialization: "Dermatology",
        licenseNumber: "MD-2024-008",
        experienceYears: 7,
        bio: "Dermatologist specializing in acne, eczema, psoriasis, and skin cancer screening.",
    },
    {
        firstName: "Elena",
        lastName: "Petrov",
        email: "elena.petrov@medivantage.com",
        password: "Doctor123!",
        specialization: "Psychiatry",
        licenseNumber: "MD-2024-009",
        experienceYears: 13,
        bio: "Psychiatrist specializing in anxiety disorders, depression, PTSD, and cognitive behavioral therapy.",
    },
    {
        firstName: "Omar",
        lastName: "Khalid",
        email: "omar.khalid@medivantage.com",
        password: "Doctor123!",
        specialization: "General Practice",
        licenseNumber: "MD-2024-010",
        experienceYears: 6,
        bio: "General practitioner providing comprehensive primary care for patients of all ages.",
    },
];
const adminData = {
    firstName: "Admin",
    lastName: "MediVantage",
    email: "admin@medivantage.com",
    password: "Admin123!",
};
// ─── Main Seed Function ───────────────────────────────────────────────────────
async function seed() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("❌  MONGO_URI is not defined in environment variables.");
        process.exit(1);
    }
    console.log("🔌  Connecting to MongoDB...");
    await mongoose_1.default.connect(mongoUri);
    console.log("✅  Connected.\n");
    // ── 1. Seed Medicines ──────────────────────────────────────────────────────
    console.log("💊  Seeding 50 medicines...");
    let medInserted = 0;
    let medSkipped = 0;
    const medIdMap = new Map();
    for (const med of medicineData) {
        const exists = await Medicine_1.default.exists({ genericName: med.genericName });
        const doc = await Medicine_1.default.findOneAndUpdate({ genericName: med.genericName }, { $setOnInsert: med }, { upsert: true, new: true });
        const docId = doc._id;
        medIdMap.set(med.genericName, docId);
        if (exists) {
            console.log(`   ⏭  Skipped: ${med.genericName}`);
            medSkipped++;
        }
        else {
            console.log(`   ✔  Inserted: ${med.genericName}`);
            medInserted++;
        }
    }
    console.log(`\n   Medicines — inserted: ${medInserted}, skipped: ${medSkipped}\n`);
    // ── 2. Seed Diseases ───────────────────────────────────────────────────────
    console.log("🦠  Seeding 30 diseases...");
    let diseaseInserted = 0;
    let diseaseSkipped = 0;
    const diseaseData = buildDiseaseData(medIdMap);
    for (const disease of diseaseData) {
        const exists = await Disease_1.default.exists({ name: disease.name });
        await Disease_1.default.findOneAndUpdate({ name: disease.name }, { $setOnInsert: disease }, { upsert: true, new: true });
        if (exists) {
            console.log(`   ⏭  Skipped: ${disease.name}`);
            diseaseSkipped++;
        }
        else {
            console.log(`   ✔  Inserted: ${disease.name}`);
            diseaseInserted++;
        }
    }
    console.log(`\n   Diseases — inserted: ${diseaseInserted}, skipped: ${diseaseSkipped}\n`);
    // ── 3. Seed Doctors ────────────────────────────────────────────────────────
    console.log("👨‍⚕️  Seeding 10 doctors...");
    let doctorInserted = 0;
    let doctorSkipped = 0;
    for (const doc of doctorData) {
        const exists = await User_1.default.exists({ email: doc.email });
        if (!exists) {
            const hashedPassword = await bcryptjs_1.default.hash(doc.password, 12);
            await User_1.default.create({
                firstName: doc.firstName,
                lastName: doc.lastName,
                email: doc.email,
                password: hashedPassword,
                role: "doctor",
                doctorProfile: {
                    specialization: doc.specialization,
                    licenseNumber: doc.licenseNumber,
                    experienceYears: doc.experienceYears,
                    isVerified: true,
                    bio: doc.bio,
                },
                isActive: true,
            });
            console.log(`   ✔  Inserted doctor: Dr. ${doc.firstName} ${doc.lastName} (${doc.specialization})`);
            doctorInserted++;
        }
        else {
            console.log(`   ⏭  Skipped doctor: ${doc.email}`);
            doctorSkipped++;
        }
    }
    console.log(`\n   Doctors — inserted: ${doctorInserted}, skipped: ${doctorSkipped}\n`);
    // ── 4. Seed Admin ──────────────────────────────────────────────────────────
    console.log("🔐  Seeding admin account...");
    const adminExists = await User_1.default.exists({ email: adminData.email });
    if (!adminExists) {
        const hashedPassword = await bcryptjs_1.default.hash(adminData.password, 12);
        await User_1.default.create({
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
        });
        console.log(`   ✔  Inserted admin: ${adminData.email}`);
    }
    else {
        console.log(`   ⏭  Skipped admin: ${adminData.email}`);
    }
    // ── Summary ────────────────────────────────────────────────────────────────
    console.log("\n─────────────────────────────────────────────────────");
    console.log("📊  Seed Summary");
    console.log(`   💊 Medicines : ${medInserted} inserted, ${medSkipped} skipped  (total: ${medicineData.length})`);
    console.log(`   🦠 Diseases  : ${diseaseInserted} inserted, ${diseaseSkipped} skipped  (total: ${diseaseData.length})`);
    console.log(`   👨‍⚕️ Doctors   : ${doctorInserted} inserted, ${doctorSkipped} skipped  (total: ${doctorData.length})`);
    console.log("─────────────────────────────────────────────────────");
    console.log("\n🔑  Login credentials:");
    console.log("   Admin  → admin@medivantage.com     / Admin123!");
    console.log("   Doctor → sarah.jenkins@medivantage.com / Doctor123!");
    console.log("   (All 10 doctors use password: Doctor123!)");
    console.log("\n✅  Seeding complete.");
    await mongoose_1.default.disconnect();
    console.log("🔌  Disconnected from MongoDB.");
}
seed().catch((err) => {
    console.error("❌  Seed script failed:", err);
    mongoose_1.default.disconnect().finally(() => process.exit(1));
});
//# sourceMappingURL=seed.js.map