'use strict';
/**
 * Konfident Interview 2025 — MongoDB Database Initializer & Seeder
 *
 *   node src/seed.js --clean   (npm run init / npm run clean-db)
 *     -> Pristine database: only the root administrator account. Zero mock data.
 *
 *   node src/seed.js --dev     (npm run seed)
 *     -> Clean fresh start: Root admin, staff admins, mentors, 40 candidates.
 *        All existing slots, interviews, evaluations, feedbacks cleared.
 *        Zero pre-existing slots. Every account password is `pass123`.
 *
 *   node src/seed.js --empty
 *     -> Removes every document from every collection (including the admin).
 */
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {
  connectDb, mongoose, User, Slot, Interview, Evaluation, StudentFeedback, AuditLog, Setting,
} = require('./db');

const argv = process.argv.slice(2);
let mode = 'dev';
if (argv.includes('--empty') || process.env.SEED_MODE === 'empty') mode = 'empty';
else if (argv.includes('--clean') || process.env.SEED_MODE === 'clean') mode = 'clean';
else if (argv.includes('--test') || process.env.SEED_MODE === 'test') mode = 'test';
else if (argv.includes('--dev') || process.env.SEED_MODE === 'dev') mode = 'dev';

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@yourinstitution.edu').toLowerCase().trim();
const adminName = process.env.ADMIN_NAME || 'Head Administrator';
let adminPassword = process.env.ADMIN_PASSWORD;
let generatedAdminPw = false;
if (mode === 'dev' || mode === 'test') {
  adminPassword = adminPassword || 'pass123';
} else if (mode === 'clean' && !adminPassword) {
  adminPassword = crypto.randomBytes(12).toString('base64url');
  generatedAdminPw = true;
}

const kalviumAdmins = [
  { name: 'Utkarsha Kasar', email: 'utkarsha.kasar@kalvium.com', can_technical: 1, can_hr: 1 },
  { name: 'Prachi Sharma', email: 'prachi.sharma@kalvium.com', can_technical: 0, can_hr: 0 },
  { name: 'Ashish Suresh', email: 'ashish.suresh@kalvium.com', can_technical: 0, can_hr: 0 },
  { name: 'Akshata Sanap', email: 'akshata.sanap@kalvium.com', can_technical: 0, can_hr: 1 },
];

const kalviumMentors = [
  { name: 'Manav Verma', email: 'manav.verma@kalvium.com', can_technical: 1, can_hr: 0 },
  { name: 'Muskan Srivastava', email: 'muskan.srivastava@kalvium.com', can_technical: 0, can_hr: 1 },
  { name: 'Ritu Soni', email: 'ritu.soni@kalvium.com', can_technical: 1, can_hr: 0 },
  { name: 'Shikhar Agarwal', email: 'shikhar.agarwal@kalvium.com', can_technical: 1, can_hr: 0 },
  { name: 'Shivam Shrivastava', email: 'shivam.shrivastava@kalvium.com', can_technical: 1, can_hr: 0 },
  { name: 'Aditya Kulshreshtha', email: 'aditya.kulshreshtha@kalvium.com', can_technical: 1, can_hr: 0 },
  { name: 'Hrituparno C', email: 'hrituparno.c@kalvium.com', can_technical: 1, can_hr: 0 },
  { name: 'Navaneeth V', email: 'navaneeth.v@kalvium.com', can_technical: 0, can_hr: 1 },
  { name: 'Kanishka Ragavi', email: 'kanishka.ragavi@kalvium.com', can_technical: 0, can_hr: 1 },
];

