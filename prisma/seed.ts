import { PrismaClient, ProductStatus, ServiceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
