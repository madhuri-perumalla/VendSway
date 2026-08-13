// ============================================================================
// MARKETING GENERATOR
// ============================================================================
// Generates deterministic marketing content using templates

import { MarketingContent } from './types';

class MarketingGenerator {
  /**
   * Generate marketing content based on context
   */
  generateMarketingContent(context: {
    festival?: string;
    region: string;
    category: string;
    products: any[];
    targetAudience?: string[];
  }): MarketingContent[] {
    const contents: MarketingContent[] = [];

    // Generate WhatsApp content
    contents.push(this.generateWhatsApp(context));

    // Generate Instagram content
    contents.push(this.generateInstagram(context));

    // Generate Facebook content
    contents.push(this.generateFacebook(context));

    // Generate email subject
    contents.push(this.generateEmailSubject(context));

    return contents;
  }

  /**
   * Generate WhatsApp marketing content
   */
  private generateWhatsApp(context: any): MarketingContent {
    const { festival, region, category, products } = context;
    const productCount = products.length;
    const festivalText = festival ? `🎉 ${festival} Special! ` : '';

    const content = `${festivalText}✨ Discover ${productCount} authentic ${category} products from ${region}\n\n✅ Handcrafted by verified artisans\n🚚 Pan-India delivery\n💯 100% Authentic\n\nShop now for exclusive discounts! 🛍️`;

    return {
      platform: 'whatsapp',
      content,
      targetAudience: context.targetAudience || ['Women', '25-45'],
      context: {
        festival,
        region,
        category,
        products,
      },
    };
  }

  /**
   * Generate Instagram marketing content
   */
  private generateInstagram(context: any): MarketingContent {
    const { festival, region, category, products } = context;
    const festivalText = festival ? `${festival} Special! ` : '';

    const content = `${festivalText}✨ Celebrate the rich heritage of ${region} with our exclusive ${category} collection! 🎨\n\n🧵 Handcrafted by local artisans\n✅ 100% Authentic & Traditional\n🚚 Pan-India delivery\n\nShop now and support traditional craftsmanship! 💕\n\n#${region.replace(/\s+/g, '')} #Handloom #TraditionalFashion #RegionalCrafts #SupportArtisans`;

    return {
      platform: 'instagram',
      content,
      hashtags: [region.replace(/\s+/g, ''), 'Handloom', 'TraditionalFashion', 'RegionalCrafts', 'SupportArtisans'],
      targetAudience: context.targetAudience || ['Women', '25-45'],
      context: {
        festival,
        region,
        category,
        products,
      },
    };
  }

  /**
   * Generate Facebook marketing content
   */
  private generateFacebook(context: any): MarketingContent {
    const { festival, region, category, products } = context;
    const productCount = products.length;
    const festivalText = festival ? `${festival} Exclusive ` : '';

    const content = `${festivalText}${region} Regional Collection\n\nDiscover authentic handcrafted ${category} products from verified artisans. Each piece tells a story of tradition and craftsmanship.\n\n✨ ${productCount} Products Available\n✅ GI Tagged & Verified\n🚚 Fast Delivery Across India\n\nSupport local artisans and bring home the essence of ${region}.`;

    return {
      platform: 'facebook',
      content,
      targetAudience: context.targetAudience || ['Women', '25-45'],
      context: {
        festival,
        region,
        category,
        products,
      },
    };
  }

  /**
   * Generate email subject line
   */
  private generateEmailSubject(context: any): MarketingContent {
    const { festival, region, category } = context;
    let subject = '';

    if (festival) {
      subject = `🎉 ${festival} Special: Exclusive ${region} ${category} Collection Inside!`;
    } else {
      subject = `✨ New ${region} ${category} Collection - Handcrafted with Love`;
    }

    return {
      platform: 'email',
      content: '',
      subject,
      targetAudience: context.targetAudience || ['Women', '25-45'],
      context: {
        festival,
        region,
        category,
        products: context.products,
      },
    };
  }

  /**
   * Generate campaign-specific marketing content
   */
  generateCampaignContent(campaign: {
    name: string;
    type: string;
    festival?: string;
    region: string;
    category?: string;
    targetAudience: string[];
  }): {
    whatsapp: string;
    instagram: string;
    facebook: string;
    emailSubject: string;
  } {
    const context = {
      festival: campaign.festival,
      region: campaign.region,
      category: campaign.category || 'Regional Products',
      products: [],
      targetAudience: campaign.targetAudience,
    };

    const whatsapp = this.generateWhatsApp(context).content;
    const instagram = this.generateInstagram(context).content;
    const facebook = this.generateFacebook(context).content;
    const emailSubject = this.generateEmailSubject(context).subject || '';

    return {
      whatsapp,
      instagram,
      facebook,
      emailSubject,
    };
  }

  /**
   * Generate product description
   */
  generateProductDescription(product: {
    name: string;
    category: string;
    region: string;
    textile?: string;
    price?: number;
  }): string {
    const { name, category, region, textile, price } = product;
    const textileText = textile ? `Crafted from authentic ${textile}` : 'Made with traditional techniques';
    const priceText = price ? `Priced at ₹${price}` : '';

    return `Experience the rich heritage of ${region} with this exquisite ${name}. ${textileText}, this ${category} piece showcases the exceptional craftsmanship of local artisans. ${priceText} Each piece is a testament to India's diverse textile traditions.`;
  }

  /**
   * Generate promotional title
   */
  generatePromotionalTitle(context: {
    festival?: string;
    region: string;
    category: string;
    discount?: number;
  }): string {
    const { festival, region, category, discount } = context;
    const discountText = discount ? `${discount}% OFF` : 'Exclusive Collection';

    if (festival) {
      return `${festival} Special: ${region} ${category} - ${discountText}`;
    } else {
      return `${region} ${category} - ${discountText}`;
    }
  }
}

export default new MarketingGenerator();