const kalviumStudents = [
  // Squad 116 (18 candidates)
  { name: 'Isha Agrawal', email: 'isha.agrawal.s.116@kalvium.community', squad: '116', roll_no: 'KAL116001' },
  { name: 'Aditya Talikoti', email: 'aditya.talikoti.s.116@kalvium.community', squad: '116', roll_no: 'KAL116002' },
  { name: 'Digvijay Patil', email: 'digvijay.patil.s.116@kalvium.community', squad: '116', roll_no: 'KAL116003' },
  { name: 'Anisha Santosh Agrawal', email: 'anisha.agrawal.s.116@kalvium.community', squad: '116', roll_no: 'KAL116004' },
  { name: 'Areesh Ahmed', email: 'areesh.ahmed.s.116@kalvium.community', squad: '116', roll_no: 'KAL116005' },
  { name: 'Kanishka Nishchal Girnar', email: 'kanishka.girnar.s.116@kalvium.community', squad: '116', roll_no: 'KAL116006' },
  { name: 'Aditya Sudhir Nagane', email: 'aditya.nagane.s.116@kalvium.community', squad: '116', roll_no: 'KAL116007' },
  { name: 'Shubham Uddhav Reddy', email: 'shubham.reddy.s.116@kalvium.community', squad: '116', roll_no: 'KAL116008' },
  { name: 'Yashwardhan Santosh Chaudhari', email: 'yashwardhan.chaudhari.s.116@kalvium.community', squad: '116', roll_no: 'KAL116009' },
  { name: 'Yashraj Jagtap', email: 'yashraj.jagtap.s.116@kalvium.community', squad: '116', roll_no: 'KAL116010' },
  { name: 'Aryan Patil', email: 'aryan.patil.s.116@kalvium.community', squad: '116', roll_no: 'KAL116011' },
  { name: 'Om Lonkar', email: 'om.lonkar.s.116@kalvium.community', squad: '116', roll_no: 'KAL116012' },
  { name: 'Gauri Mhetre', email: 'gauri.mhetre.s.116@kalvium.community', squad: '116', roll_no: 'KAL116013' },
  { name: 'Avadhut Murlidhar Pawar', email: 'avadhut.pawar.s.116@kalvium.community', squad: '116', roll_no: 'KAL116014' },
  { name: 'Riddhima Sinhal', email: 'riddhima.sinhal.s.116@kalvium.community', squad: '116', roll_no: 'KAL116015' },
  { name: 'Hardik Kaurani', email: 'hardik.kaurani.s.116@kalvium.community', squad: '116', roll_no: 'KAL116016' },
  { name: 'Tejas Vijaykumar Pujari', email: 'tejas.pujari.s.116@kalvium.com', squad: '116', roll_no: 'KAL116017' },
  { name: 'Khushal Rajput', email: 'khushal.rajput.s.116@kalvium.community', squad: '116', roll_no: 'KAL116018' },

  // Squad 115 (22 candidates)
  { name: 'Aayushman Shukla', email: 'aayushman.shukla.s.115@kalvium.community', squad: '115', roll_no: 'KAL115001' },
  { name: 'Prithvi Rajvanshi', email: 'prithvi.rajvanshi.s.115@kalvium.community', squad: '115', roll_no: 'KAL115002' },
  { name: 'Palakshi Verma', email: 'palakshi.verma.s.115@kalvium.community', squad: '115', roll_no: 'KAL115003' },
  { name: 'Ruhaa Bhalerao', email: 'ruhaa.bhalerao.s.115@kalvium.community', squad: '115', roll_no: 'KAL115004' },
  { name: 'Pratite Acharya', email: 'pratite.a.s.115@kalvium.community', squad: '115', roll_no: 'KAL115005' },
  { name: 'Ayush Shriam Awchar', email: 'shriram.awchar.s.115@kalvium.community', squad: '115', roll_no: 'KAL115006' },
  { name: 'varad shahane', email: 'varad.shahane.s.115@kalvium.community', squad: '115', roll_no: 'KAL115007' },
  { name: 'Raina George', email: 'raina.george.s.115@kalvium.community', squad: '115', roll_no: 'KAL115008' },
  { name: 'Shauryvardhan Dadasaheb Undre', email: 'shauryvardhan.undre.s.115@kalvium.community', squad: '115', roll_no: 'KAL115009' },
  { name: 'Om Jagtap', email: 'om.jagtap.s.115@kalvium.community', squad: '115', roll_no: 'KAL115010' },
  { name: 'Aadi Jain', email: 'aadi.jain.s.115@kalvium.community', squad: '115', roll_no: 'KAL115011' },
  { name: 'Parnil Vyawhare', email: 'parnil.vyawahare.s.115@kalvium.community', squad: '115', roll_no: 'KAL115012' },
  { name: 'Atharv Nitin Hargude', email: 'atharv.hargude.s.115@kalvium.community', squad: '115', roll_no: 'KAL115013' },
  { name: 'Sasmit Narnaware', email: 'sasmit.narnaware.s.115@kalvium.community', squad: '115', roll_no: 'KAL115014' },
  { name: 'Rakshaad Ashok Kolhe', email: 'rakshaad.kolhe.s.115@kalvium.community', squad: '115', roll_no: 'KAL115015' },
  { name: 'Sohini Tandon', email: 'sohini.tandon.s.115@kalvium.community', squad: '115', roll_no: 'KAL115016' },
  { name: 'Rishikesh Bagal', email: 'rishikesh.bagal.s.115@kalvium.community', squad: '115', roll_no: 'KAL115017' },
  { name: 'vinayak kulkarni', email: 'vinayak.kulkarni.s.115@kalvium.community', squad: '115', roll_no: 'KAL115018' },
  { name: 'Gitesh Makunda Chaudhari', email: 'gitesh.c.s.115@kalvium.community', squad: '115', roll_no: 'KAL115019' },
  { name: 'Devansh Subhash Pujari', email: 'devansh.pujari.s.115@kalvium.community', squad: '115', roll_no: 'KAL115020' },
  { name: 'Mohammad Aamir Patloo', email: 'mohammad.patloo.s.115@kalvium.community', squad: '115', roll_no: 'KAL115021' },
  { name: 'Shruti Shardul Itkalkar', email: 'shruti.itkalkar.s.115@kalvium.community', squad: '115', roll_no: 'KAL115022' }
];

