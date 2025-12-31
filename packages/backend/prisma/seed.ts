import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a district
  const district = await prisma.district.upsert({
    where: { code: 'TLV-DIST' },
    update: {},
    create: {
      code: 'TLV-DIST',
      name: 'Tel Aviv District',
      country: 'IL',
    },
  });
  console.log('✅ District created:', district.name);

  // Create a school
  const school = await prisma.school.upsert({
    where: { code: 'TLV-HS-01' },
    update: {},
    create: {
      code: 'TLV-HS-01',
      name: 'Tel Aviv High School',
      districtId: district.id,
      address: 'Tel Aviv, Israel',
      email: 'contact@tlv-hs.edu',
    },
  });
  console.log('✅ School created:', school.name);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tlv-hs.edu' },
    update: {},
    create: {
      email: 'admin@tlv-hs.edu',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      schoolId: school.id,
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create a teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@tlv-hs.edu' },
    update: {},
    create: {
      email: 'teacher@tlv-hs.edu',
      role: 'TEACHER',
      firstName: 'John',
      lastName: 'Doe',
      schoolId: school.id,
      emailVerified: true,
    },
  });
  console.log('✅ Teacher created:', teacher.email);

  // Create a principal
  const principal = await prisma.user.upsert({
    where: { email: 'principal@tlv-hs.edu' },
    update: {},
    create: {
      email: 'principal@tlv-hs.edu',
      role: 'PRINCIPAL',
      firstName: 'Jane',
      lastName: 'Smith',
      schoolId: school.id,
      emailVerified: true,
    },
  });
  console.log('✅ Principal created:', principal.email);

  // Create sample students
  const student1 = await prisma.student.create({
    data: {
      firstName: 'David',
      lastName: 'Cohen',
      studentId: 'S12345',
      gradeLevel: '10',
      schoolId: school.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Levi',
      studentId: 'S12346',
      gradeLevel: '10',
      schoolId: school.id,
    },
  });
  console.log('✅ Students created: 2');

  // Create a class
  const mathClass = await prisma.class.create({
    data: {
      name: 'Math Period 3',
      subject: 'Math',
      gradeLevel: '10',
      section: 'A',
      teacherId: teacher.id,
      schoolId: school.id,
      academicYear: '2025-2026',
    },
  });
  console.log('✅ Class created:', mathClass.name);

  // Enroll students in class
  await prisma.classEnrollment.create({
    data: {
      studentId: student1.id,
      classId: mathClass.id,
    },
  });

  await prisma.classEnrollment.create({
    data: {
      studentId: student2.id,
      classId: mathClass.id,
    },
  });
  console.log('✅ Students enrolled in class');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
