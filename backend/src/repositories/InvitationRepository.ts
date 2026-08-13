import prisma from '../config/database';

/**
 * Invitation Repository
 * Handles data access for seller invitations
 */
export class InvitationRepository {
  private prisma = prisma;

  constructor() {}

  /**
   * Create invitation
   */
  async create(data: {
    potentialSellerId: string;
    method: string;
    notes?: string;
  }): Promise<any> {
    return (this.prisma as any).invitation.create({
      data,
      include: {
        potentialSeller: {
          include: {
            region: true,
          },
        },
      },
    });
  }

  /**
   * Get invitations by potential seller
   */
  async getByPotentialSeller(potentialSellerId: string): Promise<any[]> {
    return (this.prisma as any).invitation.findMany({
      where: { potentialSellerId },
      include: {
        potentialSeller: {
          include: {
            region: true,
          },
        },
      },
      orderBy: { invitationDate: 'desc' },
    });
  }

  /**
   * Get all invitations
   */
  async findAll(): Promise<any[]> {
    return (this.prisma as any).invitation.findMany({
      include: {
        potentialSeller: {
          include: {
            region: true,
          },
        },
      },
      orderBy: { invitationDate: 'desc' },
    });
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<any | null> {
    return (this.prisma as any).invitation.findUnique({
      where: { id },
      include: {
        potentialSeller: {
          include: {
            region: true,
          },
        },
      },
    });
  }

  /**
   * Update invitation status
   */
  async updateStatus(id: string, status: string): Promise<any> {
    return (this.prisma as any).invitation.update({
      where: { id },
      data: { status },
      include: {
        potentialSeller: {
          include: {
            region: true,
          },
        },
      },
    });
  }

  /**
   * Get invitation statistics
   */
  async getStatistics() {
    const [
      totalInvitations,
      pendingInvitations,
      acceptedInvitations,
      rejectedInvitations,
      invitationsByMethod,
    ] = await Promise.all([
      (this.prisma as any).invitation.count(),
      (this.prisma as any).invitation.count({ where: { status: 'PENDING' } }),
      (this.prisma as any).invitation.count({ where: { status: 'ACCEPTED' } }),
      (this.prisma as any).invitation.count({ where: { status: 'REJECTED' } }),
      (this.prisma as any).invitation.groupBy({
        by: ['method'],
        _count: true,
      }),
    ]);

    return {
      totalInvitations,
      pendingInvitations,
      acceptedInvitations,
      rejectedInvitations,
      invitationsByMethod,
    };
  }
}
