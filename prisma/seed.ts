import { hash } from 'bcryptjs';
import { PrismaClient, ProductStatus, ServiceStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const permissionDefinitions = [
  { key: 'auth.profile.read', description: 'View authenticated profile details.' },
  { key: 'contact.read', description: 'Read contact submissions.' },
  { key: 'newsletter.read', description: 'Read newsletter subscriptions.' },
  { key: 'site-settings.read', description: 'Read site settings from admin.' },
  { key: 'site-settings.update', description: 'Update site settings.' },
  { key: 'service-requests.read', description: 'Read service requests.' },
  { key: 'service-requests.update', description: 'Update service requests.' },
  { key: 'service-requests.delete', description: 'Delete service requests.' },
  { key: 'products.create', description: 'Create products.' },
  { key: 'products.read', description: 'Read products from admin.' },
  { key: 'products.update', description: 'Update products.' },
  { key: 'products.delete', description: 'Delete products.' },
  { key: 'products.media.update', description: 'Manage product media.' },
  { key: 'services.create', description: 'Create services.' },
  { key: 'services.read', description: 'Read services from admin.' },
  { key: 'services.update', description: 'Update services.' },
  { key: 'services.delete', description: 'Delete services.' },
  { key: 'services.media.update', description: 'Manage service media.' },
] as const;

const staffPermissionKeys = new Set([
  'auth.profile.read',
  'contact.read',
  'newsletter.read',
  'site-settings.read',
  'site-settings.update',
  'service-requests.read',
  'service-requests.update',
  'products.create',
  'products.read',
  'products.update',
  'products.media.update',
  'services.create',
  'services.read',
  'services.update',
  'services.media.update',
]);

async function seedRolesAndPermissions() {
  const adminRole = await prisma.role.upsert({
    where: { name: UserRole.ADMIN },
    update: {
      description: 'Default administrator role with full access.',
    },
    create: {
      name: UserRole.ADMIN,
      description: 'Default administrator role with full access.',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: UserRole.STAFF },
    update: {
      description: 'Default staff role for authenticated back office users.',
    },
    create: {
      name: UserRole.STAFF,
      description: 'Default staff role for authenticated back office users.',
    },
  });

  for (const permission of permissionDefinitions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: { description: permission.description },
      create: permission,
    });
  }

  const permissions = await prisma.permission.findMany();

  await prisma.rolePermission.deleteMany({
    where: { roleId: { in: [adminRole.id, staffRole.id] } },
  });

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  await prisma.rolePermission.createMany({
    data: permissions
      .filter((permission) => staffPermissionKeys.has(permission.key))
      .map((permission) => ({
        roleId: staffRole.id,
        permissionId: permission.id,
      })),
    skipDuplicates: true,
  });

  return { adminRole, staffRole };
}

async function seedDefaultAdmin(adminRoleId: string) {
  const email = (process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@example.com').trim().toLowerCase();
  const fullName = (process.env.DEFAULT_ADMIN_NAME ?? 'Administrator').trim();
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'change-this-password';
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      passwordHash,
      roleId: adminRoleId,
      isActive: true,
    },
    create: {
      email,
      fullName,
      passwordHash,
      roleId: adminRoleId,
      isActive: true,
    },
  });
}

async function seedContent() {
  await prisma.siteSetting.upsert({
    where: { id: 'default-site-settings' },
    update: {
      companyName: 'NextFi Software',
      supportEmail: 'support@nextfi-wallet.local',
      businessEmail: 'business@nextfi-wallet.local',
      footerText: 'NextFi Software builds fintech products and custom software solutions.',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/nextfi-software' },
      ],
    },
    create: {
      id: 'default-site-settings',
      companyName: 'NextFi Software',
      supportEmail: 'support@nextfi-wallet.local',
      businessEmail: 'business@nextfi-wallet.local',
      footerText: 'NextFi Software builds fintech products and custom software solutions.',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/nextfi-software' },
      ],
    },
  });

  await prisma.product.upsert({
    where: { slug: 'nextfi-wallet' },
    update: {},
    create: {
      name: 'NextFi Wallet',
      slug: 'nextfi-wallet',
      shortDescription: 'A non-custodial Stellar wallet for XLM and USDC.',
      longDescription:
        'NextFi Wallet supports payments, swaps, claimable balances, and P2P trading on Stellar.',
      features: [
        'Non-custodial account control',
        'XLM and USDC support',
        'Stellar claimable balances',
        'Peer-to-peer trading flows',
      ],
      status: ProductStatus.PUBLISHED,
      downloadAndroidUrl: null,
      downloadIosUrl: null,
      downloadWebUrl: null,
      githubUrl: null,
    },
  });

  await prisma.service.upsert({
    where: { slug: 'fintech-product-development' },
    update: {},
    create: {
      title: 'Fintech Product Development',
      slug: 'fintech-product-development',
      shortDescription: 'Custom fintech software engineering for startups and growth teams.',
      content:
        'We design and build secure fintech products, internal systems, and tailored software platforms.',
      status: ServiceStatus.PUBLISHED,
      heroTitle: 'Build fintech products with a backend designed for growth',
      heroSubtitle: 'Strategy, architecture, and delivery',
      heroDescription:
        'From wallet infrastructure to custom operational tools, we ship production-grade systems.',
      overviewTitle: 'What we deliver',
      overviewContent:
        'Product discovery, architecture, backend APIs, admin tooling, and iterative delivery.',
      benefits: ['Production-focused architecture', 'Extensible modules', 'Operational scalability'],
      featuresList: ['NestJS APIs', 'Prisma data models', 'Redis caching', 'Cloudinary media'],
      processSteps: ['Discovery', 'Architecture', 'Implementation', 'Launch support'],
      faqs: [
        {
          question: 'Do you only work on fintech?',
          answer: 'Fintech is our specialty, but we also deliver adjacent custom software systems.',
        },
      ],
      ctaTitle: 'Discuss your custom system',
      ctaDescription: 'Share your requirements and NextFi Software can scope the right build plan.',
      ctaButtonLabel: 'Request a Consultation',
      seoTitle: 'Fintech Product Development | NextFi Software',
      seoDescription: 'Custom fintech backend systems, APIs, and platform engineering.',
      seoKeywords: ['fintech', 'backend api', 'custom software', 'nestjs', 'prisma'],
      isFeatured: true,
      sortOrder: 1,
    },
  });
}

async function main() {
  const { adminRole } = await seedRolesAndPermissions();
  await seedDefaultAdmin(adminRole.id);
  await seedContent();
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