async function clearManagedCollections() {
  await Promise.all([
    User.deleteMany({}),
    Slot.deleteMany({}),
    Interview.deleteMany({}),
    Evaluation.deleteMany({}),
    StudentFeedback.deleteMany({}),
    AuditLog.deleteMany({}),
    Setting.deleteMany({}),
  ]);
}

async function seed() {
  const conn = await connectDb();
  const host = conn.host || 'database';

  await clearManagedCollections();

  const pwHash = bcrypt.hashSync(mode === 'clean' ? adminPassword : 'pass123', 10);
  const adminPwHash = bcrypt.hashSync(adminPassword, 10);

  // Root administrator — present in every non-empty mode.
  if (mode !== 'empty') {
    await User.create({
      name: adminName,
      email: adminEmail,
      password_hash: adminPwHash,
      role: 'admin',
      can_technical: 1,
      can_hr: 1,
      active: 1,
    });
  }

  if (mode === 'dev' || mode === 'test') {
    for (const a of kalviumAdmins) {
      await User.create({
        name: a.name,
        email: a.email.toLowerCase(),
        password_hash: pwHash,
        role: 'admin',
        can_technical: a.can_technical || 0,
        can_hr: a.can_hr || 0,
        active: 1,
      });
    }

    await User.insertMany(kalviumMentors.map((m) => ({
      name: m.name,
      email: m.email.toLowerCase(),
      password_hash: pwHash,
      role: 'mentor',
      phone: '+91 90000 00000',
      can_technical: m.can_technical || 0,
      can_hr: m.can_hr || 0,
      active: 1,
    })));

    await User.insertMany(kalviumStudents.map((s) => ({
      name: s.name,
      email: s.email.toLowerCase(),
      password_hash: pwHash,
      role: 'student',
      roll_no: s.roll_no,
      squad: s.squad,
      branch: 'CSE',
      phone: '+91 98765 43210',
      resume_url: `https://drive.google.com/file/d/${s.roll_no}/view`,
      active: 1,
    })));
  }

  // Reporting.
  const [users, admins, mentors, students, openSlots, interviews, evals] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'mentor' }),
    User.countDocuments({ role: 'student' }),
    Slot.countDocuments(),
    Interview.countDocuments(),
    Evaluation.countDocuments(),
  ]);

  if (mode === 'clean') {
    const pwLine = generatedAdminPw
      ? `Password:    ${adminPassword}\n  (auto-generated — save it now, it is not stored anywhere else)`
      : `Password:    ${adminPassword}`;
    console.log(`
  =============================================================
  [Clean Production Database Initialized — MongoDB @ ${host}]
  =============================================================
  Root Admin:  ${adminEmail}
  ${pwLine}

  Users: ${users}   Students: ${students}   Mentors: ${mentors}   Slots: ${openSlots}
  =============================================================
  Sign in, then change this password at /profile.
  =============================================================
`);
  } else if (mode === 'empty') {
    console.log(`
  =============================================================
  [Database Emptied — MongoDB @ ${host}]
  All managed collections cleared (users, slots, interviews,
  evaluations, feedback, audit logs, settings).
  =============================================================
`);
  } else {
    console.log(`
  =============================================================
  [Fresh Start Initialized — MongoDB @ ${host}]
  =============================================================
  Every account password: pass123

  Admins:      ${admins}   (root: ${adminEmail})
  Mentors:     ${mentors}
  Students:    ${students}
  Slots in DB: ${openSlots} (Clean Start - 0 slots)
  Interviews:  ${interviews}
  Evaluations: ${evals}
  =============================================================
`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err && err.message ? err.message : err);
  process.exit(1);
});
