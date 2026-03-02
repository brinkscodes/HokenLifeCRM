-- HokenLife CRM — Seed Data
-- Run this AFTER a user has signed up (so an org + profile exist)
-- Replace the org_id and user_id below with real values from your database.
--
-- To find your IDs, run:
--   SELECT id as org_id FROM organizations LIMIT 1;
--   SELECT id as user_id FROM profiles LIMIT 1;
--
-- Then search-replace in this file:
--   ORG_ID_HERE  → your org uuid
--   USER_ID_HERE → your user uuid

-- ============================================================
-- CONTACTS (20 contacts)
-- ============================================================
INSERT INTO contacts (first_name, last_name, email, phone, type, notes, org_id, created_by) VALUES
('James', 'Tanaka', 'james.tanaka@email.com', '(555) 100-0001', 'individual', 'Long-time client, prefers email contact.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Sarah', 'Mitchell', 'sarah.mitchell@email.com', '(555) 100-0002', 'individual', 'Referred by James Tanaka.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Michael', 'Chen', 'michael.chen@techcorp.com', '(555) 100-0003', 'business', 'CEO of TechCorp. Interested in group plans.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Emily', 'Rodriguez', 'emily.rodriguez@email.com', '(555) 100-0004', 'individual', 'New homeowner, needs home + auto bundle.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('David', 'Nakamura', 'david.nakamura@email.com', '(555) 100-0005', 'individual', 'Retiring next year, reviewing life insurance.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Lisa', 'Park', 'lisa.park@parklaw.com', '(555) 100-0006', 'business', 'Law firm — needs professional liability.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Robert', 'Williams', 'robert.williams@email.com', '(555) 100-0007', 'individual', 'Young family, interested in term life.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Jennifer', 'Sato', 'jennifer.sato@email.com', '(555) 100-0008', 'individual', 'Freelancer, needs health insurance.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Andrew', 'Kim', 'andrew.kim@kimgroup.com', '(555) 100-0009', 'business', 'Restaurant group, 3 locations.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Maria', 'Garcia', 'maria.garcia@email.com', '(555) 100-0010', 'individual', 'Renewing auto policy, shopping for better rates.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Thomas', 'Brown', 'thomas.brown@email.com', '(555) 100-0011', 'individual', 'Commercial driver, needs specialized auto.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Amanda', 'Lee', 'amanda.lee@email.com', '(555) 100-0012', 'individual', 'College student, first-time renter.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Daniel', 'Martinez', 'daniel.martinez@dmconstruction.com', '(555) 100-0013', 'business', 'Construction company, workers comp needed.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Rachel', 'Yamamoto', 'rachel.yamamoto@email.com', '(555) 100-0014', 'individual', 'Recently married, updating beneficiaries.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Kevin', 'Johnson', 'kevin.johnson@email.com', '(555) 100-0015', 'individual', 'Small business owner, home office.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Stephanie', 'Wong', 'stephanie.wong@email.com', '(555) 100-0016', 'individual', 'Expecting first child, reviewing coverage.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Christopher', 'Davis', 'chris.davis@davisauto.com', '(555) 100-0017', 'business', 'Auto dealership, fleet coverage.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Michelle', 'Hernandez', 'michelle.h@email.com', '(555) 100-0018', 'individual', 'Real estate investor, multiple properties.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Brian', 'Suzuki', 'brian.suzuki@email.com', '(555) 100-0019', 'individual', 'IT professional, interested in disability insurance.', 'ORG_ID_HERE', 'USER_ID_HERE'),
('Nicole', 'Taylor', 'nicole.taylor@email.com', '(555) 100-0020', 'individual', 'Teacher, looking for supplemental coverage.', 'ORG_ID_HERE', 'USER_ID_HERE');

-- ============================================================
-- POLICIES (30 policies — linked to contacts by subquery)
-- ============================================================
INSERT INTO policies (policy_number, contact_id, type, status, premium, start_date, end_date, org_id) VALUES
('POL-2025-001', (SELECT id FROM contacts WHERE email='james.tanaka@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'active', 1200.00, '2025-01-15', '2026-01-15', 'ORG_ID_HERE'),
('POL-2025-002', (SELECT id FROM contacts WHERE email='james.tanaka@email.com' AND org_id='ORG_ID_HERE'), 'home', 'active', 1800.00, '2025-03-01', '2026-03-01', 'ORG_ID_HERE'),
('POL-2025-003', (SELECT id FROM contacts WHERE email='sarah.mitchell@email.com' AND org_id='ORG_ID_HERE'), 'life', 'active', 450.00, '2025-06-01', '2026-06-01', 'ORG_ID_HERE'),
('POL-2025-004', (SELECT id FROM contacts WHERE email='michael.chen@techcorp.com' AND org_id='ORG_ID_HERE'), 'commercial', 'active', 5500.00, '2025-02-01', '2026-02-01', 'ORG_ID_HERE'),
('POL-2025-005', (SELECT id FROM contacts WHERE email='michael.chen@techcorp.com' AND org_id='ORG_ID_HERE'), 'workers_comp', 'active', 3200.00, '2025-02-01', '2026-02-01', 'ORG_ID_HERE'),
('POL-2025-006', (SELECT id FROM contacts WHERE email='emily.rodriguez@email.com' AND org_id='ORG_ID_HERE'), 'home', 'active', 1400.00, '2025-08-15', '2026-08-15', 'ORG_ID_HERE'),
('POL-2025-007', (SELECT id FROM contacts WHERE email='emily.rodriguez@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'active', 900.00, '2025-08-15', '2026-08-15', 'ORG_ID_HERE'),
('POL-2025-008', (SELECT id FROM contacts WHERE email='david.nakamura@email.com' AND org_id='ORG_ID_HERE'), 'life', 'active', 2400.00, '2025-01-01', '2026-01-01', 'ORG_ID_HERE'),
('POL-2025-009', (SELECT id FROM contacts WHERE email='lisa.park@parklaw.com' AND org_id='ORG_ID_HERE'), 'professional_liability', 'active', 4200.00, '2025-04-01', '2026-04-01', 'ORG_ID_HERE'),
('POL-2025-010', (SELECT id FROM contacts WHERE email='robert.williams@email.com' AND org_id='ORG_ID_HERE'), 'life', 'active', 600.00, '2025-07-01', '2026-07-01', 'ORG_ID_HERE'),
('POL-2025-011', (SELECT id FROM contacts WHERE email='jennifer.sato@email.com' AND org_id='ORG_ID_HERE'), 'health', 'active', 3600.00, '2025-01-01', '2026-01-01', 'ORG_ID_HERE'),
('POL-2025-012', (SELECT id FROM contacts WHERE email='andrew.kim@kimgroup.com' AND org_id='ORG_ID_HERE'), 'commercial', 'active', 7800.00, '2025-05-01', '2026-05-01', 'ORG_ID_HERE'),
('POL-2025-013', (SELECT id FROM contacts WHERE email='andrew.kim@kimgroup.com' AND org_id='ORG_ID_HERE'), 'workers_comp', 'active', 4500.00, '2025-05-01', '2026-05-01', 'ORG_ID_HERE'),
('POL-2025-014', (SELECT id FROM contacts WHERE email='maria.garcia@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'active', 950.00, '2025-09-01', '2026-09-01', 'ORG_ID_HERE'),
('POL-2025-015', (SELECT id FROM contacts WHERE email='thomas.brown@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'active', 2100.00, '2025-03-15', '2026-03-15', 'ORG_ID_HERE'),
('POL-2025-016', (SELECT id FROM contacts WHERE email='amanda.lee@email.com' AND org_id='ORG_ID_HERE'), 'renters', 'active', 180.00, '2025-08-01', '2026-08-01', 'ORG_ID_HERE'),
('POL-2025-017', (SELECT id FROM contacts WHERE email='daniel.martinez@dmconstruction.com' AND org_id='ORG_ID_HERE'), 'commercial', 'active', 6200.00, '2025-01-15', '2026-01-15', 'ORG_ID_HERE'),
('POL-2025-018', (SELECT id FROM contacts WHERE email='daniel.martinez@dmconstruction.com' AND org_id='ORG_ID_HERE'), 'workers_comp', 'active', 8900.00, '2025-01-15', '2026-01-15', 'ORG_ID_HERE'),
('POL-2025-019', (SELECT id FROM contacts WHERE email='rachel.yamamoto@email.com' AND org_id='ORG_ID_HERE'), 'life', 'active', 350.00, '2025-10-01', '2026-10-01', 'ORG_ID_HERE'),
('POL-2025-020', (SELECT id FROM contacts WHERE email='kevin.johnson@email.com' AND org_id='ORG_ID_HERE'), 'home', 'active', 1100.00, '2025-06-15', '2026-06-15', 'ORG_ID_HERE'),
('POL-2025-021', (SELECT id FROM contacts WHERE email='stephanie.wong@email.com' AND org_id='ORG_ID_HERE'), 'health', 'active', 4800.00, '2025-11-01', '2026-11-01', 'ORG_ID_HERE'),
('POL-2025-022', (SELECT id FROM contacts WHERE email='chris.davis@davisauto.com' AND org_id='ORG_ID_HERE'), 'commercial', 'active', 12000.00, '2025-02-01', '2026-02-01', 'ORG_ID_HERE'),
('POL-2025-023', (SELECT id FROM contacts WHERE email='michelle.h@email.com' AND org_id='ORG_ID_HERE'), 'home', 'active', 3200.00, '2025-04-15', '2026-04-15', 'ORG_ID_HERE'),
('POL-2025-024', (SELECT id FROM contacts WHERE email='michelle.h@email.com' AND org_id='ORG_ID_HERE'), 'umbrella', 'active', 800.00, '2025-04-15', '2026-04-15', 'ORG_ID_HERE'),
('POL-2025-025', (SELECT id FROM contacts WHERE email='brian.suzuki@email.com' AND org_id='ORG_ID_HERE'), 'disability', 'active', 1500.00, '2025-07-01', '2026-07-01', 'ORG_ID_HERE'),
('POL-2025-026', (SELECT id FROM contacts WHERE email='nicole.taylor@email.com' AND org_id='ORG_ID_HERE'), 'life', 'active', 300.00, '2025-09-01', '2026-09-01', 'ORG_ID_HERE'),
('POL-2024-027', (SELECT id FROM contacts WHERE email='james.tanaka@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'expired', 1100.00, '2024-01-15', '2025-01-15', 'ORG_ID_HERE'),
('POL-2024-028', (SELECT id FROM contacts WHERE email='maria.garcia@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'expired', 900.00, '2024-09-01', '2025-09-01', 'ORG_ID_HERE'),
('POL-2025-029', (SELECT id FROM contacts WHERE email='robert.williams@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'active', 750.00, '2025-07-01', '2026-07-01', 'ORG_ID_HERE'),
('POL-2025-030', (SELECT id FROM contacts WHERE email='kevin.johnson@email.com' AND org_id='ORG_ID_HERE'), 'auto', 'active', 850.00, '2025-06-15', '2026-06-15', 'ORG_ID_HERE');

-- ============================================================
-- CLAIMS (10 claims)
-- ============================================================
INSERT INTO claims (claim_number, policy_id, status, amount, description, filed_date, org_id) VALUES
('CLM-2025-001', (SELECT id FROM policies WHERE policy_number='POL-2025-001' AND org_id='ORG_ID_HERE'), 'closed', 2500.00, 'Rear-end collision at intersection. Minor damage to bumper and trunk.', '2025-03-10', 'ORG_ID_HERE'),
('CLM-2025-002', (SELECT id FROM policies WHERE policy_number='POL-2025-002' AND org_id='ORG_ID_HERE'), 'approved', 8500.00, 'Water damage from burst pipe in basement.', '2025-06-15', 'ORG_ID_HERE'),
('CLM-2025-003', (SELECT id FROM policies WHERE policy_number='POL-2025-006' AND org_id='ORG_ID_HERE'), 'in_review', 3200.00, 'Wind damage to roof during storm.', '2025-11-20', 'ORG_ID_HERE'),
('CLM-2025-004', (SELECT id FROM policies WHERE policy_number='POL-2025-007' AND org_id='ORG_ID_HERE'), 'open', 1800.00, 'Parking lot hit and run, driver side door.', '2026-01-05', 'ORG_ID_HERE'),
('CLM-2025-005', (SELECT id FROM policies WHERE policy_number='POL-2025-012' AND org_id='ORG_ID_HERE'), 'closed', 15000.00, 'Kitchen fire at restaurant location 2.', '2025-08-22', 'ORG_ID_HERE'),
('CLM-2025-006', (SELECT id FROM policies WHERE policy_number='POL-2025-015' AND org_id='ORG_ID_HERE'), 'approved', 4200.00, 'Windshield replacement and front bumper repair.', '2025-10-03', 'ORG_ID_HERE'),
('CLM-2025-007', (SELECT id FROM policies WHERE policy_number='POL-2025-017' AND org_id='ORG_ID_HERE'), 'in_review', 22000.00, 'Equipment theft from job site.', '2026-02-14', 'ORG_ID_HERE'),
('CLM-2025-008', (SELECT id FROM policies WHERE policy_number='POL-2025-023' AND org_id='ORG_ID_HERE'), 'open', 5500.00, 'Tenant damage to rental property unit B.', '2026-02-28', 'ORG_ID_HERE'),
('CLM-2025-009', (SELECT id FROM policies WHERE policy_number='POL-2025-011' AND org_id='ORG_ID_HERE'), 'denied', 12000.00, 'Elective procedure not covered under plan.', '2025-09-15', 'ORG_ID_HERE'),
('CLM-2025-010', (SELECT id FROM policies WHERE policy_number='POL-2025-014' AND org_id='ORG_ID_HERE'), 'open', 900.00, 'Minor fender bender in parking garage.', '2026-03-01', 'ORG_ID_HERE');

-- ============================================================
-- LEADS (15 leads)
-- ============================================================
INSERT INTO leads (contact_id, source, status, assigned_to, value, org_id) VALUES
((SELECT id FROM contacts WHERE email='sarah.mitchell@email.com' AND org_id='ORG_ID_HERE'), 'referral', 'qualified', 'USER_ID_HERE', 2500.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='emily.rodriguez@email.com' AND org_id='ORG_ID_HERE'), 'website', 'won', 'USER_ID_HERE', 2300.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='robert.williams@email.com' AND org_id='ORG_ID_HERE'), 'referral', 'won', 'USER_ID_HERE', 600.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='jennifer.sato@email.com' AND org_id='ORG_ID_HERE'), 'website', 'won', 'USER_ID_HERE', 3600.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='amanda.lee@email.com' AND org_id='ORG_ID_HERE'), 'social_media', 'won', 'USER_ID_HERE', 180.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='rachel.yamamoto@email.com' AND org_id='ORG_ID_HERE'), 'referral', 'proposal', 'USER_ID_HERE', 1200.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='stephanie.wong@email.com' AND org_id='ORG_ID_HERE'), 'website', 'contacted', 'USER_ID_HERE', 4800.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='nicole.taylor@email.com' AND org_id='ORG_ID_HERE'), 'cold_call', 'qualified', 'USER_ID_HERE', 1500.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='brian.suzuki@email.com' AND org_id='ORG_ID_HERE'), 'website', 'won', 'USER_ID_HERE', 1500.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='thomas.brown@email.com' AND org_id='ORG_ID_HERE'), 'referral', 'new', 'USER_ID_HERE', 3500.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='maria.garcia@email.com' AND org_id='ORG_ID_HERE'), 'website', 'new', 'USER_ID_HERE', 950.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='kevin.johnson@email.com' AND org_id='ORG_ID_HERE'), 'referral', 'contacted', 'USER_ID_HERE', 2000.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='michelle.h@email.com' AND org_id='ORG_ID_HERE'), 'website', 'proposal', 'USER_ID_HERE', 4000.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='chris.davis@davisauto.com' AND org_id='ORG_ID_HERE'), 'cold_call', 'qualified', 'USER_ID_HERE', 12000.00, 'ORG_ID_HERE'),
((SELECT id FROM contacts WHERE email='daniel.martinez@dmconstruction.com' AND org_id='ORG_ID_HERE'), 'referral', 'lost', 'USER_ID_HERE', 8000.00, 'ORG_ID_HERE');

-- ============================================================
-- ACTIVITIES (25 activities)
-- ============================================================
INSERT INTO activities (type, description, contact_id, user_id, org_id, created_at) VALUES
('call', 'Initial consultation call. Discussed auto and home bundle options.', (SELECT id FROM contacts WHERE email='james.tanaka@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-10 09:30:00'),
('email', 'Sent policy documents for review and signature.', (SELECT id FROM contacts WHERE email='james.tanaka@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-12 14:00:00'),
('meeting', 'In-office meeting to review and sign auto + home policies.', (SELECT id FROM contacts WHERE email='james.tanaka@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-15 10:00:00'),
('call', 'Introductory call. Referred by James Tanaka.', (SELECT id FROM contacts WHERE email='sarah.mitchell@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-05-20 11:00:00'),
('email', 'Sent life insurance quote comparison.', (SELECT id FROM contacts WHERE email='sarah.mitchell@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-05-22 16:00:00'),
('meeting', 'Video call to discuss group health and commercial coverage.', (SELECT id FROM contacts WHERE email='michael.chen@techcorp.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-25 14:30:00'),
('note', 'Client wants to add workers comp. Needs 15 employee roster.', (SELECT id FROM contacts WHERE email='michael.chen@techcorp.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-26 09:00:00'),
('call', 'Follow-up on home + auto bundle. Closing next week.', (SELECT id FROM contacts WHERE email='emily.rodriguez@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-08-10 10:30:00'),
('email', 'Sent renewal reminder. Policy expires in 30 days.', (SELECT id FROM contacts WHERE email='david.nakamura@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-12-01 08:00:00'),
('call', 'Discussed retirement planning and life insurance conversion.', (SELECT id FROM contacts WHERE email='david.nakamura@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-12-05 15:00:00'),
('meeting', 'Annual review meeting. Updated professional liability coverage.', (SELECT id FROM contacts WHERE email='lisa.park@parklaw.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-03-20 13:00:00'),
('task', 'Prepare renewal quotes for restaurant group coverage.', (SELECT id FROM contacts WHERE email='andrew.kim@kimgroup.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-04-15 09:00:00'),
('call', 'Discussed adding third restaurant location to policy.', (SELECT id FROM contacts WHERE email='andrew.kim@kimgroup.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-09-10 11:00:00'),
('email', 'Sent rate comparison for auto insurance. Lower rate available.', (SELECT id FROM contacts WHERE email='maria.garcia@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-08-25 13:30:00'),
('note', 'Needs specialized commercial vehicle coverage. Getting quotes.', (SELECT id FROM contacts WHERE email='thomas.brown@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-03-10 10:00:00'),
('call', 'Explained renters insurance options and pricing.', (SELECT id FROM contacts WHERE email='amanda.lee@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-07-28 16:00:00'),
('meeting', 'On-site meeting at construction office. Reviewed all coverage.', (SELECT id FROM contacts WHERE email='daniel.martinez@dmconstruction.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-10 09:00:00'),
('task', 'File claim for equipment theft. Photos and police report received.', (SELECT id FROM contacts WHERE email='daniel.martinez@dmconstruction.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2026-02-14 11:00:00'),
('call', 'Congratulations call on marriage. Discussed updating beneficiaries.', (SELECT id FROM contacts WHERE email='rachel.yamamoto@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-09-28 10:00:00'),
('email', 'Sent disability insurance brochure and quote.', (SELECT id FROM contacts WHERE email='brian.suzuki@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-06-25 14:00:00'),
('call', 'Follow-up on disability quote. Client ready to proceed.', (SELECT id FROM contacts WHERE email='brian.suzuki@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-06-28 11:30:00'),
('email', 'Sent fleet insurance proposal for 45 vehicles.', (SELECT id FROM contacts WHERE email='chris.davis@davisauto.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-20 10:00:00'),
('meeting', 'Walk-through of dealership for coverage assessment.', (SELECT id FROM contacts WHERE email='chris.davis@davisauto.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-01-28 09:00:00'),
('note', 'Client owns 4 rental properties. Needs landlord policies for each.', (SELECT id FROM contacts WHERE email='michelle.h@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-04-10 15:00:00'),
('call', 'Discussed supplemental coverage options for teachers.', (SELECT id FROM contacts WHERE email='nicole.taylor@email.com' AND org_id='ORG_ID_HERE'), 'USER_ID_HERE', 'ORG_ID_HERE', '2025-08-30 14:00:00');
