// Common ICD-10 codes and their descriptions
const icd10Codes = [
  // Cardiovascular Conditions
  // Hypertension
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'I11.0', description: 'Hypertensive heart disease with heart failure' },
  { code: 'I11.9', description: 'Hypertensive heart disease without heart failure' },
  { code: 'I12.0', description: 'Hypertensive chronic kidney disease with stage 5 chronic kidney disease or end stage renal disease' },
  { code: 'I12.9', description: 'Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified' },
  { code: 'I13.0', description: 'Hypertensive heart and chronic kidney disease with heart failure and stage 1 through stage 4 chronic kidney disease, or unspecified' },
  { code: 'I13.10', description: 'Hypertensive heart and chronic kidney disease without heart failure, with stage 1 through stage 4 chronic kidney disease, or unspecified' },
  { code: 'I13.11', description: 'Hypertensive heart and chronic kidney disease without heart failure, with stage 5 chronic kidney disease, or end stage renal disease' },
  { code: 'I13.2', description: 'Hypertensive heart and chronic kidney disease with heart failure and with stage 5 chronic kidney disease, or end stage renal disease' },
  { code: 'I15.0', description: 'Renovascular hypertension' },
  { code: 'I15.1', description: 'Hypertension secondary to other renal disorders' },
  { code: 'I15.2', description: 'Hypertension secondary to endocrine disorders' },
  { code: 'I15.8', description: 'Other secondary hypertension' },
  { code: 'I15.9', description: 'Secondary hypertension, unspecified' },
  { code: 'I16.0', description: 'Hypertensive urgency' },
  { code: 'I16.1', description: 'Hypertensive emergency' },
  { code: 'I16.9', description: 'Hypertensive crisis, unspecified' },
  { code: 'O10.011', description: 'Pre-existing essential hypertension complicating pregnancy, first trimester' },
  { code: 'O10.012', description: 'Pre-existing essential hypertension complicating pregnancy, second trimester' },
  { code: 'O10.013', description: 'Pre-existing essential hypertension complicating pregnancy, third trimester' },
  { code: 'O13.1', description: 'Gestational [pregnancy-induced] hypertension without significant proteinuria, first trimester' },
  { code: 'O13.2', description: 'Gestational [pregnancy-induced] hypertension without significant proteinuria, second trimester' },
  { code: 'O13.3', description: 'Gestational [pregnancy-induced] hypertension without significant proteinuria, third trimester' },
  { code: 'O14.00', description: 'Mild to moderate pre-eclampsia, unspecified trimester' },
  { code: 'O14.10', description: 'Severe pre-eclampsia, unspecified trimester' },

  // Heart Disease
  // Coronary Artery Disease
  { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
  { code: 'I25.110', description: 'Atherosclerotic heart disease of native coronary artery with unstable angina pectoris' },
  { code: 'I25.119', description: 'Atherosclerotic heart disease of native coronary artery with unspecified angina pectoris' },
  { code: 'I25.700', description: 'Atherosclerosis of coronary artery bypass graft(s), unspecified, with unstable angina pectoris' },
  { code: 'I25.2', description: 'Old myocardial infarction' },
  { code: 'I21.09', description: 'ST elevation (STEMI) myocardial infarction involving other coronary artery of anterior wall' },
  { code: 'I21.19', description: 'ST elevation (STEMI) myocardial infarction involving other coronary artery of inferior wall' },
  { code: 'I21.4', description: 'Non-ST elevation (NSTEMI) myocardial infarction' },

  // Cardiac Arrhythmias
  { code: 'I48.0', description: 'Paroxysmal atrial fibrillation' },
  { code: 'I48.1', description: 'Persistent atrial fibrillation' },
  { code: 'I48.2', description: 'Chronic atrial fibrillation' },
  { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
  { code: 'I47.1', description: 'Supraventricular tachycardia' },
  { code: 'I47.2', description: 'Ventricular tachycardia' },
  { code: 'I49.01', description: 'Ventricular fibrillation' },
  { code: 'I49.5', description: 'Sick sinus syndrome' },
  { code: 'I49.9', description: 'Cardiac arrhythmia, unspecified' },

  // Heart Failure
  { code: 'I50.9', description: 'Heart failure, unspecified' },
  { code: 'I50.1', description: 'Left ventricular failure, unspecified' },
  { code: 'I50.20', description: 'Unspecified systolic (congestive) heart failure' },
  { code: 'I50.22', description: 'Chronic systolic (congestive) heart failure' },
  { code: 'I50.23', description: 'Acute on chronic systolic (congestive) heart failure' },
  { code: 'I50.30', description: 'Unspecified diastolic (congestive) heart failure' },
  { code: 'I50.32', description: 'Chronic diastolic (congestive) heart failure' },
  { code: 'I50.33', description: 'Acute on chronic diastolic (congestive) heart failure' },
  { code: 'I50.40', description: 'Unspecified combined systolic and diastolic (congestive) heart failure' },
  { code: 'I50.42', description: 'Chronic combined systolic (congestive) and diastolic (congestive) heart failure' },
  { code: 'I50.43', description: 'Acute on chronic combined systolic (congestive) and diastolic (congestive) heart failure' },
  { code: 'I50.814', description: 'Right heart failure due to left heart failure' },
  { code: 'I50.82', description: 'Biventricular heart failure' },

  // Valvular Heart Disease
  { code: 'I34.0', description: 'Nonrheumatic mitral (valve) insufficiency' },
  { code: 'I35.0', description: 'Nonrheumatic aortic (valve) stenosis' },
  { code: 'I35.1', description: 'Nonrheumatic aortic (valve) insufficiency' },
  { code: 'I27.0', description: 'Primary pulmonary hypertension' },
  { code: 'I27.2', description: 'Other secondary pulmonary hypertension' },

  // Vascular Disease
  { code: 'I70.0', description: 'Atherosclerosis of aorta' },
  { code: 'I73.9', description: 'Peripheral vascular disease, unspecified' },
  { code: 'I82.409', description: 'Acute embolism and thrombosis of unspecified deep veins of unspecified lower extremity' },
  { code: 'I82.4Y9', description: 'Acute embolism and thrombosis of unspecified deep veins of unspecified proximal lower extremity' },
  { code: 'I87.2', description: 'Venous insufficiency (chronic) (peripheral)' },

  // Endocrine Conditions
  // Diabetes Mellitus
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  { code: 'E11.21', description: 'Type 2 diabetes mellitus with diabetic nephropathy' },
  { code: 'E11.22', description: 'Type 2 diabetes mellitus with diabetic chronic kidney disease' },
  { code: 'E11.40', description: 'Type 2 diabetes mellitus with diabetic neuropathy, unspecified' },
  { code: 'E11.51', description: 'Type 2 diabetes mellitus with diabetic peripheral angiopathy without gangrene' },
  { code: 'E11.52', description: 'Type 2 diabetes mellitus with diabetic peripheral angiopathy with gangrene' },
  { code: 'E11.311', description: 'Type 2 diabetes mellitus with unspecified diabetic retinopathy with macular edema' },
  { code: 'E11.319', description: 'Type 2 diabetes mellitus with unspecified diabetic retinopathy without macular edema' },
  { code: 'E11.36', description: 'Type 2 diabetes mellitus with diabetic cataract' },
  { code: 'E11.8', description: 'Type 2 diabetes mellitus with unspecified complications' },
  { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
  { code: 'E10.65', description: 'Type 1 diabetes mellitus with hyperglycemia' },
  { code: 'E10.21', description: 'Type 1 diabetes mellitus with diabetic nephropathy' },
  { code: 'E10.40', description: 'Type 1 diabetes mellitus with diabetic neuropathy, unspecified' },
  { code: 'E13.9', description: 'Other specified diabetes mellitus without complications' },

  // Thyroid Disorders
  { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
  { code: 'E03.8', description: 'Other specified hypothyroidism' },
  { code: 'E03.5', description: 'Myxedema coma' },
  { code: 'E05.90', description: 'Hyperthyroidism, unspecified without thyrotoxic crisis or storm' },
  { code: 'E05.91', description: 'Hyperthyroidism, unspecified with thyrotoxic crisis or storm' },
  { code: 'E05.00', description: 'Thyrotoxicosis with diffuse goiter without thyrotoxic crisis or storm' },
  { code: 'E06.3', description: 'Autoimmune thyroiditis' },
  { code: 'E04.9', description: 'Nontoxic goiter, unspecified' },
  { code: 'E07.9', description: 'Disorder of thyroid, unspecified' },

  // Adrenal Disorders
  { code: 'E27.1', description: 'Primary adrenocortical insufficiency' },
  { code: 'E27.2', description: 'Addisonian crisis' },
  { code: 'E27.3', description: 'Drug-induced adrenocortical insufficiency' },
  { code: 'E27.40', description: 'Unspecified adrenocortical insufficiency' },
  { code: 'E24.9', description: 'Cushing\'s syndrome, unspecified' },

  // Lipid Disorders
  { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  { code: 'E78.0', description: 'Pure hypercholesterolemia' },
  { code: 'E78.1', description: 'Pure hyperglyceridemia' },
  { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  { code: 'E78.4', description: 'Other hyperlipidemia' },
  { code: 'E78.6', description: 'Lipoprotein deficiency' },

  // Metabolic Disorders
  { code: 'E66.9', description: 'Obesity, unspecified' },
  { code: 'E66.01', description: 'Morbid (severe) obesity due to excess calories' },
  { code: 'E66.3', description: 'Overweight' },
  { code: 'E46', description: 'Unspecified protein-calorie malnutrition' },
  { code: 'E44.1', description: 'Mild protein-calorie malnutrition' },
  { code: 'E44.0', description: 'Moderate protein-calorie malnutrition' },
  { code: 'E43', description: 'Unspecified severe protein-calorie malnutrition' },

  // Vitamin and Mineral Deficiencies
  { code: 'E55.9', description: 'Vitamin D deficiency, unspecified' },
  { code: 'E55.0', description: 'Rickets, active' },
  { code: 'E56.9', description: 'Vitamin deficiency, unspecified' },
  { code: 'E58', description: 'Dietary calcium deficiency' },
  { code: 'E59', description: 'Dietary selenium deficiency' },
  { code: 'E61.1', description: 'Iron deficiency' },

  // Pituitary and Other Endocrine Disorders
  { code: 'E23.2', description: 'Diabetes insipidus' },
  { code: 'E23.0', description: 'Hypopituitarism' },
  { code: 'E22.2', description: 'Syndrome of inappropriate secretion of antidiuretic hormone' },
  { code: 'E21.3', description: 'Hyperparathyroidism, unspecified' },
  { code: 'E20.9', description: 'Hypoparathyroidism, unspecified' },
  { code: 'E34.9', description: 'Endocrine disorder, unspecified' },

  // Respiratory Conditions
  // Chronic Respiratory Diseases
  { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  { code: 'J44.0', description: 'Chronic obstructive pulmonary disease with acute lower respiratory infection' },
  { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with (acute) exacerbation' },
  { code: 'J43.9', description: 'Emphysema, unspecified' },
  { code: 'J42', description: 'Unspecified chronic bronchitis' },
  { code: 'J41.0', description: 'Simple chronic bronchitis' },
  { code: 'J47.9', description: 'Bronchiectasis, uncomplicated' },

  // Asthma
  { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
  { code: 'J45.40', description: 'Moderate persistent asthma, uncomplicated' },
  { code: 'J45.41', description: 'Moderate persistent asthma with (acute) exacerbation' },
  { code: 'J45.50', description: 'Severe persistent asthma, uncomplicated' },
  { code: 'J45.51', description: 'Severe persistent asthma with (acute) exacerbation' },
  { code: 'J45.901', description: 'Unspecified asthma with (acute) exacerbation' },
  { code: 'J45.20', description: 'Mild intermittent asthma, uncomplicated' },
  { code: 'J45.30', description: 'Mild persistent asthma, uncomplicated' },

  // Pneumonia
  { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  { code: 'J15.9', description: 'Unspecified bacterial pneumonia' },
  { code: 'J15.0', description: 'Pneumonia due to Klebsiella pneumoniae' },
  { code: 'J15.1', description: 'Pneumonia due to Pseudomonas' },
  { code: 'J15.20', description: 'Pneumonia due to staphylococcus, unspecified' },
  { code: 'J15.211', description: 'Pneumonia due to Methicillin susceptible Staphylococcus aureus' },
  { code: 'J15.212', description: 'Pneumonia due to Methicillin resistant Staphylococcus aureus' },
  { code: 'J15.4', description: 'Pneumonia due to other streptococci' },
  { code: 'J15.5', description: 'Pneumonia due to Escherichia coli' },
  { code: 'J15.6', description: 'Pneumonia due to other Gram-negative bacteria' },
  { code: 'J15.8', description: 'Pneumonia due to other specified bacteria' },
  { code: 'J13', description: 'Pneumonia due to Streptococcus pneumoniae' },
  { code: 'J14', description: 'Pneumonia due to Hemophilus influenzae' },
  { code: 'J12.9', description: 'Viral pneumonia, unspecified' },
  { code: 'J12.0', description: 'Adenoviral pneumonia' },
  { code: 'J12.1', description: 'Respiratory syncytial virus pneumonia' },
  { code: 'J12.2', description: 'Parainfluenza virus pneumonia' },
  { code: 'J12.3', description: 'Human metapneumovirus pneumonia' },
  { code: 'J16.8', description: 'Pneumonia due to other specified infectious organisms' },
  { code: 'J17', description: 'Pneumonia in diseases classified elsewhere' },
  { code: 'J18.0', description: 'Bronchopneumonia, unspecified organism' },
  { code: 'J18.1', description: 'Lobar pneumonia, unspecified organism' },
  { code: 'J18.8', description: 'Other pneumonia, unspecified organism' },

  // Influenza
  { code: 'J09.X2', description: 'Influenza due to identified novel influenza A virus with pneumonia' },
  { code: 'J10.00', description: 'Influenza due to other identified influenza virus with unspecified type of pneumonia' },
  { code: 'J10.01', description: 'Influenza due to other identified influenza virus with the same other identified influenza virus pneumonia' },
  { code: 'J10.08', description: 'Influenza due to other identified influenza virus with other specified pneumonia' },
  { code: 'J10.1', description: 'Influenza due to other identified influenza virus with other respiratory manifestations' },
  { code: 'J10.2', description: 'Influenza due to other identified influenza virus with gastrointestinal manifestations' },
  { code: 'J10.8', description: 'Influenza due to other identified influenza virus with other manifestations' },
  { code: 'J11.00', description: 'Influenza due to unidentified influenza virus with unspecified type of pneumonia' },
  { code: 'J11.08', description: 'Influenza due to unidentified influenza virus with specified pneumonia' },
  { code: 'J11.1', description: 'Influenza due to unidentified influenza virus with other respiratory manifestations' },
  { code: 'J11.2', description: 'Influenza due to unidentified influenza virus with gastrointestinal manifestations' },
  { code: 'J11.8', description: 'Influenza due to unidentified influenza virus with other manifestations' },

  // COVID-19
  { code: 'U07.1', description: 'COVID-19' },
  { code: 'J12.82', description: 'Pneumonia due to coronavirus disease 2019' },

  // Other Acute Respiratory Infections
  { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  { code: 'J40', description: 'Bronchitis, not specified as acute or chronic' },
  { code: 'J22', description: 'Unspecified acute lower respiratory infection' },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
  { code: 'J02.0', description: 'Streptococcal pharyngitis' },
  { code: 'J03.00', description: 'Acute streptococcal tonsillitis, unspecified' },
  { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
  { code: 'J01.00', description: 'Acute maxillary sinusitis, unspecified' },
  { code: 'J01.10', description: 'Acute frontal sinusitis, unspecified' },
  { code: 'J01.20', description: 'Acute ethmoidal sinusitis, unspecified' },
  { code: 'J01.30', description: 'Acute sphenoidal sinusitis, unspecified' },
  { code: 'J01.40', description: 'Acute pansinusitis, unspecified' },
  { code: 'J04.0', description: 'Acute laryngitis' },
  { code: 'J05.0', description: 'Acute obstructive laryngitis [croup]' },
  { code: 'J21.9', description: 'Acute bronchiolitis, unspecified' },
  { code: 'J21.0', description: 'Acute bronchiolitis due to respiratory syncytial virus' },
  { code: 'J21.1', description: 'Acute bronchiolitis due to human metapneumovirus' },

  // Respiratory Failure
  { code: 'J96.00', description: 'Acute respiratory failure, unspecified whether with hypoxia or hypercapnia' },
  { code: 'J96.01', description: 'Acute respiratory failure with hypoxia' },
  { code: 'J96.02', description: 'Acute respiratory failure with hypercapnia' },
  { code: 'J96.90', description: 'Respiratory failure, unspecified, unspecified whether with hypoxia or hypercapnia' },
  { code: 'J96.91', description: 'Respiratory failure, unspecified with hypoxia' },
  { code: 'J96.92', description: 'Respiratory failure, unspecified with hypercapnia' },
  { code: 'J80', description: 'Acute respiratory distress syndrome' },

  // Other Respiratory Conditions
  { code: 'J98.9', description: 'Respiratory disorder, unspecified' },
  { code: 'J94.8', description: 'Other specified pleural conditions' },
  { code: 'J94.2', description: 'Hemothorax' },
  { code: 'J94.0', description: 'Chylous effusion' },
  { code: 'J93.9', description: 'Pneumothorax, unspecified' },
  { code: 'J93.0', description: 'Spontaneous tension pneumothorax' },
  { code: 'J93.12', description: 'Secondary spontaneous pneumothorax' },
  { code: 'J90', description: 'Pleural effusion, not elsewhere classified' },
  { code: 'J86.9', description: 'Pyothorax without fistula' },
  { code: 'J86.0', description: 'Pyothorax with fistula' },
  { code: 'J85.2', description: 'Abscess of lung without pneumonia' },
  { code: 'J85.1', description: 'Abscess of lung with pneumonia' },
  { code: 'J84.9', description: 'Interstitial pulmonary disease, unspecified' },
  { code: 'J84.10', description: 'Pulmonary fibrosis, unspecified' },
  { code: 'J84.112', description: 'Idiopathic pulmonary fibrosis' },
  { code: 'J84.89', description: 'Other specified interstitial pulmonary diseases' },
  { code: 'J70.9', description: 'Respiratory conditions due to unspecified external agent' },
  { code: 'J70.5', description: 'Respiratory conditions due to smoke inhalation' },
  { code: 'J70.4', description: 'Drug-induced interstitial lung disorders, unspecified' },
  { code: 'J70.3', description: 'Chronic drug-induced interstitial lung disorders' },
  { code: 'J70.2', description: 'Acute drug-induced interstitial lung disorders' },
  { code: 'J70.0', description: 'Acute pulmonary manifestations due to radiation' },

  // Mental Health Conditions
  { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'F33.9', description: 'Major depressive disorder, recurrent, unspecified' },
  { code: 'G47.00', description: 'Insomnia, unspecified' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
  { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified' },
  { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  { code: 'F17.210', description: 'Nicotine dependence, cigarettes, uncomplicated' },

  // Musculoskeletal Conditions
  // Joint and Spine Disorders
  { code: 'M54.5', description: 'Low back pain' },
  { code: 'M54.2', description: 'Cervicalgia (neck pain)' },
  { code: 'M54.16', description: 'Radiculopathy, lumbar region' },
  { code: 'M54.17', description: 'Radiculopathy, lumbosacral region' },
  { code: 'M54.12', description: 'Radiculopathy, cervical region' },
  { code: 'M51.26', description: 'Other intervertebral disc displacement, lumbar region' },
  { code: 'M51.27', description: 'Other intervertebral disc displacement, lumbosacral region' },
  { code: 'M48.02', description: 'Spinal stenosis, cervical region' },
  { code: 'M48.06', description: 'Spinal stenosis, lumbar region' },
  { code: 'M47.812', description: 'Spondylosis without myelopathy or radiculopathy, cervical region' },
  { code: 'M47.816', description: 'Spondylosis without myelopathy or radiculopathy, lumbar region' },

  // Osteoarthritis
  { code: 'M17.0', description: 'Bilateral primary osteoarthritis of knee' },
  { code: 'M17.9', description: 'Osteoarthritis of knee, unspecified' },
  { code: 'M19.90', description: 'Unspecified osteoarthritis, unspecified site' },
  { code: 'M16.0', description: 'Bilateral primary osteoarthritis of hip' },
  { code: 'M16.9', description: 'Osteoarthritis of hip, unspecified' },
  { code: 'M18.9', description: 'Osteoarthritis of first carpometacarpal joint, unspecified' },
  { code: 'M15.0', description: 'Primary generalized (osteo)arthritis' },

  // Joint Pain
  { code: 'M25.511', description: 'Pain in right shoulder' },
  { code: 'M25.512', description: 'Pain in left shoulder' },
  { code: 'M25.561', description: 'Pain in right knee' },
  { code: 'M25.562', description: 'Pain in left knee' },
  { code: 'M25.551', description: 'Pain in right hip' },
  { code: 'M25.552', description: 'Pain in left hip' },
  { code: 'M25.531', description: 'Pain in right wrist' },
  { code: 'M25.532', description: 'Pain in left wrist' },

  // Soft Tissue Disorders
  { code: 'M79.1', description: 'Myalgia (muscle pain)' },
  { code: 'M79.7', description: 'Fibromyalgia' },
  { code: 'M77.9', description: 'Enthesopathy, unspecified' },
  { code: 'M77.1', description: 'Lateral epicondylitis' },
  { code: 'M77.0', description: 'Medial epicondylitis' },
  { code: 'M75.0', description: 'Adhesive capsulitis of shoulder' },
  { code: 'M75.2', description: 'Bicipital tendinitis' },
  { code: 'M75.4', description: 'Impingement syndrome of shoulder' },
  { code: 'M76.5', description: 'Patellar tendinitis' },

  // Bone Density Disorders
  { code: 'M80.00XA', description: 'Age-related osteoporosis with current pathological fracture, unspecified site, initial encounter for fracture' },
  { code: 'M80.08XA', description: 'Age-related osteoporosis with current pathological fracture, vertebra(e), initial encounter for fracture' },
  { code: 'M81.0', description: 'Age-related osteoporosis without current pathological fracture' },
  { code: 'M81.8', description: 'Other osteoporosis without current pathological fracture' },
  { code: 'M85.80', description: 'Other specified disorders of bone density and structure, unspecified site' },
  { code: 'M85.9', description: 'Disorder of bone density and structure, unspecified' },
  { code: 'M89.9', description: 'Disorder of bone, unspecified' },
  { code: 'M94.9', description: 'Disorder of cartilage, unspecified' },

  // Osteopenia
  { code: 'M85.8', description: 'Other specified disorders of bone density and structure' },
  { code: 'M85.89', description: 'Other specified disorders of bone density and structure, multiple sites' },

  // Inflammatory Arthropathies
  { code: 'M05.79', description: 'Rheumatoid arthritis with rheumatoid factor of multiple sites without organ or systems involvement' },
  { code: 'M06.9', description: 'Rheumatoid arthritis, unspecified' },
  { code: 'M10.9', description: 'Gout, unspecified' },
  { code: 'M11.9', description: 'Crystal arthropathy, unspecified' },
  { code: 'M45.9', description: 'Ankylosing spondylitis of unspecified sites in spine' },
  { code: 'M46.1', description: 'Sacroiliitis, not elsewhere classified' },

  // Neurological Conditions
  // Headache and Pain Disorders
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus' },
  { code: 'G43.111', description: 'Migraine with aura, intractable, with status migrainosus' },
  { code: 'G43.701', description: 'Chronic migraine without aura, not intractable, with status migrainosus' },
  { code: 'G44.209', description: 'Tension-type headache, unspecified, not intractable' },
  { code: 'G44.319', description: 'Episodic cluster headache, intractable' },
  { code: 'R51.9', description: 'Headache, unspecified' },
  { code: 'G89.29', description: 'Other chronic pain' },
  { code: 'R42', description: 'Dizziness and giddiness' },

  // Cerebrovascular Disease
  { code: 'I63.9', description: 'Cerebral infarction, unspecified' },
  { code: 'I63.50', description: 'Cerebral infarction due to unspecified occlusion or stenosis of cerebral artery' },
  { code: 'I61.9', description: 'Nontraumatic intracerebral hemorrhage, unspecified' },
  { code: 'I60.9', description: 'Nontraumatic subarachnoid hemorrhage, unspecified' },
  { code: 'I67.9', description: 'Cerebrovascular disease, unspecified' },
  { code: 'I67.2', description: 'Cerebral atherosclerosis' },
  { code: 'I67.82', description: 'Cerebral ischemia' },
  { code: 'G45.9', description: 'Transient cerebral ischemic attack, unspecified' },
  { code: 'I69.30', description: 'Unspecified sequelae of cerebral infarction' },
  { code: 'I69.398', description: 'Other sequelae of cerebral infarction' },

  // Dementia and Cognitive Disorders
  { code: 'F03.90', description: 'Unspecified dementia without behavioral disturbance' },
  { code: 'F03.91', description: 'Unspecified dementia with behavioral disturbance' },
  { code: 'G30.9', description: 'Alzheimer\'s disease, unspecified' },
  { code: 'G31.84', description: 'Mild cognitive impairment, so stated' },
  { code: 'F01.50', description: 'Vascular dementia without behavioral disturbance' },
  { code: 'F01.51', description: 'Vascular dementia with behavioral disturbance' },
  { code: 'G31.83', description: 'Dementia with Lewy bodies' },
  { code: 'F02.80', description: 'Dementia in other diseases classified elsewhere without behavioral disturbance' },
  { code: 'F02.81', description: 'Dementia in other diseases classified elsewhere with behavioral disturbance' },

  // Parkinson's Disease and Movement Disorders
  { code: 'G20', description: 'Parkinson\'s disease' },
  { code: 'G21.11', description: 'Neuroleptic induced parkinsonism' },
  { code: 'G21.9', description: 'Secondary parkinsonism, unspecified' },
  { code: 'G25.0', description: 'Essential tremor' },
  { code: 'G25.81', description: 'Restless legs syndrome' },
  { code: 'G25.9', description: 'Extrapyramidal and movement disorder, unspecified' },
  { code: 'G24.9', description: 'Dystonia, unspecified' },

  // Epilepsy and Seizures
  { code: 'G40.909', description: 'Epilepsy, unspecified, not intractable, without status epilepticus' },
  { code: 'G40.919', description: 'Epilepsy, unspecified, intractable, without status epilepticus' },
  { code: 'R56.9', description: 'Unspecified convulsions' },
  { code: 'G40.401', description: 'Other generalized epilepsy and epileptic syndromes, not intractable, with status epilepticus' },

  // Multiple Sclerosis and Demyelinating Disorders
  { code: 'G35', description: 'Multiple sclerosis' },
  { code: 'G37.9', description: 'Demyelinating disease of central nervous system, unspecified' },

  // Peripheral Neuropathy
  { code: 'G60.9', description: 'Hereditary and idiopathic neuropathy, unspecified' },
  { code: 'G62.9', description: 'Polyneuropathy, unspecified' },
  { code: 'G63', description: 'Polyneuropathy in diseases classified elsewhere' },

  // Other Neurological Disorders
  { code: 'G47.33', description: 'Obstructive sleep apnea (adult) (pediatric)' },
  { code: 'G47.9', description: 'Sleep disorder, unspecified' },
  { code: 'G71.0', description: 'Muscular dystrophy' },
  { code: 'G72.9', description: 'Myopathy, unspecified' },
  { code: 'G93.40', description: 'Encephalopathy, unspecified' },

  // Paralysis and Weakness
  { code: 'G83.9', description: 'Paralytic syndrome, unspecified' },
  { code: 'G83.0', description: 'Diplegia of upper limbs' },
  { code: 'G83.1', description: 'Monoplegia of lower limb' },
  { code: 'G83.2', description: 'Monoplegia of upper limb' },
  { code: 'G83.3', description: 'Monoplegia, unspecified' },
  { code: 'G83.4', description: 'Cauda equina syndrome' },
  { code: 'G83.5', description: 'Locked-in state' },
  { code: 'G82.50', description: 'Quadriplegia, unspecified' },
  { code: 'G82.20', description: 'Paraplegia, unspecified' },
  { code: 'G81.90', description: 'Hemiplegia, unspecified affecting unspecified side' },
  { code: 'G81.91', description: 'Hemiplegia, unspecified affecting right dominant side' },
  { code: 'G81.92', description: 'Hemiplegia, unspecified affecting left dominant side' },
  { code: 'G81.93', description: 'Hemiplegia, unspecified affecting right nondominant side' },
  { code: 'G81.94', description: 'Hemiplegia, unspecified affecting left nondominant side' },
  { code: 'G12.21', description: 'Amyotrophic lateral sclerosis' },
  { code: 'G12.9', description: 'Spinal muscular atrophy, unspecified' },
  { code: 'G70.00', description: 'Myasthenia gravis without (acute) exacerbation' },
  { code: 'G70.01', description: 'Myasthenia gravis with (acute) exacerbation' },

  // Gastrointestinal Conditions
  { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
  { code: 'R10.9', description: 'Unspecified abdominal pain' },
  { code: 'K59.00', description: 'Constipation, unspecified' },
  { code: 'K58.9', description: 'Irritable bowel syndrome without diarrhea' },
  { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
  { code: 'K52.9', description: 'Noninfective gastroenteritis and colitis, unspecified' },
  { code: 'K57.30', description: 'Diverticulosis of large intestine without perforation or abscess without bleeding' },

  // Genitourinary Conditions
  // Chronic Kidney Disease
  { code: 'N18.1', description: 'Chronic kidney disease, stage 1' },
  { code: 'N18.2', description: 'Chronic kidney disease, stage 2 (mild)' },
  { code: 'N18.3', description: 'Chronic kidney disease, stage 3 (moderate)' },
  { code: 'N18.30', description: 'Chronic kidney disease, stage 3 unspecified' },
  { code: 'N18.31', description: 'Chronic kidney disease, stage 3a' },
  { code: 'N18.32', description: 'Chronic kidney disease, stage 3b' },
  { code: 'N18.4', description: 'Chronic kidney disease, stage 4 (severe)' },
  { code: 'N18.5', description: 'Chronic kidney disease, stage 5' },
  { code: 'N18.6', description: 'End stage renal disease' },
  { code: 'N18.9', description: 'Chronic kidney disease, unspecified' },

  // Hypertensive Kidney Disease codes moved to Cardiovascular section

  // Diabetic Kidney Disease
  { code: 'E10.21', description: 'Type 1 diabetes mellitus with diabetic nephropathy' },
  { code: 'E10.22', description: 'Type 1 diabetes mellitus with diabetic chronic kidney disease' },
  { code: 'E10.29', description: 'Type 1 diabetes mellitus with other diabetic kidney complication' },
  { code: 'E11.21', description: 'Type 2 diabetes mellitus with diabetic nephropathy' },
  { code: 'E11.22', description: 'Type 2 diabetes mellitus with diabetic chronic kidney disease' },
  { code: 'E11.29', description: 'Type 2 diabetes mellitus with other diabetic kidney complication' },

  // Other Kidney Conditions
  { code: 'N17.9', description: 'Acute kidney failure, unspecified' },
  { code: 'N28.9', description: 'Disorder of kidney and ureter, unspecified' },
  { code: 'R94.4', description: 'Abnormal results of kidney function studies' },

  // Other Genitourinary Conditions
  { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
  { code: 'N40.0', description: 'Benign prostatic hyperplasia without lower urinary tract symptoms' },
  { code: 'N92.0', description: 'Excessive and frequent menstruation with regular cycle' },
  { code: 'N95.1', description: 'Menopausal and female climacteric states' },

  // Dermatological Conditions
  { code: 'L30.9', description: 'Dermatitis, unspecified' },
  { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
  { code: 'B37.9', description: 'Candidiasis, unspecified' },
  { code: 'L03.90', description: 'Cellulitis, unspecified' },
  { code: 'L50.9', description: 'Urticaria, unspecified' },
  { code: 'L40.0', description: 'Psoriasis vulgaris' },

  // Eye and Ear Conditions
  { code: 'H10.9', description: 'Unspecified conjunctivitis' },
  { code: 'H60.9', description: 'Unspecified otitis externa' },
  { code: 'H66.90', description: 'Otitis media, unspecified, unspecified ear' },
  { code: 'H61.20', description: 'Impacted cerumen, unspecified ear' },
  { code: 'H25.9', description: 'Unspecified age-related cataract' },
  { code: 'H40.9', description: 'Unspecified glaucoma' },

  // General Symptoms
  // Fatigue and Weakness
  { code: 'R53.83', description: 'Other fatigue' },
  { code: 'R53.81', description: 'Other malaise' },
  { code: 'R53.82', description: 'Chronic fatigue, unspecified' },
  { code: 'R53.1', description: 'Weakness' },
  { code: 'R53.0', description: 'Neoplastic (malignant) related fatigue' },
  { code: 'R53.2', description: 'Functional quadriplegia' },
  { code: 'R29.898', description: 'Other symptoms and signs involving the musculoskeletal system' },
  { code: 'R26.89', description: 'Other abnormalities of gait and mobility' },
  { code: 'R26.9', description: 'Unspecified abnormalities of gait and mobility' },
  { code: 'R26.2', description: 'Difficulty in walking, not elsewhere classified' },
  { code: 'R26.0', description: 'Ataxic gait' },
  { code: 'R26.1', description: 'Paralytic gait' },
  { code: 'R27.9', description: 'Unspecified lack of coordination' },
  { code: 'R27.8', description: 'Other lack of coordination' },
  { code: 'R29.6', description: 'Repeated falls' },
  { code: 'R29.3', description: 'Abnormal posture' },
  { code: 'R41.82', description: 'Altered mental status, unspecified' },
  { code: 'R41.0', description: 'Disorientation, unspecified' },
  { code: 'R41.3', description: 'Other amnesia' },
  { code: 'R41.2', description: 'Retrograde amnesia' },
  { code: 'R41.1', description: 'Anterograde amnesia' },
  { code: 'R55', description: 'Syncope and collapse' },
  { code: 'R42', description: 'Dizziness and giddiness' },
  { code: 'R40.0', description: 'Somnolence' },
  { code: 'R40.1', description: 'Stupor' },
  { code: 'R40.20', description: 'Unspecified coma' },
  { code: 'R40.4', description: 'Transient alteration of awareness' },

  // Other General Symptoms
  { code: 'R07.9', description: 'Chest pain, unspecified' },
  { code: 'R05.9', description: 'Cough, unspecified' },
  { code: 'R06.02', description: 'Shortness of breath' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'R63.4', description: 'Abnormal weight loss' },
  { code: 'R63.5', description: 'Abnormal weight gain' },
  { code: 'R11.0', description: 'Nausea' },
  { code: 'R11.10', description: 'Vomiting, unspecified' },
  { code: 'R11.2', description: 'Nausea with vomiting, unspecified' },
  { code: 'R19.7', description: 'Diarrhea, unspecified' },
  { code: 'R60.9', description: 'Edema, unspecified' },
  { code: 'R60.0', description: 'Localized edema' },
  { code: 'R60.1', description: 'Generalized edema' },

  // Hematological Conditions
  // Anemia
  { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
  { code: 'D50.0', description: 'Iron deficiency anemia secondary to blood loss (chronic)' },
  { code: 'D51.0', description: 'Vitamin B12 deficiency anemia due to intrinsic factor deficiency' },
  { code: 'D51.9', description: 'Vitamin B12 deficiency anemia, unspecified' },
  { code: 'D52.9', description: 'Folate deficiency anemia, unspecified' },
  { code: 'D53.9', description: 'Nutritional anemia, unspecified' },
  { code: 'D59.9', description: 'Acquired hemolytic anemia, unspecified' },
  { code: 'D62', description: 'Acute posthemorrhagic anemia' },
  { code: 'D63.1', description: 'Anemia in chronic kidney disease' },
  { code: 'D64.9', description: 'Anemia, unspecified' },
  { code: 'D64.81', description: 'Anemia due to antineoplastic chemotherapy' },

  // Other Blood Disorders
  { code: 'D68.9', description: 'Coagulation defect, unspecified' },
  { code: 'D69.6', description: 'Thrombocytopenia, unspecified' },
  { code: 'D69.0', description: 'Allergic purpura' },
  { code: 'D70.9', description: 'Neutropenia, unspecified' },
  { code: 'D72.819', description: 'Decreased white blood cell count, unspecified' },
  { code: 'D75.9', description: 'Disease of blood and blood-forming organs, unspecified' },

  // Preventive Care and Encounters
  { code: 'Z23', description: 'Encounter for immunization' },
  { code: 'Z00.00', description: 'Encounter for general adult medical examination without abnormal findings' },
  { code: 'Z00.129', description: 'Encounter for routine child health examination without abnormal findings' },
  { code: 'Z71.3', description: 'Dietary counseling and surveillance' },
  { code: 'Z13.1', description: 'Encounter for screening for diabetes mellitus' },
  { code: 'Z13.6', description: 'Encounter for screening for cardiovascular disorders' },
  { code: 'Z12.31', description: 'Encounter for screening mammogram for malignant neoplasm of breast' },
  { code: 'Z12.11', description: 'Encounter for screening for malignant neoplasm of colon' },
  { code: 'Z79.01', description: 'Long term (current) use of anticoagulants' },
  { code: 'Z79.4', description: 'Long term (current) use of insulin' },
  { code: 'Z79.899', description: 'Other long term (current) drug therapy' },
  { code: 'Z87.891', description: 'Personal history of nicotine dependence' },
  { code: 'Z68.41', description: 'Body mass index (BMI) 40.0-44.9, adult' },
  { code: 'Z68.38', description: 'Body mass index (BMI) 38.0-38.9, adult' }
];

export default icd10Codes;
