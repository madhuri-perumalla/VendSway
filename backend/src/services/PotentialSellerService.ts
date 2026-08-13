import { PotentialSellerRepository } from '../repositories/PotentialSellerRepository';
import { ImportHistoryRepository } from '../repositories/ImportHistoryRepository';
import { InvitationRepository } from '../repositories/InvitationRepository';
import { SellerRepository } from '../repositories/SellerRepository';

/**
 * PotentialSeller Service
 * Handles business logic for potential seller management
 */
export class PotentialSellerService {
  private potentialSellerRepository: PotentialSellerRepository;
  private importHistoryRepository: ImportHistoryRepository;
  private invitationRepository: InvitationRepository;
  private sellerRepository: SellerRepository;

  constructor(
    potentialSellerRepository: PotentialSellerRepository,
    importHistoryRepository: ImportHistoryRepository,
    invitationRepository: InvitationRepository,
    sellerRepository: SellerRepository
  ) {
    this.potentialSellerRepository = potentialSellerRepository;
    this.importHistoryRepository = importHistoryRepository;
    this.invitationRepository = invitationRepository;
    this.sellerRepository = sellerRepository;
  }

  /**
   * Create potential seller
   */
  async createPotentialSeller(data: any) {
    // Check for duplicates
    const existingByEmail = await this.potentialSellerRepository.findByEmail(data.email);
    if (existingByEmail) {
      throw new Error('Potential seller with this email already exists');
    }

    // Only check phone if provided
    if (data.phone && data.phone.trim()) {
      const existingByPhone = await this.potentialSellerRepository.findByPhone(data.phone);
      if (existingByPhone) {
        throw new Error('Potential seller with this phone already exists');
      }
    }

    // Check business name (case-insensitive)
    const existingByBusiness = await this.potentialSellerRepository.findByBusinessName(data.businessName);
    if (existingByBusiness && existingByBusiness.businessName.toLowerCase() === data.businessName.toLowerCase()) {
      throw new Error('Potential seller with this business name already exists');
    }

    return this.potentialSellerRepository.create(data);
  }

  /**
   * Update potential seller
   */
  async updatePotentialSeller(id: string, data: any) {
    return this.potentialSellerRepository.update(id, data);
  }

  /**
   * Delete potential seller
   */
  async deletePotentialSeller(id: string) {
    return this.potentialSellerRepository.delete(id);
  }

  /**
   * Send invitation to potential seller
   */
  async sendInvitation(potentialSellerId: string, method: string, notes?: string) {
    // Create invitation
    const invitation = await this.invitationRepository.create({
      potentialSellerId,
      method,
      notes,
    });

    // Update potential seller status
    await this.potentialSellerRepository.updateStatus(potentialSellerId, 'INVITATION_SENT');

    return invitation;
  }

  /**
   * Mark potential seller as interested
   */
  async markAsInterested(potentialSellerId: string) {
    return this.potentialSellerRepository.updateStatus(potentialSellerId, 'INTERESTED');
  }

  /**
   * Archive potential seller
   */
  async archivePotentialSeller(potentialSellerId: string) {
    return this.potentialSellerRepository.updateStatus(potentialSellerId, 'INACTIVE');
  }

  /**
   * Link potential seller to registered seller account
   */
  async linkToSeller(potentialSellerId: string, sellerData: any) {
    // Check if potential seller exists
    const potentialSeller = await this.potentialSellerRepository.findById(potentialSellerId);
    if (!potentialSeller) {
      throw new Error('Potential seller not found');
    }

    // Check for matching potential seller by email, phone, or business name
    const existingByEmail = await this.potentialSellerRepository.findByEmail(sellerData.email);
    const existingByPhone = await this.potentialSellerRepository.findByPhone(sellerData.phone);
    const existingByBusiness = await this.potentialSellerRepository.findByBusinessName(sellerData.businessName);

    let potentialSellerToLink = existingByEmail || existingByPhone || existingByBusiness;

    if (potentialSellerToLink) {
      // Link to existing potential seller
      return this.potentialSellerRepository.linkToSeller(potentialSellerToLink.id, sellerData.sellerId);
    }

    return null;
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStatistics() {
    const [
      potentialSellerStats,
      invitationStats,
      importStats,
      registeredSellers,
    ] = await Promise.all([
      this.potentialSellerRepository.getStatistics(),
      this.invitationRepository.getStatistics(),
      this.importHistoryRepository.getStatistics(),
      this.sellerRepository.findAll(),
    ]);

    const approvedSellers = registeredSellers.filter(s => s.status === 'APPROVED').length;
    const rejectedSellers = registeredSellers.filter(s => s.status === 'REJECTED').length;

    return {
      potentialSellers: potentialSellerStats,
      invitations: invitationStats,
      imports: importStats,
      registeredSellers: {
        total: registeredSellers.length,
        approved: approvedSellers,
        rejected: rejectedSellers,
        msme: registeredSellers.filter(s => s.msme).length,
        gi: registeredSellers.filter(s => s.giTagged).length,
      },
    };
  }

  /**
   * Get potential sellers with filters
   */
  async getPotentialSellers(filters: any) {
    return this.potentialSellerRepository.getWithFilters(filters);
  }

  /**
   * Search potential sellers
   */
  async searchPotentialSellers(query: string) {
    return this.potentialSellerRepository.search(query);
  }

  /**
   * Get import history
   */
  async getImportHistory() {
    return this.importHistoryRepository.findAll();
  }

  /**
   * Get invitations
   */
  async getInvitations() {
    return this.invitationRepository.findAll();
  }

  /**
   * Get invitations by potential seller
   */
  async getInvitationsByPotentialSeller(potentialSellerId: string) {
    return this.invitationRepository.getByPotentialSeller(potentialSellerId);
  }
}
