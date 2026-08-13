import prisma from '../config/database';

/**
 * PotentialSeller Repository
 * Handles data access for potential seller database
 */
export class PotentialSellerRepository {
  private prisma = prisma;

  constructor() {}

  /**
   * Find potential seller by email
   */
  async findByEmail(email: string): Promise<any | null> {
    return (this.prisma as any).potentialSeller.findUnique({
      where: { email },
      include: {
        region: true,
        seller: true,
      },
    });
  }

  /**
   * Find potential seller by phone
   */
  async findByPhone(phone: string): Promise<any | null> {
    return (this.prisma as any).potentialSeller.findFirst({
      where: { phone },
      include: {
        region: true,
        seller: true,
      },
    });
  }

  /**
   * Find potential seller by business name
   */
  async findByBusinessName(businessName: string): Promise<any | null> {
    return (this.prisma as any).potentialSeller.findFirst({
      where: { businessName },
      include: {
        region: true,
        seller: true,
      },
    });
  }

  /**
   * Get potential sellers by region
   */
  async getByRegion(regionId: string): Promise<any[]> {
    return (this.prisma as any).potentialSeller.findMany({
      where: { regionId },
      include: {
        region: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get potential sellers by status
   */
  async getByStatus(status: string): Promise<any[]> {
    return (this.prisma as any).potentialSeller.findMany({
      where: { status },
      include: {
        region: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Search potential sellers
   */
  async search(query: string): Promise<any[]> {
    return (this.prisma as any).potentialSeller.findMany({
      where: {
        OR: [
          { sellerName: { contains: query, mode: 'insensitive' } },
          { businessName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      },
      include: {
        region: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get potential sellers with filters
   */
  async getWithFilters(filters: {
    regionId?: string;
    status?: string;
    giTagged?: boolean;
    msme?: boolean;
    source?: string;
  }): Promise<any[]> {
    const where: any = {};

    if (filters.regionId) where.regionId = filters.regionId;
    if (filters.status) where.status = filters.status;
    if (filters.giTagged !== undefined) where.giTagged = filters.giTagged;
    if (filters.msme !== undefined) where.msme = filters.msme;
    if (filters.source) where.source = filters.source;

    return (this.prisma as any).potentialSeller.findMany({
      where,
      include: {
        region: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get statistics
   */
  async getStatistics() {
    const [
      total,
      notContacted,
      invitationSent,
      interested,
      registered,
      approved,
      rejected,
      inactive,
      giTagged,
      msme,
    ] = await Promise.all([
      (this.prisma as any).potentialSeller.count(),
      (this.prisma as any).potentialSeller.count({ where: { status: 'NOT_CONTACTED' } }),
      (this.prisma as any).potentialSeller.count({ where: { status: 'INVITATION_SENT' } }),
      (this.prisma as any).potentialSeller.count({ where: { status: 'INTERESTED' } }),
      (this.prisma as any).potentialSeller.count({ where: { status: 'REGISTERED' } }),
      (this.prisma as any).potentialSeller.count({ where: { status: 'APPROVED' } }),
      (this.prisma as any).potentialSeller.count({ where: { status: 'REJECTED' } }),
      (this.prisma as any).potentialSeller.count({ where: { status: 'INACTIVE' } }),
      (this.prisma as any).potentialSeller.count({ where: { giTagged: true } }),
      (this.prisma as any).potentialSeller.count({ where: { msme: true } }),
    ]);

    return {
      total,
      notContacted,
      invitationSent,
      interested,
      registered,
      approved,
      rejected,
      inactive,
      giTagged,
      msme,
    };
  }

  /**
   * Link to seller account
   */
  async linkToSeller(potentialSellerId: string, sellerId: string): Promise<any> {
    return (this.prisma as any).potentialSeller.update({
      where: { id: potentialSellerId },
      data: {
        sellerId,
        status: 'REGISTERED',
      },
      include: {
        region: true,
        seller: true,
      },
    });
  }

  /**
   * Update status
   */
  async updateStatus(id: string, status: string): Promise<any> {
    return (this.prisma as any).potentialSeller.update({
      where: { id },
      data: { status },
      include: {
        region: true,
        seller: true,
      },
    });
  }

  /**
   * Get with invitations
   */
  async getWithInvitations(id: string): Promise<any | null> {
    return (this.prisma as any).potentialSeller.findUnique({
      where: { id },
      include: {
        region: true,
        seller: true,
        invitations: {
          orderBy: { invitationDate: 'desc' },
        },
      },
    });
  }

  /**
   * Create potential seller
   */
  async create(data: any): Promise<any> {
    return (this.prisma as any).potentialSeller.create({
      data,
      include: {
        region: true,
      },
    });
  }

  /**
   * Update potential seller
   */
  async update(id: string, data: any): Promise<any> {
    return (this.prisma as any).potentialSeller.update({
      where: { id },
      data,
      include: {
        region: true,
        seller: true,
      },
    });
  }

  /**
   * Delete potential seller
   */
  async delete(id: string): Promise<any> {
    return (this.prisma as any).potentialSeller.delete({
      where: { id },
    });
  }

  /**
   * Get all potential sellers
   */
  async findAll(): Promise<any[]> {
    return (this.prisma as any).potentialSeller.findMany({
      include: {
        region: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<any | null> {
    return (this.prisma as any).potentialSeller.findUnique({
      where: { id },
      include: {
        region: true,
        seller: true,
        invitations: true,
      },
    });
  }
}
