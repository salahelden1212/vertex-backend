import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // Contact Information
  phone: {
    type: String,
    required: true,
    trim: true,
    default: '+20 100 000 0000'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    default: 'info@vertexfinish.com'
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true,
    default: '+201000000000'
  },
  address: {
    ar: {
      type: String,
      default: 'القاهرة، جمهورية مصر العربية'
    },
    en: {
      type: String,
      default: 'Cairo, Egypt'
    }
  },
  
  // Social Media Links
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    tiktok: {
      type: String,
      trim: true
    }
  },

  // Google Maps
  googleMapsLink: {
    type: String,
    trim: true
  },
  googleMapsEmbed: {
    type: String,
    trim: true
  },

  // Working Hours
  workingHours: {
    ar: {
      type: String,
      default: 'السبت - الخميس: 9:00 ص - 5:00 م'
    },
    en: {
      type: String,
      default: 'Saturday - Thursday: 9:00 AM - 5:00 PM'
    }
  },

  // Footer Text
  footerText: {
    ar: {
      type: String,
      default: 'جميع الحقوق محفوظة © 2024 فيرتكس فينش'
    },
    en: {
      type: String,
      default: 'All Rights Reserved © 2024 Vertex Finish'
    }
  },

  // SEO Settings
  seo: {
    title: {
      ar: {
        type: String,
        default: 'فيرتكس فينش - التشطيبات على أعلى مستوى'
      },
      en: {
        type: String,
        default: 'Vertex Finish - Finishing at the Highest Level'
      }
    },
    description: {
      ar: {
        type: String,
        default: 'شركة تشطيبات راقية متخصصة في التشطيبات السكنية والتجارية والإدارية'
      },
      en: {
        type: String,
        default: 'Premium finishing company specialized in residential, commercial and administrative projects'
      }
    },
    keywords: {
      ar: {
        type: String,
        default: 'تشطيبات, ديكور, تصميم داخلي, فيرتكس'
      },
      en: {
        type: String,
        default: 'finishing, decoration, interior design, vertex'
      }
    }
  },

  // Email Notifications
  notificationEmails: [{
    type: String,
    trim: true
  }],

  // Maintenance Mode
  maintenanceMode: {
    type: Boolean,
    default: false
  },

  // Logo URLs
  logo: {
    light: {
      type: String,
      trim: true
    },
    dark: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('SiteSettings', siteSettingsSchema);
